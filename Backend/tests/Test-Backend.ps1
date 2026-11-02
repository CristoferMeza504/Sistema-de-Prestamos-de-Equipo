# Requiere PowerShell 7.5 o superior, API iniciada y el contenedor PostgreSQL del proyecto.
# Crea datos con un prefijo único y retira solo esos datos al finalizar.
param(
    [string]$BaseUrl = 'http://localhost:5024',
    [string]$ContainerName = 'postgres-prestamos'
)

$ErrorActionPreference = 'Stop'
$taskPrefix = 'codex_' + [guid]::NewGuid().ToString('N')
$script:checks = 0

function Assert-True([bool]$Condition, [string]$Message) {
    if (-not $Condition) { throw $Message }
    $script:checks++
}

function Invoke-Api([string]$Method, [string]$Path, [int]$Status, $Body = $null) {
    $taskOptions = @{ Uri = "$BaseUrl$Path"; Method = $Method; SkipHttpErrorCheck = $true }
    if ($null -ne $Body) {
        $taskOptions.ContentType = 'application/json'
        $taskOptions.Body = if ($Body -is [string]) { $Body } else { $Body | ConvertTo-Json -Depth 5 }
    }
    $taskResponse = Invoke-WebRequest @taskOptions
    $taskContent = if ($taskResponse.Content -is [byte[]]) { [System.Text.Encoding]::UTF8.GetString($taskResponse.Content) } else { [string]$taskResponse.Content }
    Assert-True ([int]$taskResponse.StatusCode -eq $Status) "$Method $Path esperaba $Status, obtuvo $($taskResponse.StatusCode): $taskContent"
    if ($Status -eq 204) { Assert-True ([string]::IsNullOrEmpty($taskContent)) 'Una respuesta 204 no debe tener cuerpo.' }
    $taskData = if ($taskContent) { ConvertFrom-Json $taskContent -AsHashtable -DateKind String }
    return [pscustomobject]@{ Data = $taskData; Response = $taskResponse }
}

function New-TestEquipo([string]$Suffix, [string]$Estado = 'Disponible') {
    (Invoke-Api POST '/api/equipos' 201 @{ nombre = "$taskPrefix $Suffix"; tipo = 'Tipo libre'; estado = $Estado }).Data
}

function Invoke-ParallelRequests($Requests) {
    $taskUrl = $BaseUrl
    $Requests | ForEach-Object -Parallel {
        $taskRequest = $_
        $taskArgs = @{ Uri = "$using:taskUrl$($taskRequest.Path)"; Method = $taskRequest.Method; SkipHttpErrorCheck = $true }
        if ($taskRequest.Body) {
            $taskArgs.ContentType = 'application/json'
            $taskArgs.Body = $taskRequest.Body | ConvertTo-Json
        }
        $taskResponse = Invoke-WebRequest @taskArgs
        [int]$taskResponse.StatusCode
    } -ThrottleLimit 2
}

