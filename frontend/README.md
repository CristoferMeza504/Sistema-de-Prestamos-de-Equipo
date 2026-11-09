# Frontend · Préstamos de Equipo

Catálogo conectado a la API .NET con React, TypeScript, React Compiler, Vite y Tailwind. Implementa las clases 10–17: consulta, búsqueda, creación y eliminación de equipos.

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
- src/features/equipos/api/equiposApi.ts: Axios, GET/POST/DELETE y mensajes de ProblemDetails.
- src/features/equipos/schemas/equipo.schema.ts: validación Zod de nombre, tipo y estado inicial.
- src/features/equipos/components/CatalogoEquiposView.tsx: estado, efecto cancelable, búsqueda y callbacks.
- src/features/equipos/components/CrearEquipoForm.tsx: React Hook Form, validación al escribir y envío.
- src/features/equipos/components/EquipoCard.tsx: datos del equipo y solicitud de confirmación de borrado.
- src/features/equipos/components/EquipoIlustracion.tsx: SVG propios; ilustración genérica para otros tipos libres.
- src/components/Icono.tsx: iconos compartidos.
- src/index.css: Tailwind y tokens. vite.config.ts conserva React Compiler.

## Comportamiento

Los datos provienen de la API, sin simulación ni registros iniciales creados automáticamente. Crear solo permite Disponible o Mantenimiento. El formulario no envía id; utiliza el id devuelto por el servidor. Tras guardar se limpia la búsqueda para mostrar el nuevo equipo.

Eliminar solicita confirmación y conserva la tarjeta hasta recibir éxito. El backend rechaza equipos con historial (409). Los fallos se muestran con mensajes en español. Actualizar catálogo permite recargar tras una pérdida de conexión; no se reintentan automáticamente las escrituras.

Usuarios, Préstamos y Solicitar préstamo siguen deshabilitados. No hay autenticación, router, PUT frontend ni sincronización automática con otros clientes.

## Verificar

```powershell
pnpm run build
pnpm run lint
node tests/Test-Integracion.mjs
```

El script requiere API/PostgreSQL activos y .env configurado. Carga los módulos reales mediante Vite, comprueba validaciones, CORS y GET/POST/DELETE; usa un prefijo único y limpia solo sus equipos temporales. El conflicto ProblemDetails se comprueba con una respuesta simulada; la regla real de historial está cubierta por Backend/tests/Test-Backend.ps1.

Límite previo: typescript-eslint 8.72.1 no admite TypeScript 7.0.2; el lint sigue bloqueado por esa incompatibilidad. Build e integración se verifican por separado y no se declaran equivalentes al lint.

Capturas: [escritorio](docs/catalogo-escritorio.png) · [móvil](docs/catalogo-movil.png).
