# Contexto y seguimiento de clases

## Instrucciones del usuario

- Este es un proyecto pequeño de estudio para aplicar progresivamente los conceptos de las clases.
- El usuario proporcionará el contexto y el contenido de cada clase, en orden.
- No modificar el código hasta que el usuario lo indique explícitamente. La autorización para crear este archivo solo permite documentar el seguimiento.
- Al revisar una clase, identificar qué conceptos están aplicados, dónde aparecen, cuáles están parcialmente aplicados y qué falta.
- Mantener las propuestas dentro del alcance del proyecto y del contenido ya estudiado. No agregar complejidad solo para demostrar un patrón o principio.
- El código de las clases sirve de guía para cuando se autorice programar: seguir los conceptos y el enfoque enseñados, adaptando entidades, nombres, casos de uso y configuración al Sistema de Préstamos de Equipo. No copiar literalmente el ejemplo de HabitForge ni tratar sus detalles particulares como requisitos de esta app.
- Evolución progresiva del código: el usuario autoriza refactorizar el código escrito previamente por el asistente cuando sea necesario al aplicar las clases. No conservar una implementación anterior solo porque ya funciona si la clase introduce una organización o un enfoque que corresponde adoptar. Esta autorización cubre los ajustes necesarios dentro de la implementación de cada clase, sin pedir una aprobación separada por cada refactorización. Mantener el alcance de estudio, preservar las funcionalidades y respetar las decisiones de posponer una clase (como la 7). Recibir material para analizar o pedir actualizar este seguimiento no obliga por sí solo a implementar toda la clase en ese turno.
- Explicar los conceptos y el motivo de los cambios cuando se autorice su implementación.
- Consultar este archivo al retomar el trabajo y contrastar sus observaciones con el código actual: es un registro, no una garantía del estado futuro.
- El usuario autorizó mantener este archivo actualizado con la información indispensable y las evaluaciones de las siguientes clases.
- Instrucción permanente confirmada por el usuario: actualizar este seguimiento por iniciativa propia siempre que haya información importante que sea vital conservar, sin esperar recordatorios. Registrar decisiones, autorizaciones, restricciones, cambios relevantes, resultados de verificación y pendientes; mantenerlo conciso y distinguir propuestas de implementaciones comprobadas.

## Contexto de la aplicación

Sistema de Préstamos de Equipo: aplicación web para gestionar préstamos y devoluciones dentro de una organización, universidad o departamento de TI.

Tecnologías previstas: C#, ASP.NET Core Web API, Entity Framework Core, PostgreSQL y React.

Alcance:

- Usuarios: registrar, consultar, editar y eliminar.
- Equipos: registrar, consultar, editar, eliminar y consultar disponibilidad.
- Préstamos: registrar, consultar activos, registrar devoluciones, consultar historial y filtrar por usuario, equipo o estado.

Reglas de negocio previstas:

- Impedir prestar un equipo que ya esté prestado.
- Impedir registrar una devolución de un préstamo ya cerrado.
- Impedir operaciones con información inválida.

Solo tres tablas principales:

| Entidad | Campos |
| --- | --- |
| Usuario | Id, Nombre, Correo |
| Equipo | Id, Nombre, Tipo, Estado |
| Prestamo | Id, UsuarioId, EquipoId, FechaPrestamo, FechaDevolucion, Estado |

Relaciones: un usuario tiene muchos préstamos y un equipo tiene muchos préstamos a lo largo del tiempo. Cada préstamo corresponde a un usuario y a un equipo.

## Estado observado en la revisión inicial — 2026-10-31

Revisión estática del código; no se comprobó compilación, ejecución, conexión a PostgreSQL ni aplicación de migraciones.

- Monorepo con `Backend`, `Frontend`, `Infra`, repositorio Git y README general.
- Solución en `Backend/Sistema-Prestamos-de-Equipos/PrestamosEquipos.slnx`.
- Proyectos `PrestamosEquipos.API`, `PrestamosEquipos.Application`, `PrestamosEquipos.Domain` y `PrestamosEquipos.Infrastructure`, con destino .NET 10.
- `Domain/Entities`: `Usuario`, `Equipo` y `Prestamo`, con propiedades de navegación. `FechaDevolucion` es nullable.
- `Infrastructure/Data/AppDbContext.cs`: conjuntos de las tres entidades y carga de configuraciones del ensamblado.
- `Infrastructure/Configurations`: configuraciones por entidad con claves, longitudes máximas, campos obligatorios, correo único y relaciones. Los préstamos restringen el borrado de usuarios y equipos relacionados.
- Existe una migración `CrearModeloInicial` que crea las tres tablas. Su existencia no demuestra que esté aplicada a una base de datos.
- `API/Program.cs`: carga variables con DotNetEnv, exige una cadena de conexión, registra el contexto con Npgsql, controladores y OpenAPI, y configura el pipeline HTTP.
- No se encontraron controladores ni endpoints propios del sistema. El archivo `.http` conserva una solicitud de ejemplo a `weatherforecast`, sin un endpoint correspondiente encontrado.
- `Application` aún no contiene lógica de aplicación.
- `Frontend` está vacío; React está previsto, no implementado.
- `Infra/compose.yaml` configura PostgreSQL 16 Alpine con un volumen persistente.
- No se encontraron implementaciones de CRUD, préstamos, devoluciones ni sus reglas de negocio.
- Había cambios locales del usuario en API, contexto de datos, entidades, configuraciones y migraciones. Preservarlos; no asumir que fueron creados por el asistente.

Referencias entre proyectos observadas:

- API → Application e Infrastructure.
- Application → Domain.
- Infrastructure → Application.
- Domain sin referencias a otros proyectos.

## Clase 1 — Introducción a Web, cliente-servidor y API-First

Contenido recibido: separación del cliente React y backend .NET, flujo HTTP/API/SQL/JSON, definición del MVP e inicialización de un monorepo con Git, carpetas backend/frontend y README.

Evaluación comunicada:

- MVP, monorepo, Git y README: aplicados.
- Separación backend/frontend: presente como estructura; cliente pendiente.
- API-First: base preparada mediante Web API, sin endpoints propios todavía.
- Flujo completo cliente → API → base de datos → JSON: pendiente de implementación y verificación.
- La práctica concreta de inicialización del repositorio está cubierta. No exige completar el CRUD en esta clase.
- HabitForge/Habit Tracker es el ejemplo del curso; los conceptos se adaptan al Sistema de Préstamos de Equipo.

## Clase 2 — SOLID y código limpio

Contenido recibido: presentación conceptual de SRP, OCP, LSP, ISP y DIP. Ejemplo de interfaz de servicio, implementación y registro con `AddScoped`. El material indica que se aplicará en código real en próximas clases.

Evaluación comunicada:

- SRP: se observa separación de responsabilidades entre entidades, configuraciones de persistencia y contexto de EF Core.
- OCP: todavía no hay un ejemplo propio claro de extensión de comportamientos del negocio.
- LSP: no hay un caso propio suficiente de implementaciones intercambiables para evaluarlo.
- ISP: no hay interfaces propias de servicios para evaluarlo. No crearlas solo para marcar el principio como cumplido.
- DIP: la estructura de dependencias prepara una base, pero todavía no hay servicios de aplicación que dependan de abstracciones implementadas en infraestructura.
- Ya se usa inyección de dependencias con `AddDbContext` y `DbContextOptions<AppDbContext>`. Inyección de dependencias no equivale por sí sola a DIP.
- Código limpio: nombres descriptivos, clases pequeñas y configuraciones separadas. Separar proyectos no garantiza cumplir SOLID.
- No hace falta agregar código para cumplir una clase que presenta los principios conceptualmente y pospone su aplicación práctica.

## Clase 3 — Setup Backend (.NET) y Clean Architecture

Contenido recibido: Regla de Dependencia, responsabilidades de Domain/Application/Infrastructure/API y creación de solución, proyectos y referencias con la CLI. La práctica incluye `global.json` con SDK `10.0.401`.

Evaluación basada en una nueva lectura de la solución, los cuatro `.csproj` y las entidades:

- La solución contiene los cuatro proyectos esperados; Domain, Application e Infrastructure son bibliotecas y API usa `Microsoft.NET.Sdk.Web`.
- Las referencias coinciden con las de la práctica: Application → Domain; Infrastructure → Application; API → Application e Infrastructure; Domain no referencia otros proyectos ni paquetes externos.
- Las entidades de Domain no contienen dependencias de EF Core, PostgreSQL ni ASP.NET Core. Las configuraciones de persistencia están en Infrastructure.
- No se encontraron dependencias hacia Infrastructure/API ni referencias a EF Core, Npgsql o ASP.NET Core en el código fuente o proyectos de Domain/Application.
- La estructura actual respeta la Regla de Dependencia. Que API conozca Infrastructure para configurar dependencias en el arranque coincide con el ejemplo de la clase.
- Application sigue sin casos de uso ni interfaces propias: estructura preparada, responsabilidades funcionales aún pendientes. La práctica de esta clase solo crea los proyectos y referencias, por lo que no obliga a implementarlos todavía.
- No se encontró `global.json` en el repositorio. Los proyectos apuntan a `net10.0`, pero eso no fija una versión concreta del SDK.
- La CLI informó SDK activo e instalado `10.0.403`; la clase solicita `10.0.401`. Ambas versiones pertenecen a la misma banda `10.0.4xx` y difieren en el parche. No se esperan incompatibilidades para esta práctica por esa diferencia; no se verificó compilación.
- 
Decisión posterior del usuario: mantener el SDK instalado y no exigir coincidencia exacta con la clase. La ausencia de `global.json` queda como diferencia documental, no como tarea pendiente ni impedimento para avanzar.
- La ubicación adicional `Backend/Sistema-Prestamos-de-Equipos` y los nombres propios del proyecto no alteran las dependencias exigidas.
- No se ejecutó compilación ni se modificó código; solo se actualizó este seguimiento.

## Clase 4 — Infraestructura, Docker, ORM y variables de entorno

Contenido recibido: carpeta Infra independiente, PostgreSQL 16 en Docker con volumen persistente, dos archivos `.env` separados, exclusión de secretos mediante Git, paquetes EF Core/Npgsql/Design, DotNetEnv, entidad de dominio y DbContext en Infrastructure. Se aborda el Factor III (configuración) de 12-Factor App, no la metodología completa.

Evaluación mediante lectura del código y comprobaciones de archivos/Git:

- `Infra/compose.yaml` configura `postgres:16-alpine`, `env_file: .env`, puerto `5432:5432` y volumen `postgres_data`. La estructura corresponde a la práctica, con nombres adaptados al proyecto.
- Existe `Infra/.env` con las claves `POSTGRES_DB`, `POSTGRES_USER` y `POSTGRES_PASSWORD`.
- Existe el `.env` independiente de API con la clave `ConnectionStrings__PostgresConnection`.
- Solo se mostraron nombres de variables y existencia de archivos; no se imprimieron credenciales ni se verificó coincidencia de sus valores.
- `.gitignore` contiene `.env` y `.env.*`. `git check-ignore` confirmó la exclusión de ambos `.env` y `git ls-files` no los reportó como archivos rastreados actualmente. No se auditó el historial de Git.
- Infrastructure referencia `Microsoft.EntityFrameworkCore`, `Npgsql.EntityFrameworkCore.PostgreSQL` y `Microsoft.EntityFrameworkCore.Design`. API también referencia Design y DotNetEnv.
- API llama a `Env.Load()`, obtiene la cadena mediante `Environment.GetEnvironmentVariable`, comprueba que no esté vacía y registra `AppDbContext` con `UseNpgsql`. La cadena de conexión no está en el `appsettings.json` inspeccionado.
- El uso directo de `Environment.GetEnvironmentVariable` después de `Env.Load()` permite leer la variable sin depender de que `builder.Configuration` se recargue. No se comprobó el directorio de trabajo efectivo durante el arranque ni la carga en ejecución.
- Domain ya contiene las tres entidades del sistema; no se necesita agregar la entidad de hábitos del ejemplo.
- `AppDbContext` hereda de DbContext, recibe DbContextOptions por constructor, expone los tres DbSet y carga las configuraciones del ensamblado.
- La configuración y el código cubren los pasos de esta clase. Ya hay configuraciones y una migración inicial adicionales al ejemplo básico.
- No se levantó Docker ni se verificó el estado del contenedor, conexión real, compilación o aplicación de migraciones. Distinguir configuración implementada de funcionamiento comprobado.
- Se mantuvo el SDK instalado `10.0.403`, según la decisión del usuario. Solo se actualizó este documento; no se modificó código ni configuración.