try {
    # Listados y contratos de errores.
    foreach ($taskResource in @('equipos', 'usuarios', 'prestamos')) {
        $null = Invoke-Api GET "/api/$taskResource" 200
        $null = Invoke-Api GET "/api/$taskResource/2147483647" 404
    }
    $taskError = Invoke-Api POST '/api/usuarios' 400 @{ nombre = ''; correo = 'incorrecto' }
    Assert-True ($null -ne $taskError.Data.errors) 'La validación debe informar errores por campo.'
    $null = Invoke-Api POST '/api/usuarios' 400 @{ nombre = ('x' * 101); correo = 'x@example.test' }
    $null = Invoke-Api POST '/api/usuarios' 400 @{ nombre = 'Nombre'; correo = (('x' * 140) + '@example.test') }
    foreach ($taskBody in @('null', '{}', '{')) { $null = Invoke-Api POST '/api/equipos' 400 $taskBody }
    foreach ($taskBody in @(
        @{ nombre = ' '; tipo = 'Laptop'; estado = 'Disponible' },
        @{ nombre = 'Nombre'; tipo = ''; estado = 'Disponible' },
        @{ nombre = ('x' * 101); tipo = 'Laptop'; estado = 'Disponible' },
        @{ nombre = 'Nombre'; tipo = ('x' * 251); estado = 'Disponible' },
        @{ nombre = 'Nombre'; tipo = 'Laptop'; estado = 'Prestado' },
        @{ nombre = 'Nombre'; tipo = 'Laptop'; estado = 'Desconocido' }
    )) { $null = Invoke-Api POST '/api/equipos' 400 $taskBody }
    $null = Invoke-Api POST '/api/prestamos' 400 @{ usuarioId = 0; equipoId = -1 }
    $null = Invoke-Api GET '/api/prestamos?estado=Incorrecto' 400
    $null = Invoke-Api GET '/api/prestamos?usuarioId=0' 400
    $null = Invoke-Api GET '/api/prestamos?equipoId=abc' 400
    $null = Invoke-Api GET '/api/equipos?estado=Incorrecto' 400
    Write-Host 'Validación de DTOs y solicitudes inválidas: OK'

    # Usuarios: CRUD, correo normalizado y unicidad.
    $taskUsuarioResult = Invoke-Api POST '/api/usuarios' 201 @{ nombre = " $taskPrefix usuario "; correo = "$taskPrefix@example.test"; id = 2147483647; prestamos = @() }
    $taskUsuario = $taskUsuarioResult.Data
    Assert-True ($taskUsuario.id -ne 2147483647) 'El cliente no debe controlar el Id.'
    Assert-True (-not $taskUsuario.Contains('prestamos')) 'El DTO no debe exponer relaciones.'
    Assert-True ([string]$taskUsuarioResult.Response.Headers.Location[0] -match "/api/Usuarios/$($taskUsuario.id)$") 'Location debe apuntar al usuario individual.'
    $null = Invoke-Api GET "/api/usuarios/$($taskUsuario.id)" 200
    $null = Invoke-Api POST '/api/usuarios' 409 @{ nombre = 'Duplicado'; correo = "$taskPrefix@example.test".ToUpperInvariant() }
    $null = Invoke-Api PUT "/api/usuarios/$($taskUsuario.id)" 204 @{ nombre = "$taskPrefix actualizado"; correo = "$taskPrefix@example.test" }
    $null = Invoke-Api PUT "/api/usuarios/$($taskUsuario.id)" 400 @{ nombre = ''; correo = 'incorrecto' }
    $taskOtroUsuario = (Invoke-Api POST '/api/usuarios' 201 @{ nombre = "$taskPrefix otro"; correo = "${taskPrefix}_otro@example.test" }).Data
    $null = Invoke-Api PUT "/api/usuarios/$($taskOtroUsuario.id)" 409 @{ nombre = 'Otro'; correo = "$taskPrefix@example.test" }
    $taskBorrable = (Invoke-Api POST '/api/usuarios' 201 @{ nombre = "$taskPrefix borrar"; correo = "${taskPrefix}_borrar@example.test" }).Data
    $null = Invoke-Api DELETE "/api/usuarios/$($taskBorrable.id)" 204
    $null = Invoke-Api GET "/api/usuarios/$($taskBorrable.id)" 404
    $null = Invoke-Api DELETE "/api/usuarios/$($taskBorrable.id)" 404
    $null = Invoke-Api PUT '/api/usuarios/2147483647' 404 @{ nombre = 'Nombre'; correo = 'valido@example.test' }

    # Equipos: CRUD, estados, filtros y DTO de salida.
    $taskBorrable = New-TestEquipo 'borrar'
    $null = Invoke-Api PUT "/api/equipos/$($taskBorrable.id)" 204 @{ nombre = "$taskPrefix actualizado"; tipo = 'Otro tipo libre'; estado = 'Mantenimiento' }
    $taskActualizado = (Invoke-Api GET "/api/equipos/$($taskBorrable.id)" 200).Data
    Assert-True ($taskActualizado.tipo -eq 'Otro tipo libre' -and $taskActualizado.estado -eq 'Mantenimiento') 'El equipo debe persistir los cambios.'
    Assert-True (-not $taskActualizado.Contains('prestamos')) 'No deben exponerse navegaciones.'
    $null = Invoke-Api PUT "/api/equipos/$($taskBorrable.id)" 400 @{ nombre = ' '; tipo = 'Tipo'; estado = 'Disponible' }
    $null = Invoke-Api PUT "/api/equipos/$($taskBorrable.id)" 409 @{ nombre = 'Nombre'; tipo = 'Tipo'; estado = 'Prestado' }
    $null = Invoke-Api DELETE "/api/equipos/$($taskBorrable.id)" 204
    $null = Invoke-Api GET "/api/equipos/$($taskBorrable.id)" 404
    $null = Invoke-Api DELETE "/api/equipos/$($taskBorrable.id)" 404
    $null = Invoke-Api PUT '/api/equipos/2147483647' 404 @{ nombre = 'Nombre'; tipo = 'Tipo'; estado = 'Disponible' }
    $taskEquipos = @(1..5 | ForEach-Object { New-TestEquipo "equipo $_" })
    $taskMantenimiento = New-TestEquipo 'mantenimiento' 'Mantenimiento'
    $null = Invoke-Api POST '/api/prestamos' 409 @{ usuarioId = $taskUsuario.id; equipoId = $taskMantenimiento.id }
    $taskDisponibles = @((Invoke-Api GET '/api/equipos?estado=Disponible' 200).Data)
    Assert-True (-not ($taskDisponibles | Where-Object id -eq $taskMantenimiento.id)) 'Mantenimiento no debe aparecer disponible.'
    Write-Host 'CRUD de usuarios/equipos, correo único y estados: OK'

    # Préstamos: fechas del servidor, cupo, disponibilidad e historial.
    $null = Invoke-Api POST '/api/prestamos' 404 @{ usuarioId = 2147483647; equipoId = $taskEquipos[0].id }
    $null = Invoke-Api POST '/api/prestamos' 404 @{ usuarioId = $taskUsuario.id; equipoId = 2147483647 }
    $taskPrestamos = @()
    foreach ($taskEquipo in $taskEquipos[0..3]) {
        $taskResult = Invoke-Api POST '/api/prestamos' 201 @{ usuarioId = $taskUsuario.id; equipoId = $taskEquipo.id; estado = 'Devuelto'; fechaPrestamo = '2000-01-01'; fechaDevolucion = '2000-01-02' }
        $taskPrestamos += $taskResult.Data
    }
    $taskPrimero = $taskPrestamos[0]
    Assert-True ($taskPrimero.estado -eq 'Activo' -and $null -eq $taskPrimero.fechaDevolucion) 'El servidor debe controlar estado y fechas.'
    $taskFechaPrestamo = [datetimeoffset]::Parse($taskPrimero.fechaPrestamo).UtcDateTime
    $taskFechaLimite = [datetimeoffset]::Parse($taskPrimero.fechaLimite).UtcDateTime
    Assert-True ($taskFechaPrestamo -gt [datetime]::UtcNow.AddMinutes(-5)) 'La fecha debe ser la fecha actual del servidor.'
    Assert-True ($taskPrimero.fechaPrestamo.EndsWith('Z')) 'Las fechas deben estar en UTC.'
    Assert-True ($taskFechaPrestamo.AddMonths(2) -eq $taskFechaLimite) 'El vencimiento debe ser a dos meses calendario.'
    $taskPrestado = (Invoke-Api GET "/api/equipos/$($taskEquipos[0].id)" 200).Data
    Assert-True ($taskPrestado.estado -eq 'Prestado') 'El equipo debe pasar a Prestado.'
    $null = Invoke-Api POST '/api/prestamos' 409 @{ usuarioId = $taskOtroUsuario.id; equipoId = $taskEquipos[0].id }
    $null = Invoke-Api POST '/api/prestamos' 409 @{ usuarioId = $taskUsuario.id; equipoId = $taskEquipos[4].id }
    $taskQuintoEquipo = (Invoke-Api GET "/api/equipos/$($taskEquipos[4].id)" 200).Data
    Assert-True ($taskQuintoEquipo.estado -eq 'Disponible') 'Un rechazo no debe modificar el equipo.'
    $null = Invoke-Api PUT "/api/equipos/$($taskEquipos[0].id)" 409 @{ nombre = 'Nombre'; tipo = 'Tipo'; estado = 'Disponible' }
    $null = Invoke-Api PUT "/api/equipos/$($taskEquipos[0].id)" 204 @{ nombre = "$taskPrefix prestado editado"; tipo = 'Tipo libre'; estado = 'Prestado' }
    $null = Invoke-Api DELETE "/api/equipos/$($taskEquipos[0].id)" 409
    $null = Invoke-Api DELETE "/api/usuarios/$($taskUsuario.id)" 409
    $taskActivos = @((Invoke-Api GET "/api/prestamos?usuarioId=$($taskUsuario.id)&estado=Activo" 200).Data)
    Assert-True ($taskActivos.Count -eq 4) 'El usuario debe tener cuatro préstamos activos.'
    $taskPorEquipo = @((Invoke-Api GET "/api/prestamos?equipoId=$($taskEquipos[0].id)" 200).Data)
    Assert-True ($taskPorEquipo.Count -eq 1 -and $taskPorEquipo[0].id -eq $taskPrimero.id) 'Filtro por equipo incorrecto.'
    $null = Invoke-Api POST "/api/prestamos/$($taskPrimero.id)/devolucion" 204
    $null = Invoke-Api POST "/api/prestamos/$($taskPrimero.id)/devolucion" 409
    $taskDevuelto = (Invoke-Api GET "/api/prestamos/$($taskPrimero.id)" 200).Data
    Assert-True ($taskDevuelto.estado -eq 'Devuelto' -and $null -ne $taskDevuelto.fechaDevolucion) 'Debe guardarse la devolución real.'
    $taskDisponible = (Invoke-Api GET "/api/equipos/$($taskEquipos[0].id)" 200).Data
    Assert-True ($taskDisponible.estado -eq 'Disponible') 'La devolución debe liberar el equipo.'
    $null = Invoke-Api DELETE "/api/equipos/$($taskEquipos[0].id)" 409
    $taskHistorial = @((Invoke-Api GET "/api/prestamos?usuarioId=$($taskUsuario.id)&estado=Devuelto" 200).Data)
    Assert-True ($taskHistorial.Count -eq 1) 'El historial debe conservar la devolución.'
    $null = Invoke-Api POST '/api/prestamos' 201 @{ usuarioId = $taskUsuario.id; equipoId = $taskEquipos[4].id }
    $null = Invoke-Api POST '/api/prestamos/2147483647/devolucion' 404
    $null = Invoke-Api DELETE "/api/prestamos/$($taskPrimero.id)" 405
    Write-Host 'Préstamos, devoluciones, fechas y conservación del historial: OK'

    # Dos solicitudes compiten por el último cupo de un usuario.
    $null = Invoke-Api POST "/api/prestamos/$($taskPrestamos[1].id)/devolucion" 204
    $taskConcurrentes = @(New-TestEquipo 'cupo A'; New-TestEquipo 'cupo B')
    $taskRequests = @($taskConcurrentes | ForEach-Object { @{ Method = 'POST'; Path = '/api/prestamos'; Body = @{ usuarioId = $taskUsuario.id; equipoId = $_.id } } })
    $taskStatuses = @(Invoke-ParallelRequests $taskRequests)
    Assert-True ((@($taskStatuses | Where-Object { $_ -eq 201 }).Count -eq 1) -and (@($taskStatuses | Where-Object { $_ -eq 409 }).Count -eq 1)) "Cupo concurrente incorrecto: $taskStatuses"
    $taskActivos = @((Invoke-Api GET "/api/prestamos?usuarioId=$($taskUsuario.id)&estado=Activo" 200).Data)
    Assert-True ($taskActivos.Count -eq 4) 'La concurrencia no debe superar cuatro activos.'

    # Dos usuarios compiten por el mismo equipo.
    $taskTercerUsuario = (Invoke-Api POST '/api/usuarios' 201 @{ nombre = "$taskPrefix tercero"; correo = "${taskPrefix}_tercero@example.test" }).Data
    $taskCompartido = New-TestEquipo 'compartido'
    $taskRequests = @($taskOtroUsuario.id, $taskTercerUsuario.id | ForEach-Object { @{ Method = 'POST'; Path = '/api/prestamos'; Body = @{ usuarioId = $_; equipoId = $taskCompartido.id } } })
    $taskStatuses = @(Invoke-ParallelRequests $taskRequests)
    Assert-True ((@($taskStatuses | Where-Object { $_ -eq 201 }).Count -eq 1) -and (@($taskStatuses | Where-Object { $_ -eq 409 }).Count -eq 1)) "Préstamo concurrente incorrecto: $taskStatuses"

    # Dos devoluciones del mismo préstamo.
    $taskRequests = @(1..2 | ForEach-Object { @{ Method = 'POST'; Path = "/api/prestamos/$($taskPrestamos[2].id)/devolucion" } })
    $taskStatuses = @(Invoke-ParallelRequests $taskRequests)
    Assert-True ((@($taskStatuses | Where-Object { $_ -eq 204 }).Count -eq 1) -and (@($taskStatuses | Where-Object { $_ -eq 409 }).Count -eq 1)) "Devolución concurrente incorrecta: $taskStatuses"

    # Dos altas con el mismo correo, con diferencias de mayúsculas.
    $taskRequests = @('race', 'RACE' | ForEach-Object { @{ Method = 'POST'; Path = '/api/usuarios'; Body = @{ nombre = "$taskPrefix correo"; correo = "${taskPrefix}_$_@example.test" } } })
    $taskStatuses = @(Invoke-ParallelRequests $taskRequests)
    Assert-True ((@($taskStatuses | Where-Object { $_ -eq 201 }).Count -eq 1) -and (@($taskStatuses | Where-Object { $_ -eq 409 }).Count -eq 1)) "Correo concurrente incorrecto: $taskStatuses"
    Write-Host 'Concurrencia de cupo, equipo, devolución y correo: OK'
}
finally {
    # Limpieza exclusiva del conjunto de datos de esta ejecución, incluso si falla una comprobación.
    $taskSql = @"
BEGIN;
DELETE FROM "Prestamos" WHERE "UsuarioId" IN (SELECT "Id" FROM "Usuarios" WHERE "Correo" LIKE '${taskPrefix}%@example.test');
DELETE FROM "Equipos" WHERE "Nombre" LIKE '$taskPrefix%';
DELETE FROM "Usuarios" WHERE "Correo" LIKE '${taskPrefix}%@example.test';
COMMIT;
"@
    $taskCleanup = $taskSql | docker exec --interactive $ContainerName sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
    if ($LASTEXITCODE -ne 0) { throw "No se pudo limpiar el conjunto de prueba $taskPrefix. $taskCleanup" }
    Write-Host "Datos temporales retirados: $taskPrefix"
}

Write-Host "Pruebas completadas: $script:checks comprobaciones correctas."
