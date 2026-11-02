# Frontend · Préstamos de Equipo

Catálogo visual construido con React, TypeScript, React Compiler, Vite y Tailwind CSS. Corresponde a las clases 10, 11 y 12 del proyecto de estudio.

## Ejecutar

Desde esta carpeta:

```powershell
pnpm install
pnpm run dev
```

Abrir la dirección que indique Vite (normalmente http://localhost:5173). Para generar la versión de producción: `pnpm run build`; para revisarla: `pnpm run preview`.

## Cómo está organizado

- `src/main.tsx`: monta App en el elemento root y carga los estilos globales.
- `src/App.tsx`: organiza la interfaz y pasa tres equipos de ejemplo a EquipoCard.
- `src/components/EquipoCard.tsx`: componente reutilizable con props tipadas (id, nombre, tipo y estado). Selecciona las clases visuales del estado y devuelve JSX.
- `src/components/EquipoIlustracion.tsx`: ilustraciones SVG propias de los tres tipos de ejemplo; otros tipos muestran una ilustración genérica. Son decorativas, no fotografías ni un campo nuevo del modelo.
- `src/components/Icono.tsx`: iconos SVG propios, reutilizados mediante una prop.
- `src/index.css`: importa Tailwind y define tokens de color/tipografía y reglas globales mínimas.
- `vite.config.ts`: conserva React Compiler y añade el plugin de Tailwind.

La rejilla utiliza una columna por defecto, dos desde sm y tres desde lg. El sidebar aparece desde md; en móvil la identidad se presenta en la cabecera. Las tarjetas y el layout emplean utilidades de Tailwind, Flexbox, CSS Grid y etiquetas semánticas.

## Alcance

Los tres equipos son datos manuales de demostración, sin conexión a la API. Nuevo equipo, Solicitar préstamo y las futuras pantallas de Usuarios/Préstamos están deshabilitados. No se implementaron autenticación, rutas, formularios ni CRUD frontend.

Las props se usan como entradas de solo lectura. El contrato TypeScript refleja los campos públicos de EquipoResponseDto y no valida respuestas HTTP en ejecución.

## Verificaciones y límite conocido

- Build de producción correcto.
- Revisión visual en escritorio (1440 px) y móvil (390 px), y revisión de distribución en tablet (768 px), sin desbordamiento horizontal.
- Sin errores ni advertencias capturados en la consola del navegador durante la revisión.
- `pnpm run lint` sigue bloqueado por la incompatibilidad previa: typescript-eslint 8.72.1 no admite TypeScript 7.0.2. No se cambiaron esas versiones durante esta implementación.

Capturas: [escritorio](docs/catalogo-escritorio.png) · [móvil](docs/catalogo-movil.png).
