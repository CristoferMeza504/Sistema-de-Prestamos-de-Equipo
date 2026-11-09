interface EquipoIlustracionProps {
  tipo: string
}

// Ilustraciones propias con una imagen genérica para otros tipos de equipo.
export function EquipoIlustracion({ tipo }: EquipoIlustracionProps) {
  return (
    <svg viewBox="0 0 280 170" className="h-40 w-full" fill="none" aria-hidden="true">
      <ellipse cx="140" cy="142" rx="87" ry="9" fill="#142b35" opacity=".07" />
      {tipo === 'Computadora portátil' ? <>
        <rect x="65" y="30" width="150" height="100" rx="8" fill="#233e49" />
        <rect x="71" y="36" width="138" height="87" rx="3" fill="#c4e8e1" />
        <path d="M71 105 130 36h79v87H71Z" fill="#8fc7be" />
        <path d="m130 123 79-87v87Z" fill="#64a79e" />
        <path d="M65 130h150l23 10c2 2 0 6-4 6H46c-4 0-6-4-4-6Z" fill="#91a5ad" />
        <path d="M65 130h150l14 7H51Z" fill="#d1dde1" />
        <path d="M120 130h40l5 5h-50Z" fill="#91a5ad" />
      </> : tipo === 'Cámara digital' ? <>
        <path d="m92 58 9-18h57l12 18" fill="#526572" />
        <rect x="53" y="56" width="174" height="81" rx="12" fill="#324854" />
        <rect x="53" y="78" width="174" height="43" fill="#243945" />
        <rect x="62" y="48" width="23" height="9" rx="3" fill="#647b87" />
        <rect x="189" y="65" width="24" height="12" rx="3" fill="#bed9dd" />
        <circle cx="139" cy="97" r="47" fill="#536b77" />
        <circle cx="139" cy="97" r="37" fill="#1b313e" stroke="#829aa4" strokeWidth="3" />
        <circle cx="139" cy="97" r="25" fill="#375f6a" />
        <circle cx="139" cy="97" r="16" fill="#162e3c" />
        <circle cx="130" cy="88" r="8" fill="#80c5c9" opacity=".5" />
      </> : tipo === 'Proyector' ? <>
        <path d="m66 52 21-13h111l22 13" fill="#d9dce4" />
        <rect x="56" y="52" width="171" height="79" rx="15" fill="#e6e8ee" />
        <path d="M56 96h171v20c0 8-6 15-15 15H71c-8 0-15-7-15-15Z" fill="#c7cdd8" />
        <rect x="71" y="124" width="19" height="12" rx="4" fill="#627080" />
        <rect x="191" y="124" width="19" height="12" rx="4" fill="#627080" />
        <circle cx="177" cy="89" r="31" fill="#788698" />
        <circle cx="177" cy="89" r="23" fill="#283e51" />
        <circle cx="177" cy="89" r="15" fill="#557f9c" />
        <circle cx="172" cy="83" r="6" fill="#a3c7dd" />
        <path d="M73 77h40M73 86h40M73 95h40M73 104h30" stroke="#9ca8b8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="85" cy="60" r="2" fill="#087f75" />
      </> : <>
        <path d="m140 37 64 35v57l-64 29-64-29V72Z" fill="#bedbd6" /><path d="m76 72 64 32 64-32M140 104v54" stroke="#65998f" strokeWidth="3" />
      </>}
    </svg>
  )
}
