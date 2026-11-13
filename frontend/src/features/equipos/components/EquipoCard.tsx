import { EquipoIlustracion } from './EquipoIlustracion'
import type { Equipo } from '../types/equipo.types'

interface EquipoCardProps extends Equipo {
  onEditar: (equipo: Equipo) => void
  onEliminar: (equipo: Equipo) => void
  eliminando: boolean
  bloquearAcciones: boolean
}

export function EquipoCard({ id, nombre, tipo, estado, onEditar, onEliminar, eliminando, bloquearAcciones }: EquipoCardProps) {
  const estiloEstado = estado === 'Disponible'
    ? 'border-teal-200 bg-teal-50 text-teal-800'
    : estado === 'Prestado'
      ? 'border-blue-200 bg-blue-50 text-blue-800'
      : 'border-amber-200 bg-amber-50 text-amber-800'

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-teal-400">
      <div className="relative flex min-h-52 items-center justify-center border-b border-slate-100 bg-slate-50 px-4 pt-5">
        <span className="absolute top-4 left-4 font-mono text-[10px] tracking-wider text-slate-500">EQ · {String(id).padStart(3, '0')}</span>
        <EquipoIlustracion tipo={tipo} />
      </div>
      <div className="p-5">
        <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold ${estiloEstado}`}><span aria-hidden="true" className="size-1.5 rounded-full bg-current" />{estado}</span>
        <h3 className="mt-3 text-lg font-bold tracking-tight wrap-anywhere">{nombre}</h3>
        <p className="mt-1 text-xs text-slate-500 wrap-anywhere">{tipo}</p>
        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          <button type="button" disabled={bloquearAcciones}
            onClick={() => onEditar({ id, nombre, tipo, estado })}
            aria-label={`Editar ${nombre}`}
            className="w-full rounded-lg border border-teal-200 px-3.5 py-2.5 text-xs font-semibold text-brand hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50">
            Editar equipo
          </button>
          <button disabled className="flex w-full items-center justify-between rounded-lg bg-slate-100 px-3.5 py-2.5 text-xs font-semibold text-slate-500 disabled:cursor-not-allowed"><span>Solicitar préstamo</span><span aria-hidden="true">↗</span></button>
          <button type="button" disabled={bloquearAcciones}
            onClick={() => onEliminar({ id, nombre, tipo, estado })}
            aria-label={`Eliminar ${nombre}`}
            className="w-full rounded-lg px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
            {eliminando ? 'Eliminando…' : 'Eliminar equipo'}
          </button>
        </div>
      </div>
    </article>
  )
}
