# Frontend · Préstamos de Equipo

Catálogo conectado a la API .NET con React, TypeScript, React Compiler, Vite y Tailwind. Implementa consulta, búsqueda, creación, edición y eliminación de equipos con los fundamentos de las clases 9 y 10–17.

La [guía para principiantes](../GUIA_DEL_SISTEMA.md) explica frontend y backend, archivo por archivo, y relaciona el código con las clases.

## Ejecutar

Inicia PostgreSQL y la API siguiendo [BACKEND.md](../Backend/BACKEND.md). Desde frontend, si aún no tienes .env:

```powershell
Copy-Item .env.example .env
pnpm install
pnpm run dev --host localhost --port 5173 --strictPort
```

Abre http://localhost:5173. VITE_API_BASE_URL debe apuntar a http://localhost:5024/api con el perfil HTTP del backend. Reinicia Vite al modificar .env. Se usa localhost, no 127.0.0.1, para coincidir con el origen CORS configurado.

## Organización

- src/App.tsx: compone AppLayout y CatalogoEquiposView.
- src/layouts/AppLayout.tsx: sidebar, cabecera, main y footer; recibe children.
- src/features/equipos/types/equipo.types.ts: contratos de entrada y salida.
- src/features/equipos/api/equiposApi.ts: Axios, GET/POST/PUT/DELETE y mensajes de ProblemDetails.
- src/features/equipos/schemas/equipo.schema.ts: validación Zod de nombre, tipo y estado inicial.
- src/features/equipos/components/CatalogoEquiposView.tsx: estado, efecto cancelable, búsqueda y callbacks.
- src/features/equipos/components/CrearEquipoForm.tsx: React Hook Form, validación al escribir y envío.
- src/features/equipos/components/EditarEquipoForm.tsx: formulario precargado y actualización de nombre, tipo y estado.
- src/features/equipos/components/EquipoCard.tsx: datos del equipo y solicitud de confirmación de borrado.
- src/features/equipos/components/EquipoIlustracion.tsx: SVG propios; ilustración genérica para otros tipos libres.
- src/components/Icono.tsx: iconos compartidos.
- src/index.css: Tailwind y tokens. vite.config.ts conserva React Compiler.

## Comportamiento

Los datos provienen de la API, sin simulación ni registros iniciales creados automáticamente. Crear solo permite Disponible o Mantenimiento. El formulario no envía id; utiliza el id devuelto por el servidor. Tras guardar se limpia la búsqueda para mostrar el nuevo equipo.

Eliminar solicita confirmación y conserva la tarjeta hasta recibir éxito. El backend rechaza equipos con historial (409). Los fallos se muestran con mensajes en español. Actualizar catálogo permite recargar tras una pérdida de conexión; no se reintentan automáticamente las escrituras.

Editar precarga los datos del equipo y permite guardar mediante PUT. Un equipo Prestado conserva ese estado durante la edición de nombre/tipo. Los demás permiten Disponible/Mantenimiento. La API confirma con 204 y la vista reemplaza el equipo con un array nuevo. Cancelar conserva los datos previos. Los conflictos del servidor mantienen abierto el formulario para corregir o cancelar.

Usuarios, Préstamos y Solicitar préstamo siguen deshabilitados. No hay autenticación, router ni sincronización automática con otros clientes.

## Verificar

```powershell
pnpm run build
pnpm run lint
node tests/Test-Integracion.mjs
```

El script requiere API/PostgreSQL activos y .env configurado. Carga los módulos reales mediante Vite, comprueba validaciones, CORS y GET/POST/DELETE; usa un prefijo único y limpia solo sus equipos temporales. El conflicto ProblemDetails se comprueba con una respuesta simulada; la regla real de historial está cubierta por Backend/tests/Test-Backend.ps1.

Compatibilidad de herramientas resuelta. La dependencia `typescript` usa el paquete oficial `@typescript/typescript6` para proporcionar la API que necesita ESLint. El alias `@typescript/native` mantiene TypeScript 7.0.2 para el comando `tsc` del build. `pnpm run lint`, `pnpm run build` y `pnpm peers check` terminaron correctamente el 12 de noviembre de 2026. [Configuración recomendada por Microsoft](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0).

Capturas: [escritorio](docs/catalogo-escritorio.png) · [móvil](docs/catalogo-movil.png).
