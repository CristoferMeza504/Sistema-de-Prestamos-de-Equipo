import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { actualizarEquipoAsync, extraerMensajeErrorBackend } from '../api/equiposApi'
import { actualizarEquipoSchema, type ActualizarEquipoSchemaType } from '../schemas/equipo.schema'
import type { Equipo } from '../types/equipo.types'

interface EditarEquipoFormProps {
  equipo: Equipo
  onEquipoActualizado: (equipo: Equipo) => void
  onCancelar: () => void
}

export function EditarEquipoForm({ equipo, onEquipoActualizado, onCancelar }: EditarEquipoFormProps) {
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const {
    register, handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ActualizarEquipoSchemaType>({
    resolver: zodResolver(actualizarEquipoSchema),
    mode: 'onChange',
    defaultValues: { nombre: equipo.nombre, tipo: equipo.tipo, estado: equipo.estado },
  })

  async function guardar(datos: ActualizarEquipoSchemaType) {
    setErrorServidor(null)
    try {
      await actualizarEquipoAsync(equipo.id, datos)
      // PUT responde 204. Zod ya recortó los textos igual que el servicio .NET.
      onEquipoActualizado({ ...equipo, ...datos })
    } catch (error) {
      setErrorServidor(extraerMensajeErrorBackend(error))
    }
  }

  const estiloCampo = 'mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-2 focus:outline-teal-200 disabled:bg-slate-100'

  return (
    <form onSubmit={handleSubmit(guardar)} noValidate
      onChange={() => setErrorServidor(null)}
      className="mb-7 rounded-2xl border border-teal-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold">Editar equipo</h2>
      <p className="mt-1 text-sm text-slate-500">Actualiza los datos del equipo seleccionado.</p>
      <fieldset disabled={isSubmitting} className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="editar-nombre" className="text-sm font-semibold">Nombre</label>
          <input id="editar-nombre" autoFocus {...register('nombre')}
            aria-invalid={!!errors.nombre}
            aria-describedby={errors.nombre ? 'editar-error-nombre' : undefined} className={estiloCampo} />
          {errors.nombre && <p id="editar-error-nombre" className="mt-2 text-xs text-red-700">{errors.nombre.message}</p>}
        </div>
        <div>
          <label htmlFor="editar-tipo" className="text-sm font-semibold">Tipo</label>
          <input id="editar-tipo" {...register('tipo')}
            aria-invalid={!!errors.tipo} aria-describedby={errors.tipo ? 'editar-error-tipo' : undefined}
            className={estiloCampo} />
          {errors.tipo && <p id="editar-error-tipo" className="mt-2 text-xs text-red-700">{errors.tipo.message}</p>}
        </div>
        <div>
          <label htmlFor="editar-estado" className="text-sm font-semibold">Estado</label>
          <select id="editar-estado" {...register('estado')} aria-invalid={!!errors.estado}
            aria-describedby="editar-ayuda-estado" className={estiloCampo}>
            {equipo.estado === 'Prestado' ? (
              <option value="Prestado">Prestado</option>
            ) : (
              <>
                <option value="Disponible">Disponible</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </>
            )}
          </select>
          <p id="editar-ayuda-estado" className="mt-2 text-xs text-slate-500">
            {equipo.estado === 'Prestado'
              ? 'Registra la devolución para cambiar el estado de este equipo.'
              : 'El estado Prestado se asigna al registrar un préstamo.'}
          </p>
          {errors.estado && <p className="mt-2 text-xs text-red-700">{errors.estado.message}</p>}
        </div>
      </fieldset>
      {errorServidor && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{errorServidor}</p>}
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" disabled={!isValid || isSubmitting}
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50">
          {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        </button>
        <button type="button" disabled={isSubmitting} onClick={onCancelar}
          className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">Cancelar</button>
      </div>
    </form>
  )
}