## Clase 5 — Patrón Repositorio e Inversión de Dependencias (DIP)

Material recibido en el adjunto `Texto pegado.txt`. Puntos indispensables de la guía:

1. Definir un contrato de repositorio en `Application/Interfaces`, sin dependencias de EF Core ni del proveedor SQL. El ejemplo ofrece únicamente `Task<IEnumerable<HabitoGlobal>> GetAllAsync()`.
2. Implementarlo en `Infrastructure/Repositories`, recibiendo el DbContext por constructor y consultando con `ToListAsync()`.
3. Encapsular la configuración de infraestructura en `Infrastructure/DependencyInjection.cs`, mediante una extensión `AddInfrastructure(IServiceCollection, string connectionString)` que registra DbContext y `AddScoped<IContrato, Implementacion>()`.
4. Hacer que API/Program.cs cargue y valide la configuración, y llame a `AddInfrastructure(connectionString)` en lugar de configurar directamente EF Core y repositorios.

Evaluación actual:

- Ya existen entidades, AppDbContext, proveedor PostgreSQL y las referencias de proyectos necesarias como base.
- No se encontraron interfaces propias de repositorios en Application ni implementaciones en Infrastructure.
- No existe la extensión AddInfrastructure ni registros AddScoped de repositorios.
- Program.cs todavía configura `AddDbContext<AppDbContext>` y `UseNpgsql` directamente.
- La inyección del contexto ya está presente, pero falta materializar el DIP de acceso a datos mediante contratos propios y sus implementaciones.
- La práctica central de esta clase está pendiente. No se implementó por mantenerse la instrucción de no modificar código sin autorización.

Adaptación propuesta para cuando se autorice programar:

- Un primer ejemplo pequeño podría ser `IEquipoRepository` en Application y `EquipoRepository` en Infrastructure, con `GetAllAsync()` para equipos, siguiendo el alcance de la guía.
- Incorporar otros repositorios y operaciones conforme los requieran las clases y casos de uso. Esta clase no exige completar el CRUD ni introducir un repositorio genérico.
- Mantener las reglas de negocio fuera de los repositorios y los detalles EF Core dentro de Infrastructure.
- La referencia API → Infrastructure sigue siendo válida para componer las dependencias en el arranque; DIP busca que los consumidores del acceso a datos dependan de contratos, no prohibir esa referencia de composición.
- Separar DIP (dirección de las dependencias del código) de DI (mecanismo de construcción e inyección de objetos).

### Implementación autorizada de la clase 5 — 2026-10-31

El usuario aprobó explícitamente el plan y pidió comenzar a programar. Esta autorización cubre el repositorio de consulta de equipos, la configuración de infraestructura y el ajuste de Program.cs; las modificaciones futuras fuera de ese alcance siguen requiriendo indicación del usuario.

Cambios realizados (actualizan los pendientes de la evaluación anterior):

- Creado `Application/Interfaces/IEquipoRepository.cs` con `Task<IEnumerable<Equipo>> GetAllAsync()`, dependiendo únicamente del dominio y tipos de .NET.
- Creado `Infrastructure/Repositories/EquipoRepository.cs`, que implementa el contrato, recibe AppDbContext por constructor y consulta `_context.Equipos.ToListAsync()`.
- Creado `Infrastructure/DependencyInjection.cs`, con `AddInfrastructure`, registro de AppDbContext/UseNpgsql y `AddScoped<IEquipoRepository, EquipoRepository>()`.
- Program.cs ahora llama a `AddInfrastructure(connectionString)`; conserva la carga y validación de la variable de entorno y el resto del pipeline existente.
- No se añadieron paquetes, controladores, endpoints, otras operaciones CRUD, cambios al modelo o migraciones.
- DIP: Infrastructure implementa el contrato definido en Application. DI: el contenedor asocia contrato e implementación e inyecta el contexto. La consulta a datos queda encapsulada en el repositorio.

Validación:

- La primera compilación paralela terminó sin diagnóstico útil. Se repitió con `dotnet build PrestamosEquipos.slnx --no-restore --verbosity normal -m:1` y terminó correctamente: 0 advertencias y 0 errores, SDK 10.0.403. El servidor de compilación informó un timeout de conexión y el proceso completó la compilación mediante su alternativa local.
- No se probó la conexión ni la consulta contra PostgreSQL. No hay todavía un consumidor HTTP del repositorio.
- `git diff --check` señaló finales CRLF como espacios finales en diferencias locales, incluidas modificaciones previas del usuario; no se reformatearon archivos ajenos al alcance.
- Se preservaron los cambios locales previos. No se crearon commits.

## Clase 6 — Migraciones Code-First, HTTP y controladores REST

Contenido recibido: manifiesto local de herramientas e instalación de dotnet-ef; creación y aplicación de migraciones indicando Infrastructure como proyecto y API como startup; ampliación del repositorio con AddAsync y SaveChangesAsync; controlador con interfaz inyectada, GET/POST y respuestas HTTP 200/201/400.

Evaluación actual mediante revisión de archivos:

- Existe la migración `CrearModeloInicial` y el snapshot del modelo, que incluyen Usuarios, Equipos y Prestamos. La generación inicial Code-First ya está representada en el proyecto; no crear otra migración inicial para repetir el ejemplo.
- No se verificó que esa migración esté aplicada a PostgreSQL. No se inició Docker ni se ejecutó database update durante esta revisión.
- No se encontró `.config/dotnet-tools.json` dentro del repositorio. No se comprobó si dotnet-ef está instalado globalmente o mediante un manifiesto en un directorio superior.
- Los paquetes Design requeridos en Infrastructure y API ya estaban presentes en revisiones anteriores.
- `IEquipoRepository` solo define GetAllAsync y `EquipoRepository` solo implementa la consulta; AddAsync y SaveChangesAsync para crear equipos están pendientes.
- API ya registra y mapea controladores en Program.cs, pero no existen controladores propios ni endpoints GET/POST de equipos.
- El archivo API.http aún contiene la solicitud de plantilla a weatherforecast. Faltan solicitudes de ejemplo para probar los endpoints del sistema.
- No hay implementación HTTP propia que permita verificar respuestas 200, 201 o 400.

Criterios para adaptar la guía cuando se autorice programar:

- Continuar con equipos como en la clase 5: AddAsync en el contrato e implementación, y EquiposController recibiendo IEquipoRepository por constructor.
- Mantener el controlador enfocado en HTTP y la persistencia dentro del repositorio; las reglas de préstamos no pertenecen al repositorio.
- Adaptar validación a los campos y límites reales de Equipo, no limitarse a copiar la validación del nombre de HabitoGlobal.
- Revisar primero el estado de migraciones de la base de datos y la disponibilidad de herramientas; aplicar solo lo pendiente y conservar los datos existentes.
- Asegurar que la respuesta de creación y su ubicación sean coherentes con rutas reales; no copiar sin revisar el CreatedAtAction de la guía, que dirige a la acción de listado con un id.
- La clase presenta otros verbos y estados conceptualmente, pero su práctica solo implementa GET y POST; no ampliar automáticamente a CRUD completo.
- Solo se actualizó este documento. El usuario todavía no autorizó implementar la clase 6.

### Implementación autorizada de la clase 6 — 2026-10-31

El usuario aprobó el plan de consulta y creación de equipos y confirmó que PostgreSQL estaba levantado. Esta autorización incluye comprobar las migraciones, preparar la herramienta local, programar GET/POST y probarlos.

Cambios realizados (actualizan la evaluación anterior):

- Creado `Backend/Sistema-Prestamos-de-Equipos/dotnet-tools.json` con dotnet-ef 10.0.12 como herramienta local. La CLI de .NET 10 generó el manifiesto en la raíz de la solución; no es necesario que esté en `.config` para usarlo. Ya existía la misma versión instalada globalmente, que se conservó.
- Ampliados `IEquipoRepository` y `EquipoRepository` con `AddAsync(Equipo)`; la implementación usa AddAsync y SaveChangesAsync.
- Creado `API/Models/CrearEquipoRequest.cs`, modelo de entrada con solo Nombre, Tipo y Estado. Required y StringLength validan valores obligatorios y longitudes 100/250/50 respectivamente. No se permite que la solicitud controle el Id o las relaciones mediante ese contrato.
- Creado `API/Controllers/EquiposController.cs`, que recibe IEquipoRepository por constructor, ofrece GET `/api/equipos` (200) y POST `/api/equipos` (201). ApiController devuelve 400 automáticamente ante errores de validación o JSON; el controlador mapea la solicitud a Equipo y recorta espacios exteriores.
- El POST usa CreatedAtAction hacia GetEquipos: Location apunta al listado existente. No existe aún una consulta individual GET por id; no afirmar que Location identifica un endpoint individual.
- Actualizado el archivo API.http con solicitudes GET, POST válido y POST inválido.
- No se cambiaron entidades, esquema, configuraciones EF, paquetes de proyectos ni migraciones; no se implementó CRUD adicional ni reglas de préstamos.

Verificación realizada:

- Docker confirmó `postgres-prestamos` activo en el puerto 5432.
- `dotnet ef migrations list --project PrestamosEquipos.Infrastructure --startup-project PrestamosEquipos.API --no-build` consultó PostgreSQL y confirmó `CrearModeloInicial` aplicada, sin pendientes. No se ejecutó database update ni se creó otra migración inicial.
- Compilación completa con `dotnet build PrestamosEquipos.slnx --no-restore -m:1 -p:UseSharedCompilation=false`: 0 errores y 0 advertencias, SDK instalado 10.0.403.
- API ejecutada temporalmente con perfil http en localhost:5024; GET inicial 200, POST válido 201, GET de Location 200 y GET posterior 200 con el equipo persistido.
- Nueve casos inválidos devolvieron 400: campos obligatorios vacíos/blancos, tres excesos de longitud, cuerpo null, objeto vacío y JSON mal formado. Se verificó que no agregaran registros.
- Se retiró exclusivamente el equipo temporal mediante Id y nombre único, con confirmación DELETE 1. Los registros existentes se conservaron. La secuencia de identificadores puede haber avanzado por la inserción de prueba.
- Se detuvo la API temporal y se retiró el script temporal de verificación. El contenedor de PostgreSQL del usuario quedó activo.
- El acceso al motor Docker, NuGet y sockets locales requirió ejecución fuera del entorno restringido, aprobada mediante los controles de permisos.

## Clase 7 — Documentación OpenAPI/Scalar y pruebas con REST Client

### Decisión inicial del usuario (sustituida por la autorización posterior de implementación)

No implementar código de esta clase por ahora. Conservar su contenido como guía para cuando existan más endpoints por documentar. No instalar Scalar ni modificar Program.cs o el archivo HTTP por esta clase hasta recibir autorización.

### Conceptos y guía práctica para el futuro

- La documentación debe mantenerse junto con la evolución de la API, permitiendo a frontend y QA conocer y probar los contratos.
- OpenAPI describe el contrato de la API en JSON; Scalar es una interfaz web que consume esa especificación y permite explorar y ejecutar solicitudes.
- Los archivos `.http` permiten mantener solicitudes de ejemplo junto al código y versionarlas en Git. Las solicitudes van a la API HTTP, que accede a PostgreSQL mediante su implementación; el archivo `.http` no consulta directamente la base de datos.
- Son dos formas complementarias de explorar y verificar la API: una visual en el navegador y otra desde el IDE. Los ejemplos ejecutables no sustituyen por sí solos pruebas automatizadas con comprobaciones.

Parte 1 de la guía, adaptada a este proyecto para uso posterior:

