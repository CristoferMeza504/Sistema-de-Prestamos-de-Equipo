interface IconoProps {
  nombre: 'cubo' | 'cuadricula' | 'usuarios' | 'prestamo'
}

export function Icono({ nombre }: IconoProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {nombre === 'cubo' && <><path d="m12 3 9 5v8l-9 5-9-5V8Z" /><path d="m3 8 9 5 9-5M12 13v8M7.5 5.5l9 5" /></>}
      {nombre === 'cuadricula' && <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>}
      {nombre === 'usuarios' && <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 5" /></>}
      {nombre === 'prestamo' && <><path d="M4 7h15m-4-4 4 4-4 4M20 17H5m4-4-4 4 4 4" /></>}
    </svg>
  )
}
