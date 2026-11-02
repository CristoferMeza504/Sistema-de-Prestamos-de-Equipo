# Backend de préstamos de equipo

Implementación de estudio en .NET 10, con API, Application, Domain e Infrastructure. Incluye CRUD de usuarios/equipos y registro, consulta y devolución de préstamos. Sin autenticación por decisión del proyecto. Incluye documentación interactiva con Scalar en desarrollo.

## Ejecutar

Desde la raíz del repositorio, preparar `Infra/.env` usando `Infra/.env.example` y `Backend/Sistema-Prestamos-de-Equipos/PrestamosEquipos.API/.env` usando `example.env` de esa misma carpeta. La base, usuario y contraseña deben coincidir entre ambos archivos. Los `.env` reales no se versionan.

```powershell
docker compose -f Infra/compose.yaml up -d
cd Backend/Sistema-Prestamos-de-Equipos
dotnet tool restore
dotnet restore
dotnet build
dotnet ef database update --project PrestamosEquipos.Infrastructure --startup-project PrestamosEquipos.API
cd PrestamosEquipos.API
dotnet run --launch-profile http
```

Ejecutar la API desde su carpeta permite que `Env.Load()` encuentre el `.env` local. Los comandos EF usan la API como proyecto de arranque. La migración inicial existente crea las tres tablas; no hay que generar otra para comenzar.

API HTTP: `http://localhost:5024`. El perfil `https` también está disponible según `Properties/launchSettings.json`. En Development, abrir [Scalar](http://localhost:5024/scalar/v1) para explorar los endpoints y enviar solicitudes. El contrato se sirve en `/openapi/v1.json`. Ambas rutas solo están habilitadas en desarrollo, siguiendo la [integración oficial de Scalar](https://scalar.com/products/api-references/integrations/aspnetcore/integration). Las operaciones ejecutadas desde Scalar modifican datos igual que el cliente HTTP.

`Cors:AllowedOrigins` en `appsettings.json` permite por defecto `http://localhost:5173` para el futuro cliente React. Ajustar esa lista al origen real del cliente; CORS no es autenticación.

## Endpoints

| Método | Ruta | Resultado exitoso |
| --- | --- | --- |
| GET | `/api/usuarios` | 200, lista de usuarios |
| GET | `/api/usuarios/{id}` | 200, usuario |
| POST | `/api/usuarios` | 201 y Location individual |
| PUT | `/api/usuarios/{id}` | 204 |
| DELETE | `/api/usuarios/{id}` | 204, si no tiene historial |
| GET | `/api/equipos?estado=Disponible` | 200, lista; estado opcional |
| GET | `/api/equipos/{id}` | 200, equipo |
| POST | `/api/equipos` | 201 y Location individual |
| PUT | `/api/equipos/{id}` | 204 |
| DELETE | `/api/equipos/{id}` | 204, si no tiene historial |
| GET | `/api/prestamos` | 200, historial; filtros opcionales `usuarioId`, `equipoId`, `estado` |
| GET | `/api/prestamos/{id}` | 200, préstamo |
| POST | `/api/prestamos` | 201 y Location individual |
| POST | `/api/prestamos/{id}/devolucion` | 204 |

No se ofrecen modificación general ni borrado de préstamos: las devoluciones preservan el historial. Para consultar activos usar `GET /api/prestamos?estado=Activo`; se puede combinar con usuario/equipo.

## Contratos y reglas

- Usuario: `nombre` obligatorio, máximo 100; `correo` obligatorio, máximo 150, formato válido. Se normaliza a minúsculas y no puede repetirse, incluso usando mayúsculas.
- Equipo: `nombre` obligatorio, máximo 100; `tipo` texto libre obligatorio, máximo 250. Los valores de estado se envían tal como se muestran: `Disponible`, `Prestado`, `Mantenimiento`.
- Al crear un equipo se admite `Disponible` o `Mantenimiento`. `Prestado` se asigna al registrar un préstamo.
- PUT de equipo recibe nombre, tipo y estado completos. Mientras exista un préstamo activo, solo permite conservar `Prestado`; sin préstamo activo no permite asignar manualmente `Prestado`. Se pueden editar nombre y tipo conservando el estado coherente.
- Crear préstamo recibe solo `usuarioId` y `equipoId`, positivos y existentes. Solo admite equipos disponibles, sin préstamo activo, y usuarios con menos de cuatro préstamos activos.
- El servidor asigna `Activo` y `fechaPrestamo` UTC. La respuesta calcula `fechaLimite = fechaPrestamo.AddMonths(2)`: dos meses calendario, no sesenta días. En un mes sin el día original se usa el último día válido según AddMonths.
- `fechaDevolucion` es null hasta registrar la entrega real. La devolución asigna la fecha UTC, pasa el préstamo a `Devuelto` y el equipo a `Disponible`. Una segunda devolución es un conflicto.
- Cualquier préstamo, activo o devuelto, impide eliminar el usuario o equipo relacionado.
- Las entradas/salidas usan DTOs, sin Id de entrada ni propiedades de navegación. El cliente no controla fechas o estados del préstamo.

Errores: 400 para entradas/filtros inválidos, 404 para recursos inexistentes y 409 para conflictos de negocio o concurrencia. Se devuelven respuestas ProblemDetails; la validación incluye `errors` por campo. Un fallo inesperado devuelve 500 sin exponer detalles internos.

## Organización y transacciones

`Application/Features` agrupa DTOs, validadores y servicios por Equipos, Usuarios y Prestamos. Los servicios validan con FluentValidation y contienen los casos de uso; los controladores traducen a HTTP. Los repositorios implementan los contratos de Application usando EF Core en Infrastructure.

`IUnitOfWork` es el contrato de una transacción. Infrastructure lo implementa con aislamiento Serializable: cada cambio se ejecuta junto con sus comprobaciones. Si PostgreSQL detecta una colisión de operaciones simultáneas, se revierte y se vuelve a evaluar el caso de uso, con reintentos limitados. Así no se guarda un préstamo sin actualizar el equipo, ni se supera el cupo mediante solicitudes concurrentes. No requiere nuevas tablas.

FluentValidation se registra por ensamblado y se ejecuta explícitamente de forma asíncrona en los servicios, siguiendo su [documentación oficial](https://docs.fluentvalidation.net/en/latest/di.html).

## Verificar

`PrestamosEquipos.API/PrestamosEquipos.API.http` contiene ejemplos manuales. Ejecutar los bloques individualmente y sustituir los Id iniciales (0) por los de datos propios de prueba; los POST/PUT/DELETE modifican datos reales. Los ejemplos no dependen de Scalar.

Para comprobaciones automáticas, con la API iniciada y desde la raíz del repositorio:

```powershell
pwsh -File Backend/tests/Test-Backend.ps1
```

Requiere PowerShell 7.5 o superior y acceso a Docker. Se puede cambiar el servidor o contenedor con `-BaseUrl` y `-ContainerName`. El script debe apuntar a la API y contenedor del mismo entorno de desarrollo.

Comprueba CRUD, respuestas HTTP, validaciones, correo único, DTOs, filtros, fechas, máximo de cuatro préstamos, devoluciones, historial y concurrencia. Usa un prefijo único y retira sus propios registros mediante SQL al terminar, incluidos sus préstamos temporales; no elimina registros del usuario ni reinicia secuencias. Los identificadores pueden avanzar por las inserciones de prueba.