1. En `PrestamosEquipos.API`, agregar el paquete `Scalar.AspNetCore` cuando se autorice implementar. Verificar entonces la documentación oficial y la versión compatible disponible.
2. Importar `Scalar.AspNetCore` en Program.cs.
3. Mantener `builder.Services.AddOpenApi()` para generar el contrato.
4. Dentro de `if (app.Environment.IsDevelopment())`, mantener `app.MapOpenApi()` y agregar `app.MapScalarApiReference()`.
5. Ejecutar la API y verificar la UI. La clase utiliza `/scalar/v1`; comprobar la ruta efectiva de la versión instalada al implementar. El perfil HTTP actual de esta app usa localhost:5024, no los puertos de HabitForge.

Parte 2 de la guía:

- Mantener y ampliar `PrestamosEquipos.API.http` con solicitudes GET/POST y las operaciones que se incorporen después, adaptadas a equipos, usuarios y préstamos.
- Incluir `Accept: application/json` para consultas y `Content-Type: application/json` con cuerpos acordes al contrato para envíos.
- La clase propone URLs completas, sin variables del editor, para evitar diferencias entre clientes REST. Conservar esta alternativa para el futuro; el archivo actual utiliza una variable base y no debe reescribirse ahora.
- Las solicitudes deben dirigirse al puerto real del perfil de ejecución; evitar copiar localhost:5157 o las rutas `/api/habitos` del ejemplo.
- Mantener ejemplos de respuestas correctas y validaciones conforme crezcan los endpoints. Las solicitudes POST ejecutan escrituras reales; usar datos de prueba identificables.

### Relación con el estado conocido del proyecto

- Program.cs ya tenía AddOpenApi y MapOpenApi condicionado a Development en las revisiones anteriores.
- Scalar todavía no se ha incorporado por el asistente; queda pospuesto por decisión del usuario.
- En la clase 6 se añadieron al archivo HTTP ejemplos de GET de equipos, POST válido y POST inválido. No hace falta descartar ese trabajo para copiar el ejemplo de hábitos.
- Esta clase se conserva como referencia pendiente de aplicación, sin cambios a código, paquetes o configuración.

## Clase 8 — Refactorización, DTOs, FluentValidation y organización por features

Contenido recibido en adjunto `Texto pegado.txt`. Conservar como guía, adaptando el ejemplo de hábitos a equipos.

Conceptos y pasos indispensables:

1. Usar contratos de entrada y salida (DTOs) para controlar qué recibe y devuelve la API, evitando aceptar propiedades internas de las entidades mediante over-posting.
2. Agrupar DTOs y validadores por funcionalidad dentro de Application, siguiendo la estructura `Features/Equipos/DTOs` y `Features/Equipos/Validators`. Es el inicio de una organización por features; no implica eliminar las capas de Clean Architecture.
3. Agregar `FluentValidation.DependencyInjectionExtensions` a Application cuando se autorice implementar, verificando entonces la versión y documentación oficial.
4. Definir un DTO de creación sin Id ni relaciones, y un DTO de salida con Id y los campos necesarios del equipo.
5. Implementar un `AbstractValidator<DTO de creación>` con RuleFor, NotEmpty y límites de longitud. El ejemplo de hábitos usa mínimo 3 y máximo 100 para Nombre; el mínimo es particular del ejemplo y debe decidirse para equipos, no incorporarse automáticamente como requisito del negocio. Conservar los máximos actuales de Nombre/Tipo/Estado: 100/250/50.
6. Crear `Application/DependencyInjection.cs` con AddApplication y AddValidatorsFromAssembly para registrar validadores; invocarlo desde Program.cs antes de AddInfrastructure.
7. Inyectar IValidator del DTO junto con IEquipoRepository en el controlador, ejecutar ValidateAsync y devolver 400 con errores si falla.
8. Mapear manualmente DTO de entrada → Equipo y Equipo → DTO de salida tanto en GET como en POST, manteniendo persistencia dentro del repositorio.

Evaluación actual:

- `API/Models/CrearEquipoRequest.cs` ya es un DTO de entrada por su función, aunque no lleve el sufijo Dto. Solo acepta Nombre, Tipo y Estado, sin Id ni relaciones; la protección de entrada y el mapeo explícito a Equipo ya están presentes desde la clase 6.
- Ese contrato todavía vive en API, no en Application/Features como propone la clase.
- GET y POST todavía devuelven entidades Equipo directamente, incluidas sus propiedades públicas de navegación. Falta un DTO de respuesta y su mapeo.
- Actualmente se validan entradas mediante DataAnnotations (Required/StringLength) y ApiController; no mediante FluentValidation. La validación actual existe y funciona; la clase propone refactorizarla y reubicarla, no partir de cero.
- Application no referencia FluentValidation ni contiene carpetas Features, validadores o AddApplication. Program.cs solo llama a AddInfrastructure para nuestras capas.
- No se necesitan cambios de esquema ni nuevas migraciones por introducir estos contratos y validadores, si se mantienen las entidades actuales.
- No se deben duplicar mensajes y reglas entre DataAnnotations y FluentValidation. Al refactorizar, mantener la respuesta 400 para errores de datos y los rechazos de JSON mal formado/cuerpo ausente gestionados por ASP.NET Core.
- No introducir reglas de préstamos ni valores permitidos de Estado sin definirlos antes con el usuario. Validar entrada no sustituye futuras reglas de negocio del dominio.
- La clase 7 sigue pospuesta; incorporar la clase 8 no autoriza instalar Scalar.
- En esta revisión solo se actualizó el seguimiento. El usuario no ha autorizado implementar la clase 8.

## Clase 9 — Sprint Review y cierre del Core

Contenido recibido: completar el ciclo REST de la entidad del ejemplo con consulta por Id, actualización y eliminación física. Adaptar el reto a Equipo, continuando el alcance de las clases 5 y 6; no extenderlo automáticamente a usuarios y préstamos.

Criterios de aceptación de la guía adaptados:

- Ampliar IEquipoRepository con GetByIdAsync, UpdateAsync y DeleteAsync.
- Implementar persistencia en EquipoRepository mediante EF Core y SaveChangesAsync para modificaciones; FindAsync es una opción para buscar por clave.
- GET `/api/equipos/{id}`: devolver DTO de respuesta con 200 si existe, o 404 si no existe.
- PUT `/api/equipos/{id}`: recibir un DTO de actualización sin Id ni relaciones y validar con un validador FluentValidation exclusivo de actualización. El Id proviene de la ruta.
- DELETE `/api/equipos/{id}`: eliminar físicamente cuando sea válido hacerlo.
- PUT/DELETE exitosos: 204 sin cuerpo; Id inexistente: 404.
- Agregar y verificar solicitudes GET por Id, PUT y DELETE en PrestamosEquipos.API.http, incluidos los casos de recurso inexistente y actualización inválida.

Estado observado al recibir la clase:

- El contrato y repositorio solo tienen GetAllAsync y AddAsync.
- EquiposController solo ofrece GET de colección y POST; faltan las tres operaciones del reto.
- No hay DTO ni validador de actualización; FluentValidation y la organización por features de la clase 8 siguen sin implementar.
- El archivo HTTP solo incluye consulta general, creación válida y creación inválida.
- La infraestructura relacional y migración inicial ya existen. No se requiere cambiar el esquema para estas operaciones si se conservan las entidades.

Consideraciones para implementar:

- Primero completar la refactorización pendiente de clase 8 para equipos: DTOs en Application/Features, DTO de respuesta, FluentValidation, AddApplication y mapeos del controlador.
- Luego añadir las operaciones de clase 9, manteniendo la organización por features y las responsabilidades de cada capa.
- Adaptar conscientemente qué campos puede modificar PUT en Equipo (Nombre, Tipo y Estado) en lugar de copiar solo Nombre del hábito. El significado y transiciones de Estado todavía no están definidos como reglas de préstamos; no permitir que una edición futura contradiga préstamos activos sin abordar esa regla.
- El modelo tiene préstamos relacionados con DeleteBehavior.Restrict. Un equipo con historial de préstamos no se puede eliminar físicamente sin violar esa restricción. Mantener el historial, evitar borrado en cascada y tratar el conflicto explícitamente (por ejemplo, 409) al concretar la implementación. El DELETE exitoso de 204 se puede verificar con un equipo de prueba sin préstamos.
- Con GET individual disponible, actualizar el Location del POST para señalar ese recurso por Id en lugar del listado.
- Probar también las validaciones de entrada y conservar las operaciones de clase 6, además de verificar 200/204/404. Usar datos identificables de prueba y preservar datos existentes.
- La clase 7 continúa pospuesta: ampliar solicitudes HTTP no requiere instalar Scalar.
- En este turno solo se revisó el código y se actualizó el seguimiento; no se implementaron las clases 8 o 9.

## Requisitos conversados para completar el backend

Respuestas del usuario posteriores a la clase 9:

- Aceptó prestar solo equipos disponibles, registrar fechas en UTC, marcar el equipo Prestado al prestar, cerrar el préstamo y devolver el equipo a Disponible al devolver, y rechazar devoluciones repetidas.
- Aceptó conservar el historial: impedir eliminar usuarios/equipos con préstamos relacionados y no ofrecer borrado de préstamos; permitir editar nombre/correo de usuarios y nombre/tipo de equipos.
- Indicó trabajar sin autenticación/autorización por ahora.
- Solicitó un máximo de 4 préstamos por usuario. Pendiente confirmar si son simultáneamente activos (interpretación propuesta) o históricos.
- Solicitó calcular el límite como `FechaDevolucion` más 7 días. Pendiente aclarar: actualmente FechaDevolucion es nullable y representa la devolución real; no reinterpretarla ni modificar el modelo sin resolver esta diferencia. Propuesta a explicar: límite = FechaPrestamo + 7 días y FechaDevolucion = devolución real.
- Pidió explicar el alcance de implementación, la política de estados, los tipos de equipo permitidos y las restricciones del correo antes de decidir esos puntos.
- No se inició la implementación del backend completo; hay decisiones pendientes. Mantener la clase 7 pospuesta.

## Decisiones finales e implementación del backend completo — 2026-10-31

Esta sección actualiza las preguntas pendientes y los estados de las clases 8 y 9 anteriores.

### Reglas confirmadas y autorización

- El usuario autorizó completar las tres partes del backend: usuarios, equipos y préstamos, refactorizando conforme a las clases.
- Estados de equipos: Disponible, Prestado, Mantenimiento. Estados de préstamos: Activo y Devuelto.
- Máximo de cuatro préstamos activos simultáneos por usuario; el historial no cuenta para el cupo.
- Fecha límite = FechaPrestamo más **dos meses calendario**. Esta decisión sustituye por completo las propuestas de siete días. FechaDevolucion sigue siendo la fecha real de devolución y es null mientras no se entrega.
- Tipo de equipo: texto libre obligatorio. Correo: formato válido, de cualquier dominio, único sin distinguir mayúsculas.
- Solo prestar equipos disponibles; creación y devolución cambian los estados de forma coherente. No permitir manipular manualmente Prestado sin préstamo ni liberar un equipo con préstamo activo.
- Conservar historial: no eliminar usuarios/equipos con cualquier préstamo; no ofrecer borrado de préstamos.
- Sin autenticación ni permisos por ahora. Clase 7/Scalar continúa pospuesta.

### Implementación actual

