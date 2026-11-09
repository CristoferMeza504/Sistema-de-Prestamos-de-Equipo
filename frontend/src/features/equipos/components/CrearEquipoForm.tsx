import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { crearEquipoAsync, extraerMensajeErrorBackend } from '../api/equiposApi'
import { crearEquipoSchema, type CrearEquipoSchemaType } from '../schemas/equipo.schema'
import type { Equipo } from '../types/equipo.types'

interface CrearEquipoFormProps {
  onEquipoCreado: (equipo: Equipo) => void
  onCancelar: () => void
}

export function CrearEquipoForm({ onEquipoCreado, onCancelar }: CrearEquipoFormProps) {
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const {
    register, handleSubmit, reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CrearEquipoSchemaType>({
    resolver: zodResolver(crearEquipoSchema),
    mode: 'onChange',
    defaultValues: { nombre: '', tipo: '', estado: 'Disponible' },
  })

  async function guardar(datos: CrearEquipoSchemaType) {
    setErrorServidor(null)
    try {
      const equipo = await crearEquipoAsync(datos)
      reset()
      onEquipoCreado(equipo)
    } catch (error) {
      setErrorServidor(extraerMensajeErrorBackend(error))
    }
  }

  const estiloCampo = 'mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-2 focus:outline-teal-200 disabled:bg-slate-100'

  return (
    <form onSubmit={handleSubmit(guardar)} noValidate
      onChange={() => setErrorServidor(null)}
      className="mb-7 rounded-2xl border border-teal-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold">Registrar equipo</h2>
      <p className="mt-1 text-sm text-slate-500">Agrega una herramienta al catálogo compartido.</p>
      <fieldset disabled={isSubmitting} className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre-equipo" className="text-sm font-semibold">Nombre</label>
          <input id="nombre-equipo" autoFocus {...register('nombre')}
            placeholder="Ej. Laptop de trabajo" aria-invalid={!!errors.nombre}
            aria-describedby={errors.nombre ? 'error-nombre' : undefined} className={estiloCampo} />
          {errors.nombre && <p id="error-nombre" className="mt-2 text-xs text-red-700">{errors.nombre.message}</p>}
        </div>
        <div>
          <label htmlFor="tipo-equipo" className="text-sm font-semibold">Tipo</label>
          <input id="tipo-equipo" {...register('tipo')} placeholder="Ej. Computadora portátil"
            aria-invalid={!!errors.tipo} aria-describedby={errors.tipo ? 'error-tipo' : undefined}
            className={estiloCampo} />
          {errors.tipo && <p id="error-tipo" className="mt-2 text-xs text-red-700">{errors.tipo.message}</p>}
        </div>
        <div>
          <label htmlFor="estado-equipo" className="text-sm font-semibold">Estado inicial</label>
          <select id="estado-equipo" {...register('estado')} aria-invalid={!!errors.estado}
            aria-describedby={errors.estado ? 'error-estado' : undefined} className={estiloCampo}>
            <option value="Disponible">Disponible</option>
            <option value="Mantenimiento">Mantenimiento</option>
          </select>
          {errors.estado && <p id="error-estado" className="mt-2 text-xs text-red-700">Selecciona un estado válido.</p>}
        </div>
      </fieldset>
      {errorServidor && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{errorServidor}</p>}
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" disabled={!isValid || isSubmitting}
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50">
          {isSubmitting ? 'Guardando…' : 'Guardar equipo'}
        </button>
        <button type="button" disabled={isSubmitting} onClick={onCancelar}
          className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">Cancelar</button>
      </div>
    </form>
  )
}
