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