- DTOs y validadores de creación/actualización agrupados en Application/Features/Equipos y Usuarios; DTOs y validadores de creación/consulta en Features/Prestamos. Respuestas sin propiedades de navegación ni entidades EF expuestas.
- Se retiró el antiguo modelo API/Models/CrearEquipoRequest.cs y se sustituyó DataAnnotations por FluentValidation en Application. Paquete FluentValidation.DependencyInjectionExtensions 12.2.0.
- AddApplication registra validadores por ensamblado, servicios scoped y TimeProvider.System; las validaciones se ejecutan asíncronamente en los servicios. Mensajes de FluentValidation en español.
- EquipoService, UsuarioService y PrestamoService contienen los casos de uso y reglas; los controladores traducen solicitudes/respuestas HTTP. Se utiliza mapeo manual a DTOs dentro de Application.
- CRUD completo de usuarios y equipos: GET colección/Id, POST, PUT y DELETE. El POST devuelve Location del GET individual; PUT/DELETE exitosos devuelven 204.
- Préstamos: GET colección/Id, POST para registrar y POST /api/prestamos/{id}/devolucion. Los filtros usuarioId, equipoId y estado se pueden combinar; `estado=Activo` consulta activos y `estado=Devuelto` devoluciones.
- FechaPrestamo y FechaDevolucion se asignan en UTC desde el servidor; FechaLimite se calcula en el DTO con AddMonths(2), sin una columna adicional. El cliente no controla las fechas ni el estado del préstamo.
- Repositorios de las tres entidades implementan contratos de Application; infraestructura registra todos mediante AddInfrastructure.
- IUnitOfWork define un contrato de transacciones. Infrastructure usa aislamiento Serializable, rollback y reintentos limitados para volver a comprobar reglas ante colisiones concurrentes. Actualización de equipo y registro/devolución de préstamo son atómicos. Los errores de unicidad/FK se traducen a conflictos de aplicación sin exponer SQL.
- ApiExceptionHandler centraliza ProblemDetails: 400 con errores de validación por campo, 404 por inexistencia, 409 por conflictos y 500 genérico para fallos inesperados.
- CORS configurable mediante Cors:AllowedOrigins, inicialmente http://localhost:5173 para el futuro React. Sin credenciales; CORS no es autenticación.
- Archivo HTTP ampliado con ejemplos de las tres áreas. Los Id iniciales son 0 y deben sustituirse por los de datos propios de prueba antes de ejecutar cada bloque.
- Añadidos Infra/.env.example y Backend/BACKEND.md, enlazado desde README, con configuración, arranque, endpoints, reglas y pruebas.
- Se mantuvieron el SDK 10.0.403, las tres tablas y la migración original. No se modificaron entidades ni se generaron/aplicaron nuevas migraciones. EF confirmó que no hay cambios pendientes de modelo y la migración inicial ya estaba aplicada.

### Validación final

- Compilación completa con 0 errores y 0 advertencias (`dotnet build PrestamosEquipos.slnx --no-restore -m:1 -p:UseSharedCompilation=false`).
- `Backend/tests/Test-Backend.ps1`: 113 comprobaciones correctas contra API y PostgreSQL reales. Cubre validaciones, CRUD, 200/201/204/400/404/409, Location individual, DTOs/over-posting, correo único, disponibilidad, máximo de préstamos, filtros, fechas UTC, vencimiento de dos meses y preservación del historial.
- Pruebas concurrentes correctas: solicitudes por el último cupo (solo una crea), por un mismo equipo (solo una crea), doble devolución (solo una cierra), correos iguales con mayúsculas (solo uno se registra).
- Se corrigieron durante las pruebas la serialización de errores de validación y la detección del error de serialización de PostgreSQL anidado por EF Core. La prueba completa pasó después de las correcciones.
- Se comprobaron CORS (preflight 204 con origen permitido) y OpenAPI existente (200, siete rutas agrupadas), sin instalar Scalar.
- El script requiere PowerShell 7.5+ y acceso a Docker; genera un prefijo único y limpia solo sus registros temporales, incluidos préstamos de prueba, incluso al fallar una comprobación. Se conservaron los datos del usuario y no se reiniciaron secuencias.
- No se crearon commits. La API temporal se detiene al terminar las verificaciones; el contenedor del usuario permanece activo.

## Clase 7 aplicada posteriormente — Scalar

El usuario solicitó explícitamente aplicar la clase que menciona Scalar. Esta autorización sustituye la decisión anterior de posponerla.

- Instalado Scalar.AspNetCore 2.18.7 en API, siguiendo la integración oficial: https://scalar.com/products/api-references/integrations/aspnetcore/integration.
- Agregado `using Scalar.AspNetCore` y `app.MapScalarApiReference()` junto a MapOpenApi, dentro del bloque Development en Program.cs. Se conserva AddOpenApi existente.
- Documentación accesible en http://localhost:5024/scalar/v1 con el perfil http en Development. La ruta /scalar también es el acceso de referencia de la integración.
- Los ejemplos .http ya cubren las operaciones actuales; no se reescribieron para copiar los de hábitos.
- Backend/BACKEND.md actualizado con la ruta de Scalar y su uso.
- Verificación: compilación con 0 errores y 0 advertencias; Scalar /scalar/v1, sus dos recursos JavaScript locales y /openapi/v1.json devuelven 200. El documento incluye 14 operaciones HTTP.
- Se inició además una instancia temporal Production en el puerto 5025 y se comprobó 404 tanto para /scalar/v1 como para /openapi/v1.json. La documentación solo se habilita en desarrollo.
- Las verificaciones fueron HTTP; no se ejecutaron solicitudes de escritura ni se modificó la base de datos. No se realizó inspección visual en navegador.
- Se detuvieron las instancias temporales al finalizar. Para abrir Scalar, iniciar la API según Backend/BACKEND.md.

## Próximo paso

### Inicio del frontend — 2026-11-01

- El frontend está creado en `frontend` con Vite, React, TypeScript, React Compiler y ESLint. No implementar pantallas ni cambiar dependencias sin indicación del usuario.
- A petición del usuario se retiró el historial de intentos de reparación de pnpm. El proyecto está ahora en `C:\Proyectos\PrestamosEquipos`; el usuario informa que el problema de pnpm se resolvió al trasladarlo desde una ruta demasiado larga. No mantener esa incidencia como pendiente.

### Revisión de la creación del frontend / clase 10 — 2026-11-01

- Material completo de clase 10 recibido posteriormente: DOM real, Virtual DOM y reconciliación; verificación de Node/npm; creación de frontend con pnpm y Vite (React + TypeScript + React Compiler + ESLint); análisis de estructura y arranque del servidor. Esta clase no exige pantallas del negocio ni consumo de la API.
- `package.json`: React y React DOM ^19.3.1, Vite ^8.3.5 y TypeScript ~7.0.2. Scripts disponibles: dev, build, lint y preview. Existe `pnpm-lock.yaml`.
- `vite.config.ts`: registra el plugin React y React Compiler mediante el plugin Babel y reactCompilerPreset.
- `index.html` carga `src/main.tsx`, que monta App mediante createRoot dentro de StrictMode. `App.tsx` conserva la demostración de Vite, con un contador que utiliza useState; los estilos y recursos también son los de la plantilla.
- TypeScript separa la configuración de la aplicación y de Vite mediante referencias desde tsconfig.json. ESLint configura reglas de JavaScript, TypeScript, hooks y React Refresh.
- `.gitignore` del frontend excluye node_modules, dist y archivos locales. El frontend aún no contiene pantallas de usuarios/equipos/préstamos, rutas ni integración con la API; esto describe su estado, no implica que la clase 10 exija implementarlos.
- Verificación actual: `pnpm.cmd run build` terminó correctamente y generó dist. No se instaló ni modificó ninguna dependencia y no se cambió código fuente.
- Diferencia con lo informado por el usuario: `pnpm.cmd run lint` sigue fallando en esta copia con el mensaje explícito «typescript-eslint does not support TS 7.0» (typescript-eslint 8.72.1, TypeScript 7.0.2, ESLint 10.14.0). Se retiró el historial anterior, pero se conserva este resultado actual para no registrar como superada una comprobación que falla. No se corrigió por estar fuera del alcance de esta revisión.
- Verificación posterior al recibir la clase: Node v24.19.0, npm 12.2.1 y pnpm 12.16.1 disponibles. `pnpm.cmd run dev --host 127.0.0.1 --port 5173 --strictPort` informó Vite listo en 127.0.0.1:5173. La petición HTTP quedó bloqueada por los permisos de sockets del entorno; no afirmar HTTP 200 ni inspección visual. Se detuvo el servidor temporal.

### Evaluación de clase 10 con el material completo

- Inicialización aplicada: frontend es hermano de Backend e Infra, usa las opciones de framework/variante/linter de la guía y tiene dependencias instaladas; el build ya fue comprobado correctamente. No es necesario recrearlo ni reinstalar paquetes para repetir el scaffolding.
- Estructura aplicada: src, main.tsx, App.tsx, index.html, package.json, configuraciones TypeScript y pnpm-lock.yaml. La demostración del contador relaciona useState con renderizado y reconciliación; React se encarga internamente de esta última, sin un algoritmo propio por implementar.
- Diferencia válida de plantilla: no existe src/vite-env.d.ts; tsconfig.app.json ya incluye `"types": ["vite/client"]`, alternativa documentada por Vite para sus definiciones de cliente. No agregar un archivo duplicado solo para igualar el listado de la clase. Fuente: https://vite.dev/guide/features#client-types.
- Alcance práctico principal cubierto: scaffolding, estructura, compilación y arranque anunciado por Vite. La verificación visual del navegador no se realizó y la calidad de código tiene el fallo actual de lint ya registrado; distinguir estos límites de la creación del proyecto.
- Precisión conceptual: Virtual DOM es una representación de la UI, no una copia exacta del DOM del navegador. React calcula la UI durante render y aplica los cambios necesarios al DOM durante commit. El contador permite explicar este ciclo. Fuente: https://react.dev/learn/render-and-commit.
- TypeScript comprueba los tipos declarados en el frontend durante desarrollo/compilación; no sincroniza automáticamente DTOs C# ni valida JSON recibido en ejecución. La coherencia con la API requiere definir y mantener contratos; conservar la validación del backend.
- No se modificó código, configuración ni dependencias al analizar esta clase. Esperar la siguiente clase o instrucciones del usuario.

Decisión posterior del usuario: después de explicar la ubicación de las reglas en los servicios de Application y la alternativa de mover algunas a las entidades, indicó «no así déjalo». Mantener la distribución actual de reglas en los servicios; no refactorizar hacia entidades por iniciativa propia. Se explicó también que IUnitOfWork coordina las transacciones y que los servicios fueron una decisión de implementación basada en los casos de uso de Application, no una exigencia literal de las clases.

Esperar la siguiente clase o instrucciones del usuario. Backend completo dentro del alcance confirmado, clases 8/9 implementadas y clase 7/Scalar ya aplicada y verificada. Mantener el SDK instalado y la distribución actual de reglas en los servicios.

## Clase 11 — Componentes funcionales, JSX y props

Material recibido en `Texto pegado.txt`: interfaces declarativas, componentes funcionales, JSX, flujo index.html → main.tsx → App → componentes hijos, props de solo lectura, contrato TypeScript, desestructuración, exportación nombrada para hijos y default para App. Práctica: limpiar App, crear src/components/HabitoGlobalCard.tsx y reutilizar tres tarjetas con datos manuales, sin consultar la API todavía.

Evaluación mediante lectura del frontend y del DTO actual de equipos:

- Ya aplicado en la plantilla: App es un componente funcional que devuelve JSX; main.tsx lo importa como default y lo monta en root con createRoot. JSX ya usa expresiones, atributos y un manejador de clic en el contador.
- Pendiente de la práctica: no existe src/components ni una tarjeta propia; App mantiene la demo de Vite. No hay contrato de props propio ni reutilización de un componente de negocio con distintos datos desde App.
- Adaptación propuesta al Sistema de Préstamos de Equipo: crear src/components/EquipoCard.tsx con exportación nombrada y una interfaz EquipoCardProps con id: number, nombre: string, tipo: string y estado: string, en concordancia con EquipoResponseDto. App mantendría su exportación default y presentaría un catálogo de equipos con tres tarjetas y datos de ejemplo explícitos.
- Las props son entradas de solo lectura: el hijo presenta los datos recibidos y no los modifica. El componente de esta clase puede ser puramente presentacional; no requiere estado local, peticiones HTTP, formularios ni nuevas bibliotecas.
- No copiar HabitoGlobal, el botón Adoptar Hábito ni la suposición de que el backend carece de usuarios. Nuestro backend ya gestiona usuarios y préstamos; no implementar sus flujos en esta clase. Si se incluye una acción de préstamo futura, mantenerla deshabilitada y claramente pendiente, sin prometer funcionamiento.
- La tarjeta debe basarse en los campos del DTO público, sin exponer relaciones EF ni intentar reflejar toda la tabla física. No agregar campos de negocio inventados. Los datos manuales son ejemplos para props y no prueban conexión con la base de datos.
- La división del componente en contrato, firma, lógica y return sirve como guía didáctica; las exportaciones propuestas son la convención de esta clase, no una obligación del motor de React. Usar JSX para componer componentes hijos.
- Al autorizar implementar, retirar de App la demo y ajustar los estilos de plantilla que interfieran con el catálogo. Mantener una presentación sencilla dentro del alcance estudiado; no extender a dashboard, navegación, autenticación ni consumo de API.
- En este turno solo se analizó el material y se actualizó este seguimiento. La práctica de clase 11 queda pendiente de autorización explícita para modificar código. No se ejecutaron nuevas pruebas porque no hubo cambios de implementación.

## Clase 12 — Sistemas de diseño, arquitectura CSS y maquetación corporativa

Material recibido en `Texto pegado.txt`: design tokens, componentes base y patrones de layout; CSS, modelo de caja, Flexbox, Grid y media queries; importaciones CSS procesadas por Vite; comparación de Bootstrap, MUI y Tailwind; diseño responsive mediante un App Shell; integración de Tailwind con el plugin de Vite y sustitución del CSS de plantilla.

Práctica de la guía:

1. Instalar tailwindcss y @tailwindcss/vite con pnpm y registrar tailwindcss() en vite.config.ts.
2. Sustituir index.css por `@import "tailwindcss";` y retirar App.css y su importación si ya no se utilizan.
3. Aplicar utilidades a la tarjeta de clase 11 conservando su contrato de props; superficies slate, acento indigo, bordes, espaciados, estados hover y acción futura deshabilitada.
4. Construir App con sidebar, identidad, navegación visual, cabecera móvil, título/acción y grid de tarjetas. La guía usa hidden md:flex para sidebar, md:hidden para cabecera y grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 para tarjetas.
5. Comprobar el resultado en escritorio y móvil mediante navegador.

Evaluación actual:

- La plantilla ya incluye variables CSS, Flexbox y media queries, pero pertenecen a la demo de Vite; no equivalen a haber implementado el sistema de diseño de esta clase.
- No aparecen tailwindcss ni @tailwindcss/vite en package.json y vite.config.ts no registra Tailwind. index.css y App.css conservan estilos de plantilla, incluidos tema según preferencia del sistema y ancho/centrado de root.
- No existe aún EquipoCard ni catálogo de equipos: la implementación práctica de clase 11 está pendiente y es la base para esta maquetación. No asumirla completada por recibir la clase 12.
- Pendientes: integración Tailwind, limpieza de estilos de demo, diseño de tarjetas, App Shell responsive y comprobación visual en ambos tamaños.

Adaptación propuesta cuando el usuario autorice implementar:

- Aplicar conceptos a un catálogo de equipos, con EquipoCard y props id/nombre/tipo/estado; usar identidad del Sistema de Préstamos de Equipo y datos de ejemplo explícitos, manteniendo el alcance de la clase 11.
- Añadir el plugin Tailwind a la configuración existente SIN retirar reactCompilerPreset ni el plugin Babel de React Compiler. El ejemplo simplificado de vite.config.ts no incluye esa configuración previa y no debe reemplazarse literalmente.
- Usar sidebar y cabecera móvil como estructura visual. Usuarios y Préstamos pueden indicarse como futuras pantallas del frontend, sin implementar rutas ni presentarlas como funcionalidades ausentes del backend.
- No copiar HabitForge, Mis Hábitos, Progreso, referencias a tablas ni mensajes Requiere Sesión/Modo Invitado que sugieran un sistema de autenticación que nuestra aplicación no tiene. Mostrar contenido orientado al usuario, sin detalles de EF, tablas o JWT.
- Los botones aún no implementados deben aparecer deshabilitados y claramente pendientes; no dejar acciones activas sin comportamiento ni usar cursor-not-allowed como sustituto de deshabilitación real.
- Conservar una paleta coherente, espaciado, radios y jerarquía tipográfica dentro de esta práctica. No introducir otras librerías de UI ni ampliar a CRUD, formularios, autenticación o consultas HTTP.
- Atención al texto de la guía: el sidebar del ejemplo cambia en md y las tarjetas cambian en sm/lg; no existe un único umbral de escritorio para todas las piezas. La anchura w-64 y su posición lateral no implican position: fixed ni sticky. Verificar el comportamiento real al implementar.
- Tailwind es la elección didáctica del curso; las afirmaciones comparativas de popularidad, ausencia absoluta de CSS sobrante o encapsulación no son requisitos técnicos ni justifican añadir complejidad.
- La recepción de la clase 12 amplía el alcance de estudio para una futura implementación autorizada; las restricciones de la revisión de clase 11 sobre no añadir navegación se referían a esa clase aislada. Ahora se documenta el App Shell visual, sin rutas funcionales.
- En este turno solo se leyó el material, se contrastó con archivos actuales y se actualizó este seguimiento. No se instalaron paquetes ni se modificó código o configuración; clases 11 y 12 pendientes de implementación. No se ejecutaron pruebas nuevas.

## Implementación autorizada de clases 11 y 12 — 2026-11-01

Esta sección actualiza los pendientes de las evaluaciones anteriores. El usuario aprobó implementar el plan del catálogo y pidió creatividad visual dentro de los fundamentos de las clases 1–12. Autoriza adaptar el molde de los ejemplos al proyecto, sin copiarlos literalmente; permite skills de terceros solo como apoyo de diseño. No se incorporaron skills externas ni bibliotecas de componentes.

- Implementado EquipoCard con contrato TypeScript id/nombre/tipo/estado, exportación nombrada y desestructuración. App mantiene exportación default y reutiliza tres tarjetas con datos manuales: laptop Disponible, cámara Prestado y proyector Mantenimiento. Sin mutaciones de props ni conexión a la API.
- Añadidos EquipoIlustracion e Icono como componentes presentacionales pequeños con props y SVG propios. Las ilustraciones son decorativas, usan lógica local simple y tienen una alternativa genérica; no introducen nuevos campos del backend.
- Instalados tailwindcss y @tailwindcss/vite 4.3.3; actualizados package.json y pnpm-lock.yaml. El plugin se añadió conservando React Compiler y Babel. Referencia de integración: https://tailwindcss.com/docs/installation/using-vite.
- Sustituido CSS de demo por Tailwind, tokens de tipografía y colores (ink/canvas/brand) y reglas globales mínimas. Retirado App.css y su importación. Identidad visual propia: sidebar azul profundo, turquesa, área clara y tarjetas ilustradas.
- App Shell con sidebar desde md, cabecera compacta en móvil, hero editorial y grid de una/dos/tres columnas con sm y lg. Estados con texto y color, enlace para saltar al catálogo y foco visible. Usuarios/Préstamos, Nuevo equipo y Solicitar préstamo están realmente deshabilitados y señalados como futuros.
- HTML en español con título, descripción y favicon propio. frontend/README.md sustituye la guía genérica y explica ejecución, archivos, fundamentos, alcance y verificaciones. Capturas en frontend/docs/catalogo-escritorio.png y catalogo-movil.png.
- No se modificó el backend, la base de datos, sus reglas ni contratos; no se añadieron rutas, autenticación, formularios ni peticiones HTTP.
- Verificaciones: build correcto con TypeScript y Vite; revisión visual en navegador de escritorio 1440x1050 y móvil 390x844, tres/una columnas respectivamente y sidebar visible/oculto. Tablet de 768 px con dos columnas. Sin desbordamiento horizontal en esos tamaños y sin errores/advertencias de consola capturados.
- Lint continúa bloqueado por typescript-eslint 8.72.1 con TypeScript 7.0.2; pnpm peers check confirma ese mismo conflicto previo. No se alteraron las versiones del compilador/linter. No declarar lint aprobado.
- La descarga inicial de Tailwind falló por DNS del entorno restringido; reintento con acceso autorizado completó correctamente. Vite se inició con acceso autorizado en 127.0.0.1:5173 y queda disponible para que el usuario revise el resultado.
- No se crearon commits. Próximo paso: revisión del diseño por el usuario o recepción de la clase 13; conservar los fundamentos y documentar cualquier nueva decisión importante sin esperar recordatorios.

### Preferencia de contenido visible y limpieza del catálogo

- El usuario pidió retirar «Vista de ejemplo» y el aviso «Un primer vistazo al catálogo…» y evitar mensajes visibles de ese estilo. Preferencia permanente de frontend: no mostrar avisos de demostración ni comentarios sobre etapas de desarrollo, implementaciones pendientes o próximas funciones; mantener esa información en documentación y seguimiento.
- Retirados ambos avisos y también PRONTO, Próximamente y Función disponible próximamente. Las acciones sin implementación continúan deshabilitadas; no se añadió funcionalidad ni conexión a la API. Los equipos siguen siendo datos manuales aunque se hayan retirado las etiquetas visibles.
- Esta decisión sustituye las indicaciones anteriores de identificar datos de ejemplo y futuras etapas con mensajes en la interfaz.
- Verificación de la limpieza: búsqueda sin coincidencias de los avisos retirados en App/EquipoCard y build de producción correcto. Retirado también el icono informativo que quedó sin uso.

- Navegación solicitada por el usuario: el logo de la cabecera móvil ahora es un enlace semántico con href=/ y nombre accesible; al pulsarlo lleva a la página principal conservando su diseño. No requiere router ni manejador de clic.

### Preparación de .gitignore para GitHub

- Usuario autorizó modificar ambos .gitignore. El archivo raíz concentra exclusiones de .NET/Visual Studio, NuGet, configuración local, variables de entorno, pruebas/cobertura, logs, temporales, Docker y editores; frontend/.gitignore concentra node_modules, dist, cachés Vite/ESLint/TypeScript y *.local. Se retiraron duplicados y la regla *.sln para permitir versionar soluciones.
- Se preservan las plantillas .env.example, .env.*.example, example.env y .example.env. .env reales permanecen excluidos. Esto no certifica el contenido de las plantillas ni constituye una auditoría del historial.
- Verificado con git check-ignore --no-index: 14 rutas de archivos locales/generados excluidas y 14 rutas de código/configuración/documentación conservadas, incluidas migraciones, solución, pnpm-lock.yaml y seguimiento. git ls-files -ci --exclude-standard no encontró archivos ya rastreados que ahora deban excluirse.
- No se retiraron archivos del índice, no se crearon commits ni se publicó en GitHub.

## Clase 13 — Estado reactivo y ciclo de vida: useState y useEffect — 2026-11-06

Material completo recibido en Texto pegado.txt. Conceptos: variables locales frente a estado conservado entre renders y persistencia en PostgreSQL; actualización mediante setters; montaje/actualización/desmontaje; efectos y dependencias; limpieza de temporizadores; listado dinámico y búsqueda controlada.

Práctica indispensable de la guía:

1. Exportar la interfaz de props de la tarjeta para reutilizarla en App con import type.
2. Crear tres estados en App: colección tipada inicialmente vacía, cargando inicialmente true y busqueda inicialmente vacía.
3. Usar useEffect con [] y setTimeout de 1200 ms para cargar seis registros manuales y terminar la carga. Retornar clearTimeout como limpieza. Todavía sin HTTP ni consulta a PostgreSQL.
4. Calcular el listado filtrado mediante filter/includes sobre el nombre, sin distinguir mayúsculas. No guardar el resultado derivado como otro estado ni agregar un efecto para filtrar.
5. Añadir input controlado con value y onChange, contadores calculados con length, representación condicional de carga y tarjetas generadas mediante map con key estable basada en id.

Evaluación del código actual:

- App sigue presentando tres EquipoCard explícitas y un contador fijo 03. No importa useState/useEffect ni tiene buscador, carga simulada o listado mediante map.
- EquipoCard ya recibe id/nombre/tipo/estado, pero EquipoCardProps aún no se exporta. main.tsx conserva StrictMode.
- La práctica central de clase 13 está pendiente. Recibir el material autoriza analizarlo y documentarlo, no modificar código automáticamente.

Adaptación propuesta cuando se autorice implementar:

- Exportar EquipoCardProps y reutilizarlo en useState<EquipoCardProps[]>([]), conservando el contrato y la presentación de EquipoCard.
- Mantener el diseño de clase 12 y reemplazar las tres etiquetas manuales por seis equipos de ejemplo cargados tras 1200 ms; no inventar campos del modelo ni llamar a la API en esta clase.
- Buscar por nombre, mostrar la cantidad filtrada/total y reemplazar el contador fijo por datos derivados. Mantener key={equipo.id}; key no se recibe como prop en el hijo.
- Mensajes visibles orientados al uso: Cargando equipos y No se encontraron equipos cuando corresponda. No copiar explicaciones sobre Heap/Fiber, Vuelta 1, estado en memoria, simulación ni futuras etapas en la interfaz: respetar la preferencia permanente del usuario.
- Conservar botones pendientes deshabilitados, el enlace de inicio móvil y la paleta actual. No añadir autenticación, rutas, CRUD frontend, otras librerías ni persistencia local para esta práctica.

Precisiones para explicar correctamente el material:

- El estado es privado de cada instancia de componente y React lo asocia a su posición en el árbol; la analogía del almacén global no significa que useState sea estado global compartido. La recarga de página reinicia este estado mientras no se rehidrate desde otra fuente. Fuente: https://react.dev/learn/state-a-components-memory.
- Las variables locales se vuelven a calcular al ejecutar el componente; afirmar que todos los let viven necesariamente en Stack y que el recolector los elimina al return simplifica en exceso JavaScript (por ejemplo, existen cierres). No convertir ese detalle de implementación en requisito del proyecto.
- useEffect con [] no debe explicarse como garantía absoluta de una sola ejecución: con StrictMode hay un ciclo adicional de setup/cleanup en desarrollo. Mantener la limpieza del temporizador y StrictMode; no retirarlo para esconder este comportamiento. Fuente: https://react.dev/reference/react/useEffect.
- Omitir dependencias hace que el efecto se ejecute después de cada commit; un bucle depende de las actualizaciones que provoque, no de la mera ausencia de [].
- Al filtrar se retiran las tarjetas excluidas del árbol; key permite identificar las que permanecen, sin garantizar que React se limite a ocultar nodos. La limpieza cancela el temporizador pendiente, no representa por sí misma una gestión manual de toda la RAM.

En este turno solo se revisó el material, App, EquipoCard, main.tsx y configuración TypeScript; se actualizó este seguimiento. No se modificó código ni se ejecutaron pruebas de implementación.

## Decisión de avance del curso — 2026-11-06

- El usuario indicó posponer la implementación de código hasta haber revisado la clase 17. Hasta entonces, recibir las clases, estudiar con detalle sus ejemplos y actualizar este seguimiento con conceptos, contratos, estructura, secuencia de implementación y adaptaciones necesarias al proyecto.
- La clase 13 queda analizada y pendiente de implementación; continuar con las clases 14 a 17 sin programarlas al recibirlas. No interpretar la entrega de material como una orden de implementar. Al llegar a la 17, reunir lo estudiado para definir la implementación conforme a las indicaciones del usuario.
- Revisar cuidadosamente el código de ejemplo de cada clase y conservar los detalles indispensables para usarlo como molde, adaptando entidades, nombres y capacidades al Sistema de Préstamos de Equipo. Evitar copiar particularidades de HabitForge o introducir conceptos fuera de lo estudiado.
- Si el material deja dudas o falta un detalle necesario para entender el enfoque enseñado, hacerlo saber al usuario y pedir la parte correspondiente, sin inventarla.

## Clase 14 — Simetría arquitectónica y Vertical Slicing en React — 2026-11-06

Material completo recibido en Texto pegado.txt. Se revisaron todos los ejemplos: contrato separado, servicio Promise con datos simulados, tarjeta, vista del catálogo, layout con children y App reducido a composición. Solo análisis y documentación, según la decisión de esperar hasta la clase 17.

Conceptos y molde de la guía:

- Separar responsabilidades del componente raíz: App compone el layout y la vista; no concentra estado, carga de datos, búsqueda y navegación visual.
- Organización por feature: features/habitos/api, components y types; layouts para la estructura compartida. La analogía con Program.cs, DTOs y repositorios del backend ayuda a separar responsabilidades, pero no convierte vistas React en controladores HTTP ni impone replicar todas las capas .NET.
- types/habito.types.ts exporta interface HabitoGlobal; tanto servicio como tarjeta y vista usan import type. El contrato deja de vivir dentro de las props de la tarjeta, actualizando la solución intermedia de clase 13.
- api/habitosApi.ts exporta obtenerHabitosGlobalesAsync(): Promise<HabitoGlobal[]> mediante new Promise(resolve => setTimeout(..., 1000)); el callback crea seis objetos y resuelve la colección. La clase 13 usaba 1200 ms: clase 14 traslada esa carga a un servicio y el ejemplo cambia la demora a 1000 ms.
- CatalogoHabitosView conserva tres useState (colección, cargando y busqueda); useEffect llama al servicio y en .then actualiza colección y carga. Calcula filter por nombre sin distinguir mayúsculas, input controlado, contador filtrado/total, carga condicional y map con key=id. No extraer hooks personalizados ni añadir librerías para esta práctica.
- AppLayout importa ReactNode con import type, define AppLayoutProps { children: ReactNode } y devuelve sidebar/cabecera y un main que contiene {children}.
- App mantiene export default y solo importa y compone <AppLayout><CatalogoHabitosView /></AppLayout>. Los componentes hijos y funciones del servicio usan exportaciones nombradas. Mover la tarjeta y corregir importaciones; retirar la copia antigua solo después de verificar sus consumidores.

Adaptación prevista al Sistema de Préstamos de Equipo:

frontend/src/
  features/equipos/
    api/equiposApi.ts
    components/CatalogoEquiposView.tsx
    components/EquipoCard.tsx
    components/EquipoIlustracion.tsx
    types/equipo.types.ts
  layouts/AppLayout.tsx
  components/Icono.tsx
  App.tsx
  main.tsx
  index.css

- Exportar interface Equipo con id: number, nombre: string, tipo: string y estado: string, conforme al DTO público actual. Reutilizarla en la tarjeta, servicio y colección useState<Equipo[]>([]), sin duplicar el contrato dentro de EquipoCardProps.
- equiposApi.ts ofrecería obtenerEquiposAsync(): Promise<Equipo[]>; inicialmente conserva los seis equipos simulados de la adaptación de clase 13. Al recibir clases 15–17, ajustar la implementación a su alcance final en vez de perpetuar simulaciones si se enseña la conexión real.
- CatalogoEquiposView contendría título/acción, hero propio del catálogo, estados de carga/búsqueda, contadores y rejilla. AppLayout conservaría identidad, sidebar, cabecera móvil con enlace a /, contenedor main, enlace de salto y footer compartido. Asegurar id=catalogo en el destino del enlace de salto y no anidar main dentro de otro main.
- EquipoIlustracion es específico de equipos y se mueve junto con la tarjeta; Icono tiene consumidores del layout y permanece compartido en src/components. No borrar src/components si aún contiene código compartido útil ni crear módulos vacíos de Usuarios/Préstamos por simetría.
- Conservar diseño, utilidades Tailwind, React Compiler, acciones sin implementar deshabilitadas y preferencia de no mostrar comentarios de demo/desarrollo en pantalla. Sustituir textos técnicos del ejemplo (Vertical Slicing, Consultando capa de servicios, rutas .ts, etc.) por mensajes de usuario como Cargando equipos.
- El contador total que estaba en el sidebar de clase 13 desaparece del layout de ejemplo de clase 14: mantener los contadores del catálogo dentro de su vista, sin duplicar la carga en AppLayout ni introducir estado global para conservar un badge.

Observaciones para la implementación conjunta posterior:

- El frontend actual sigue en la versión estática de clases 11–12: src/components contiene EquipoCard, EquipoIlustracion e Icono; no existen features ni layouts. Las clases 13 y 14 están documentadas, no implementadas.
- La refactorización de clase 14 pretende preservar comportamiento y presentación; el número exacto de líneas de App no define por sí solo SRP. No aplicar literalmente la referencia del curso a .NET 9: nuestro backend continúa en .NET 10 según la decisión registrada.
- El servicio de ejemplo resuelve siempre y la vista no tiene catch/finally ni limpieza del efecto; al implementar con las clases siguientes, revisar manejo de fallos y desmontaje/StrictMode. No perder la intención de limpieza aprendida en clase 13: al mover el temporizador, la vista ya no dispone de su identificador para clearTimeout. La estrategia concreta debe ajustarse a los ejemplos posteriores y evitar actualizaciones de cargas obsoletas.
- api es una capa de acceso externo del frontend; cuando se conecte realmente, se comunicará por HTTP con la API .NET, no directamente con PostgreSQL. La separación de carpetas no constituye por sí sola DIP con contratos inyectables.
- Separar archivos reduce colisiones de edición, pero no garantiza ausencia de conflictos de merge. La preparación del servicio permite aislar transporte; errores/cancelación/configuración podrían requerir cambios adicionales al incorporar la API.
- No se modificó código/configuración ni se instalaron dependencias. No se ejecutaron pruebas porque solo se analizó material y se actualizó el seguimiento. Próximo material esperado: clase 15; implementación pospuesta hasta revisar la 17.

## Clase 15 — CORS y consumo de API REST con Axios — 2026-11-06

Material completo recibido en Texto pegado.txt. Se revisaron los ejemplos de variables Vite, instancia Axios, servicio GET, vista con errores, laboratorio CORS y configuración .NET con orígenes dinámicos y wildcard. Implementación pospuesta hasta revisar la clase 17.

Molde del código de la clase:

1. frontend/.env define VITE_API_BASE_URL con URL base que incluye /api. Instalar axios con pnpm al autorizar programar.
2. features/habitos/api/habitosApi.ts importa axios y el contrato con import type. Exporta apiClient = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, headers: { 'Content-Type': 'application/json' } }).
3. Sustituye Promise/setTimeout por obtenerHabitosGlobalesAsync = async (): Promise<HabitoGlobal[]> => { const respuesta = await apiClient.get<HabitoGlobal[]>('/habitos'); return respuesta.data }. No conserva fallback simulado para esconder fallos de red.
4. CatalogoHabitosView conserva colección/cargando/busqueda y agrega errorRed: string | null. useEffect llama al servicio: then carga colección y limpia error, catch registra diagnóstico y establece mensaje, finally termina carga tanto en éxito como en error. Renderiza carga, error o listado de forma excluyente; mantiene filter y map con key estable.
5. El laboratorio propone observar primero el fallo CORS y luego autorizar el origen. Esto es un experimento didáctico, no una exigencia de quitar una política que el proyecto ya posee.
6. Backend: Env.Load, lectura directa de CORS_ALLOWED_ORIGINS con Environment.GetEnvironmentVariable y excepción si falta; Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries); AddCors/AddPolicy con WithOrigins(origenes), SetIsOriginAllowedToAllowWildcardSubdomains(), AllowAnyHeader y AllowAnyMethod; UseCors antes de autorización/endpoints. Ejemplo de orígenes: localhost y https://*.unah.edu.hn. Reiniciar procesos para cargar nueva configuración.

Estado contrastado con archivos del proyecto:

- Program.cs YA registra AddCors con política Frontend, WithOrigins desde builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() y AllowAnyHeader/AllowAnyMethod. appsettings.json ya permite http://localhost:5173. UseCors("Frontend") está antes de UseAuthorization/MapControllers; hay UseHttpsRedirection antes de CORS. Se conserva el resto del pipeline, Scalar y manejo de excepciones.
- No hay lectura propia de CORS_ALLOWED_ORIGINS, separación CSV ni habilitación de wildcard. La configuración actual es una lista por IConfiguration; es distinta del ejemplo .env pero ya configurable. Si se adopta el enfoque enseñado, unificar la fuente y documentar la sustitución, sin mantener dos políticas o listas divergentes.
- La API tiene perfil HTTP http://localhost:5024 y perfil HTTPS https://localhost:7249; no usar el puerto 5000 del ejemplo. EquiposController expone GET /api/equipos y devuelve EquipoResponseDto mediante el servicio. Existen endpoints propios de usuarios y préstamos; esta clase se centra en lectura del catálogo.
- frontend/package.json aún no incluye axios; features/layouts y servicio HTTP siguen pendientes junto a las clases 13–14. El frontend continúa con tres tarjetas estáticas.

Adaptación prevista al implementar el conjunto:

- Crear frontend/.env.example con VITE_API_BASE_URL=http://localhost:5024/api para el perfil HTTP y su copia local .env. Verificar el perfil realmente usado, posibles redirecciones HTTPS y certificado antes de atribuir un fallo a CORS. No duplicar /api al combinar baseURL y recurso /equipos. Reiniciar Vite tras cambiar .env.
- equiposApi.ts importa el contrato Equipo (id/nombre/tipo/estado), configura Axios desde VITE_API_BASE_URL y exporta obtenerEquiposAsync(): Promise<Equipo[]> mediante apiClient.get<Equipo[]>('/equipos') y respuesta.data. Conservar el límite de responsabilidades de clase 14; ajustar localización del cliente compartido si las clases 16–17 lo requieren, sin anticipar abstracciones.
- Sustituir la carga simulada por registros reales del backend sin insertar datos en la base automáticamente para rellenar la vista. Permitir catálogo vacío, búsqueda sin coincidencias, carga y fallo distinguibles; el conteo corresponde a la colección recibida, sin afirmar total de toda la BD si el contrato cambia después.
- Mensaje visible de error sencillo, por ejemplo No se pudieron cargar los equipos. Conservar detalles en consola/documentación. No copiar textos sobre PostgreSQL, .NET, CORS, F12, endpoints, arquitectura o futuras etapas en la interfaz, según preferencia del usuario.
- Conservar diseño actual, props, ilustración genérica para otros tipos, botones pendientes deshabilitados, React Compiler y StrictMode. Revisar limpieza/cancelación del efecto al integrar con las clases restantes: el ejemplo 15 también omite cleanup.
- Si se adopta CORS_ALLOWED_ORIGINS, leerla directamente tras Env.Load como la clase y preservar validación de configuración. No asumir que .env cargado después de CreateBuilder recarga por sí solo IConfiguration. No imprimir credenciales al revisar variables.
- El dominio unah.edu.hn es del ejemplo del curso, no un requisito del Sistema de Préstamos de Equipo. Documentar el mecanismo wildcard y aplicarlo únicamente a dominios realmente indicados para el proyecto; conservar origen local explícito. localhost y 127.0.0.1 son orígenes distintos; usar el host configurado en el navegador o autorizar explícitamente los necesarios.

Precisiones verificadas para no trasladar errores conceptuales del texto:

- Un origen combina esquema/host/puerto. CORS controla qué respuestas puede leer un script del navegador; no autentica usuarios ni garantiza impedir toda escritura. Un POST simple puede enviarse sin preflight, y un GET con encabezados no permitidos como simples puede requerir OPTIONS. Content-Type application/json global del ejemplo puede convertir también su GET en una petición con preflight si se envía ese encabezado. Observar Network en vez de asegurar que siempre habrá SELECT previo al fallo. Fuente: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS.
- Un preflight fallido impide que el navegador envíe la petición real correspondiente; el servidor puede responder OPTIONS sin los encabezados necesarios, incluso con estado 2xx. No usar solo el código HTTP para concluir autorización CORS. No confundir métodos de lectura/escritura con la clasificación de solicitudes simples.
- CORS no protege llamadas directas de clientes ajenos al navegador ni sustituye autenticación/autorización/defensas CSRF. No agregar JWT en esta clase; UseAuthentication por sí solo no restringe todos los endpoints sin reglas de autorización.
- El genérico axios.get<Equipo[]> aporta tipado estático; no verifica en ejecución que el JSON recibido cumpla Equipo. Mantener contratos coherentes con DTO público y no afirmar validación runtime automática.
- La clase usa el rechazo HTTP predeterminado de Axios y .catch/.finally. Un error de Axios no demuestra por sí solo CORS: también puede ser HTTP, desconexión, DNS, certificado o configuración. No mostrar diagnóstico categórico sin evidencia.
- Variables VITE_* se incluyen en el código del cliente: URL base es configuración pública, no un secreto. Nunca colocar cadena de conexión, contraseña PostgreSQL ni claves privadas en ellas. .env.example sí puede versionarse con la URL pública; .env permanece excluido. Fuente: https://vite.dev/guide/env-and-mode.
- WithOrigins admite patrones de subdominios mediante SetIsOriginAllowedToAllowWildcardSubdomains; no equivale a AllowAnyOrigin ni requiere AllowCredentials para el GET actual. Referencia .NET 10: https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-10.0.

Solo análisis estático y documentación: no se instaló Axios, no se crearon/modificaron .env, no se alteró CORS, no se iniciaron servicios ni se realizaron peticiones o escrituras. Próximo material: clase 16; se mantiene la espera hasta revisar la 17.

## Clase 16 — POST, errores de FluentValidation y validación reactiva con Zod — 2026-11-06

Material completo recibido en Texto pegado.txt. Revisados los ejemplos de ambas fases: formulario sin validación frontend para observar rechazos reales; implementación final con Zod, React Hook Form y extractor de errores. Solo análisis y documentación; implementación aún pospuesta hasta revisar la clase 17.

Conceptos y moldes indispensables:

- Contratos asimétricos: DTO de creación sin id frente a DTO de lectura con id generado por el servidor. En el ejemplo CrearHabitoGlobalDto solo contiene nombre; HabitoGlobal contiene id/nombre.
- Servicio Axios añade crearHabitoGlobalAsync(dto): Promise<HabitoGlobal> con apiClient.post<HabitoGlobal>('/habitos', dto) y devuelve respuesta.data. GET incorpora Array.isArray(respuesta.data), que solo comprueba la colección, no valida cada objeto. Si falta VITE_API_BASE_URL el ejemplo solo registra console.error; al implementar no dejar que una base indefinida genere llamadas accidentales al origen de Vite.
- extraerMensajeErrorBackend(error: unknown): usa axios.isAxiosError, trata ausencia de response, conserva status para diagnóstico y examina data. Soporta ValidationFailure[] mediante Array.isArray/map(errorMessage)/filtro de strings; texto directo; objeto con errors agrupados por campo mediante Object.values(...).flat(); propiedades error/mensaje/message/detail/title como alternativas. Si no es Axios, usa Error.message o mensaje genérico. Revisar forma real de los valores antes de usarlos, sin confiar solo en casts TypeScript.
- Fase 1 CrearHabitoForm: props onHabitoCreado(nuevo) y onCancelar(); useState para nombre/guardando/errorServidor; evento FormEvent<HTMLFormElement>, preventDefault, try/await POST, vaciado del nombre y callback de éxito, catch con extractor y finally que restablece guardando. Es un experimento temporal para comprobar el backend, no el formulario final sin validación.
- CatalogoHabitosView añade mostrarFormulario=false; Nuevo muestra el formulario y se oculta mientras está abierto. Callback de creación usa setHabitos(actuales => [...actuales, nuevoDesdeBD]) y cierra el formulario; Cancelar también lo cierra. El registro añadido es la respuesta del servidor y no se inventa id ni se repite GET tras éxito.
- Actualización inmutable: no usar push sobre el array del estado. Preferir setter funcional con spread, como el ejemplo final, para calcular a partir del estado más reciente.
- Fase 2 instala zod, react-hook-form y @hookform/resolvers. Añade features/habitos/schemas/habito.schema.ts con crearHabitoGlobalSchema = z.object({ nombre: z.string().trim().min(1,...).min(3,...).max(100,...).regex(...) }); exporta z.infer<typeof schema>. El mínimo 3 y la regex son reglas del ejemplo, no requisitos automáticos del proyecto.
- Formulario final: useForm<TipoInferido>({ resolver: zodResolver(schema), mode: 'onChange', defaultValues }); extrae register/handleSubmit/reset y formState.errors/isValid/isSubmitting. handleSubmit(procesarEnvioLimpio) reemplaza el manejador manual del submit; usa register para los inputs y no duplica su estado en useState.
- procesarEnvioLimpio es async, limpia errorServidor, espera POST, reset y callback; catch presenta mensajes del backend conservando el formulario. isSubmitting depende de devolver/esperar la promesa del envío. Submit deshabilitado si !isValid || isSubmitting; inputs y Cancelar deshabilitados durante envío. register onChange borra un error de servidor obsoleto. Muestra errores locales junto al campo y error de servidor en banner.
- Estructura final del feature: api (GET/POST/extractor), components (vista/formulario/tarjeta), schemas (Zod) y types (entrada/salida/errores). Mantener AppLayout y composición de clase 14.

Contraste con el backend real de Préstamos de Equipo:

- CrearEquipoRequestDto exige Nombre, Tipo y Estado; no contiene Id. EquipoResponseDto devuelve Id/Nombre/Tipo/Estado. El POST existente /api/equipos devuelve 201 con DTO y Location al GET por id.
- CrearEquipoValidator: Nombre NotEmpty/MaximumLength(100); Tipo NotEmpty/MaximumLength(250); Estado NotEmpty y solo Disponible o Mantenimiento. Prestado es un estado válido de lectura, pero no de creación: se asigna por un préstamo, no desde este formulario.
- No existe MinimumLength(3), regex restrictiva ni índice de nombre único en EquipoConfiguration. No inventar esas restricciones, ni cambios de modelo/migraciones, para imitar el ejemplo de hábitos. Tipo es texto libre obligatorio; Estado se presta a un select con dos opciones y Disponible inicial.
- EquipoService valida la entrada y luego guarda Nombre.Trim()/Tipo.Trim(); la validación de longitudes del backend sucede antes de ese trim. Al reflejar reglas y enviar el resultado transformado de Zod, documentar la normalización y no confundir el payload validado con valores originales sin transformar.
- ApiExceptionHandler NO devuelve ValidationFailure[]: ValidationException se transforma en ValidationProblemDetails con status 400, title y errors: { Nombre: [mensajes], Tipo: [...], Estado: [...] }; claves del diccionario provienen de PropertyName y deben mapearse a nombres camelCase del formulario si se muestran por campo.
- El mismo manejador devuelve ProblemDetails para 404, 409 con Detail de negocio y 500 con título genérico. El extractor debe priorizar este contrato existente; no cambiar el backend para devolver arrays solo por concordar con la clase. ASP.NET Core también puede generar errores de binding con errors.

Adaptación prevista cuando se autorice programar:

frontend/src/features/equipos/
  api/equiposApi.ts
  components/CatalogoEquiposView.tsx
  components/CrearEquipoForm.tsx
  components/EquipoCard.tsx
  components/EquipoIlustracion.tsx
  schemas/equipo.schema.ts
  types/equipo.types.ts

- Tipos: Equipo de salida; CrearEquipoDto con nombre/tipo/estado (sin id), consistente con el DTO C#. Modelar ProblemDetails/errores por campo según necesidad, sin duplicar innecesariamente estructuras ni dar por hecho ValidationFailure[]. Mantener coherencia entre tipo de creación y tipo inferido del esquema.
- Esquema: nombre obligatorio hasta 100 y tipo obligatorio hasta 250; rechazar valores de solo espacios y elegir normalización acorde al servicio; estado enum Disponible/Mantenimiento. Mensajes en español orientados al usuario. No incorporar mínimo 3 ni regex de hábitos. El backend sigue validando estas mismas reglas aunque exista Zod.
- crearEquipoAsync(dto) usa POST /equipos y retorna el equipo persistido. CrearEquipoForm recibe onEquipoCreado(equipo) y onCancelar; formulario con labels, campos registrados y select de estado, validación onChange y bloqueos durante el envío, conservando el diseño actual.
- La vista pasa de Nuevo equipo deshabilitado a abrir/cerrar formulario. Callback agrega respuesta usando setEquipos(actuales => [...actuales, equipo]) y actualiza conteos derivados sin F5 ni GET adicional. Mantener el filtro existente; si el nuevo equipo no coincide, no ocultar silenciosamente el efecto de creación ni alterar la regla sin evaluar la interacción.
- Error local muestra los mensajes sintácticos; rechazo del servidor conserva mensajes útiles de sus validadores/ProblemDetails. Detalles HTTP y tecnológicos quedan en consola/documentación: no mostrar POST /api/equipos, Zod + FluentValidation, Guardar en PostgreSQL, Rechazo .NET ni avisos de desarrollo en el producto. Usar Guardar equipo, Guardando y mensajes de validación comprensibles.
- No convertir fallos de red genéricos en afirmaciones categóricas de CORS. No renderizar mensajes como HTML. No reintentar automáticamente POST por un timeout: puede haberse creado el registro aunque no llegara la respuesta.
- El laboratorio de rechazo se comprobará con solicitudes inválidas identificables, sin desactivar permanentemente validaciones. Si se crean registros de prueba, preservar los del usuario y retirar solo los propios cuando proceda. El preflight puede estar cacheado y no siempre se observa un OPTIONS nuevo antes de cada POST.
- Al implementar conjuntamente las clases 13–17 revisar condiciones entre GET inicial y POST para que una carga tardía no borre el equipo recién creado; resolver dentro del alcance enseñado, por ejemplo habilitando creación cuando la colección inicial esté disponible. Verificar política de carga/cancelación con la clase 17 antes de fijar diseño final.

Precisiones de alcance:

- Zod valida el formulario, no garantiza por sí mismo seguridad, ausencia de duplicados o validez de respuestas HTTP. La validación backend no se sustituye ni se limita exclusivamente a reglas semánticas; también debe rechazar formatos y campos inválidos desde cualquier cliente.
- El ejemplo enseña callbacks hijo → padre para comunicar creación y cancelación, sin estado global ni router. Crear Equipo no habilita automáticamente solicitar préstamos, editar/borrar, usuarios o autenticación.
- No se instalaron Zod/React Hook Form/Axios ni se cambiaron archivos de implementación, configuración o BD. Se revisaron clase, DTO, validador, servicio, configuración de entidad y manejador de excepciones. No se ejecutaron pruebas de implementación. Próximo material esperado: clase 17.

## Clase 17 — Laboratorio de integración Front-to-Back — 2026-11-06

Material recibido completo según el usuario: «Conexión de los formularios de React con los DTOs de entrada y salida del servidor (Verbos POST y DELETE para los hábitos) validando la comunicación asíncrona». No contiene ejemplos adicionales ni instrucciones detalladas. No inventar un ejemplo original del curso: distinguir lo recibido de nuestra adaptación/inferencia.

Interpretación de alcance:

- Laboratorio de consolidación de clases 13–16: estado/efectos/map/filter, organización por features y layout, Axios/CORS/configuración, DTOs de lectura y creación, formulario Zod/React Hook Form, propagación de errores y callbacks con actualización inmutable.
- POST ya está explicado en detalle por clase 16. DELETE es la operación adicional explícita del enunciado; su implementación frontend puede derivarse de Axios + async/await + callbacks + filter, y el backend ya lo implementa desde el trabajo de clases anteriores. No es necesario añadir otro framework ni introducir conceptos de otra unidad.
- «Hábitos» se adapta a Equipos, continuando el catálogo. No implica extender automáticamente a formularios de usuarios/préstamos ni implementar PUT, JWT o navegación funcional.

Contratos existentes y flujo propuesto de DELETE:

- EquiposController ya expone DELETE /api/equipos/{id:int}, llama a EquipoService.DeleteAsync(id) y responde 204 sin cuerpo al completar. No hay DTO de creación ni objeto de respuesta obligatorio en DELETE: el id va en la ruta.
- Servicio frontend previsto: eliminarEquipoAsync(id: number): Promise<void> { await apiClient.delete(`/equipos/${id}`) }. No intentar leer un Equipo ni deserializar un JSON de una respuesta 204.
- La vista controla la operación asíncrona, comunica a EquipoCard un callback y estado de eliminación según sea necesario. Mantener Equipo como contrato de datos; props de acciones/estado de UI se definen aparte (por ejemplo EquipoCardProps que extiende Equipo), sin añadir onEliminar a DTOs ni a la respuesta HTTP.
- Solicitar confirmación de eliminación en la interfaz antes de la petición, bloquear repetición mientras está pendiente y preservar la tarjeta si falla. Tras éxito, actualizar setEquipos(actuales => actuales.filter(e => e.id !== id)), con los contadores derivados. Esta es nuestra propuesta de interacción, no código proporcionado por la clase.
- Backend conserva historial: cualquier préstamo relacionado impide borrar equipo, incluso si ya fue devuelto. Error 409 se muestra con el mensaje de ProblemDetails; 404 indica inexistencia. No eliminar préstamos, desactivar restricciones ni cambiar backend para que todos los DELETE resulten exitosos.
- Verificar carga, colección vacía, filtro, alta válida/invalidada, errores del servidor, borrado exitoso, conflicto con historial y fallos de red. Validar persistencia con recarga/GET y observar 201/400/204/404/409 según el caso; no limitarse a retirar tarjetas localmente.
- Las pruebas de escritura deben usar registros propios identificables y preservar datos del usuario. No borrar registros ajenos como demostración. Mantener diagnóstico técnico fuera de los textos visibles de producto.

Fuentes consultadas para cubrir el detalle de DELETE no desarrollado por la clase:

- Axios: https://axios-http.com/docs/api_intro (referencia y alias de métodos).
- React: https://react.dev/learn/updating-arrays-in-state (actualizaciones inmutables y eliminación mediante filter).
- HTTP 204: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/204 (respuesta exitosa sin contenido).

Estado de autorización y siguiente paso:

- Ya se recibieron y analizaron las clases 13–17, por lo que se alcanzó el punto acordado para reunir el plan de implementación. El mensaje actual pide aclarar si el material alcanza; no constituye por sí solo una orden de programar en este turno.
- Explicar al usuario que podemos implementarlo con las clases anteriores y completar DELETE siguiendo documentación oficial, distinguiendo las decisiones de implementación propias de los ejemplos del curso. Conservar diseño y preferencias existentes.
- Solo se actualizaron estas notas: no se modificó código, no se instalaron paquetes, no se iniciaron servicios ni se ejecutaron operaciones HTTP de escritura.

## Implementación autorizada de clases 13–17 y guía de estudio — 2026-11-06

El usuario autorizó empezar a programar tras revisar la clase 17 y pidió una guía para principiantes que explique todo el sistema con referencias al curso. Esta autorización sustituye la espera anterior.

Implementación:

- Reorganizado frontend por features: tipos/servicios/esquema/componentes de equipos en src/features/equipos; AppLayout recibe children y conserva el diseño; App solo compone layout y vista. Icono permanece compartido. Se movieron EquipoCard y EquipoIlustracion sin dejar copias activas en la ruta anterior.
- Instalados axios 1.21.0, zod 4.6.7, react-hook-form 7.91.0 y @hookform/resolvers 7.0.3. Conservados React Compiler, TypeScript y Tailwind. Actualizado lockfile.
- equiposApi implementa GET, POST y DELETE reales con URL desde VITE_API_BASE_URL, espera máxima, comprobación mínima de respuestas y extracción de ValidationProblemDetails/ProblemDetails. No usa datos simulados ni crea registros iniciales. DELETE no espera cuerpo tras 204.
- Añadida frontend/.env.example y copia local .env (excluida por Git), con http://localhost:5024/api. Se conserva la política CORS existente Frontend/Cors:AllowedOrigins, ya funcional; no se añadió CSV obligatorio ni wildcard UNAH de ejemplo. No se cambió código del backend.
- CatalogoEquiposView incorpora estado, efecto GET cancelable con AbortController, búsqueda, contadores, carga/error/vacío y actualización manual. AbortController es una adaptación mínima de la limpieza de clase 13 al transporte Axios, explicada en la guía; StrictMode se mantiene.
- CrearEquipoForm usa Zod/RHF con validación onChange; nombre/tipo obligatorios y límites 100/250; Disponible/Mantenimiento como estados iniciales. No se copiaron mínimo 3 ni regex del ejemplo. refine sobre string.length conserva el límite UTF-16 del backend con la versión actual de Zod. Respuesta POST actualiza estado inmutable y limpia búsqueda para mostrar el nuevo equipo.
- Eliminación con confirmación inline/cancelación, bloqueo mientras espera, retiro local solo tras éxito y propagación de conflictos del backend. Las props de acciones son específicas de tarjeta, no campos DTO. Actualizar se bloquea durante formulario y creación se bloquea hasta terminar GET para evitar sobrescrituras por cargas tardías.
- Usuarios, Préstamos, Solicitar préstamo y PUT frontend continúan fuera de alcance; no se agregó autenticación/router. Se respetó la preferencia de no mostrar mensajes técnicos de implementación en el producto.

Guía y documentación:

- GUIA_DEL_SISTEMA.md: guía extensa para principiantes (más de 500 líneas), enlazada desde README. Incluye glosario, mapa de clases 1–17, arranque/configuración, entidades/DTOs/props, capas .NET, repositorios/DI/DIP, reglas de usuarios/préstamos, EF/migraciones/transacciones, flujo de errores, componentes/hooks/formularios/Axios/CORS, diagramas y recorridos GET/POST/DELETE, mapa de archivos, ejercicios y diagnóstico.
- La guía distingue conceptos del curso de decisiones del proyecto y estado real del frontend frente a capacidades más amplias del backend. frontend/README y Backend/BACKEND actualizados; capturas actuales de escritorio/móvil en frontend/docs.

Verificaciones realizadas:

- Build de producción con TypeScript y Vite correcto.
- Nuevo frontend/tests/Test-Integracion.mjs carga módulos reales mediante Vite SSR: 24 comprobaciones correctas de Zod, CORS, DTO, GET/POST/DELETE, errores 400/404, persistencia y conservación de registros. El caso de extracción 409 utiliza un objeto simulado; se distingue de la comprobación real del backend.
- Backend/tests/Test-Backend.ps1: 113 comprobaciones correctas, incluidas reglas/historial/concurrencia; retiró únicamente sus propios registros temporales.
- Navegador real: validación bloquea espacios vacíos, POST persiste, recarga conserva, búsqueda sin coincidencias, cancelación de borrado conserva y DELETE elimina solo el equipo temporal creado para la prueba. Se verificaron error de red al detener nuestra API y recuperación con Actualizar catálogo tras reiniciarla.
- Revisión visual con formulario en 390x844 y 1440x1050: sin desbordamiento horizontal; sidebar oculto/visible según tamaño. Capturas actualizadas. Se conservaron los datos originales y todos los registros propios de prueba fueron eliminados; no se reiniciaron secuencias.
- Lint sigue fallando por incompatibilidad PREVIA de typescript-eslint 8.72.1 con TypeScript 7.0.2. No se cambió configuración/versiones del compilador o linter ni se declara lint aprobado.
- Docker Desktop estaba detenido; se inició con autorización del entorno, se levantó el contenedor existente sin borrar volúmenes y se iniciaron API/Vite. API fue detenida y reiniciada para la prueba de recuperación. Quedan API en localhost:5024, Vite en localhost:5173 y contenedor disponibles para la revisión del usuario.
- No se hicieron commits ni push. Se preservaron las notas locales previas del seguimiento.

### Cierre de la API temporal por conflicto con Visual Studio

- El usuario encontró address already in use al iniciar con el botón verde. Se identificó la instancia iniciada por el asistente durante las pruebas (dotnet run --no-build --launch-profile http, proceso padre del runtime Codex), aunque las consultas iniciales de listeners no la mostraban. HTTP a /openapi/v1.json confirmó que respondía 200.
- Se detuvo exclusivamente esa instancia temporal mediante Ctrl+C en su sesión. Para futuras verificaciones, no dejar una API propia activa que impida iniciar desde Visual Studio; comprobar respuesta HTTP además de listeners antes de concluir que el puerto está libre.
