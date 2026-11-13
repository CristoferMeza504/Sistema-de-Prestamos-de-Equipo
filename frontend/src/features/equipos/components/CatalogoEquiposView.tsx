import { useEffect, useState } from 'react'
import { eliminarEquipoAsync, extraerMensajeErrorBackend, obtenerEquiposAsync } from '../api/equiposApi'
import type { Equipo } from '../types/equipo.types'
import { CrearEquipoForm } from './CrearEquipoForm'
import { EditarEquipoForm } from './EditarEquipoForm'
import { EquipoCard } from './EquipoCard'

export function CatalogoEquiposView() {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [equipoAEditar, setEquipoAEditar] = useState<Equipo | null>(null)
  const [equipoAEliminar, setEquipoAEliminar] = useState<Equipo | null>(null)
  const [eliminandoId, setEliminandoId] = useState<number | null>(null)
  const [errorOperacion, setErrorOperacion] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [intentoCarga, setIntentoCarga] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    obtenerEquiposAsync(controller.signal)
      .then((datos) => {
        if (!controller.signal.aborted) setEquipos(datos)
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setErrorCarga(extraerMensajeErrorBackend(error))
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false)
      })
    // Cancela una lectura anterior al desmontar o volver a cargar (también en StrictMode).
    return () => controller.abort()
  }, [intentoCarga])

  const equiposFiltrados = equipos.filter((equipo) =>
    equipo.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()),
  )
  const ocupado = eliminandoId !== null
  const formularioAbierto = mostrarFormulario || equipoAEditar !== null

  function actualizarCatalogo() {
    setCargando(true)
    setErrorCarga(null)
    setErrorOperacion(null)
    setMensaje('')
    setEquipoAEliminar(null)
    setIntentoCarga((actual) => actual + 1)
  }

  function manejarEquipoCreado(equipo: Equipo) {
    setEquipos((actuales) => [...actuales, equipo])
    setMostrarFormulario(false)
    // Mostrar el registro recién creado aunque no coincida con la búsqueda anterior.
    setBusqueda('')
    setMensaje(`Se registró ${equipo.nombre}.`)
  }

  function manejarEquipoActualizado(equipo: Equipo) {
    setEquipos((actuales) => actuales.map((actual) => actual.id === equipo.id ? equipo : actual))
    setEquipoAEditar(null)
    setBusqueda('')
    setMensaje(`Se actualizó ${equipo.nombre}.`)
  }

  async function confirmarEliminacion() {
    if (!equipoAEliminar || ocupado) return
    const equipo = equipoAEliminar
    setEliminandoId(equipo.id)
    setErrorOperacion(null)
    setMensaje('')
    try {
      await eliminarEquipoAsync(equipo.id)
      setEquipos((actuales) => actuales.filter((actual) => actual.id !== equipo.id))
      setEquipoAEliminar(null)
      setMensaje(`Se eliminó ${equipo.nombre}.`)
    } catch (error) {
      setErrorOperacion(extraerMensajeErrorBackend(error))
      setEquipoAEliminar(null)
    } finally {
      setEliminandoId(null)
    }
  }

  return (
    <div>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1.5 text-[10px] font-bold tracking-[0.2em] text-brand">RECURSOS COMPARTIDOS</p>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo de equipos</h1>
          <p className="mt-2 text-sm text-slate-500">Lo que necesitas para tu próxima gran idea.</p>
        </div>
        {!formularioAbierto && (
          <button type="button" disabled={cargando || !!errorCarga || ocupado}
            onClick={() => { setMostrarFormulario(true); setEquipoAEliminar(null); setErrorOperacion(null); setMensaje('') }}
            className="flex items-center gap-2 self-start rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-brand disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto">
            <span className="text-lg leading-none">+</span> Nuevo equipo
          </button>
        )}
      </div>

      <section aria-labelledby="bienvenida" className="relative mb-8 overflow-hidden rounded-2xl bg-ink px-6 py-8 text-white sm:px-9 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full border border-teal-200/10 sm:right-0" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-12 -right-4 size-56 rounded-full border border-teal-200/15 sm:right-12" />
        <div aria-hidden="true" className="pointer-events-none absolute top-0 right-8 size-32 rounded-full border border-teal-200/20 sm:right-24" />
        <div className="relative max-w-lg">
          <p className="mb-4 text-[10px] font-semibold tracking-[0.24em] text-teal-300">CONECTA · CREA · COMPARTE</p>
          <h2 id="bienvenida" className="text-2xl font-semibold tracking-tight sm:text-3xl">Grandes proyectos.<br /><span className="text-teal-200">Las herramientas correctas.</span></h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">Explora el catálogo y conoce el estado de cada equipo. Compartir recursos es abrir nuevas posibilidades.</p>
        </div>
      </section>

      {mostrarFormulario && <CrearEquipoForm onEquipoCreado={manejarEquipoCreado} onCancelar={() => setMostrarFormulario(false)} />}
      {equipoAEditar && (
        <EditarEquipoForm key={equipoAEditar.id} equipo={equipoAEditar}
          onEquipoActualizado={manejarEquipoActualizado} onCancelar={() => setEquipoAEditar(null)} />
      )}

      <section aria-labelledby="listado" aria-busy={cargando}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="listado" className="text-lg font-bold tracking-tight">Explora los equipos</h2>
          <button type="button" onClick={actualizarCatalogo} disabled={cargando || ocupado || formularioAbierto}
            className="rounded-lg px-3 py-2 text-xs font-semibold text-brand hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50">Actualizar catálogo</button>
        </div>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:max-w-sm">
            <label htmlFor="busqueda-equipo" className="text-xs font-semibold text-slate-600">Buscar por nombre</label>
            <input id="busqueda-equipo" type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              placeholder="¿Qué equipo necesitas?" disabled={cargando || !!errorCarga}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-brand focus:outline-2 focus:outline-teal-200 disabled:opacity-50" />
          </div>
          {!cargando && !errorCarga && <p aria-live="polite" className="shrink-0 text-xs text-slate-500">Mostrando <strong className="text-ink">{equiposFiltrados.length}</strong> de {equipos.length} equipos</p>}
        </div>

        <p role="status" className="mb-4 text-sm font-medium text-brand">{mensaje}</p>
        {errorOperacion && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{errorOperacion}</p>}

        {equipoAEliminar && (
          <section aria-labelledby="confirmar-titulo" className="mb-5 rounded-xl border border-red-200 bg-white p-5">
            <h3 id="confirmar-titulo" className="font-bold">¿Eliminar {equipoAEliminar.nombre}?</h3>
            <p className="mt-2 text-sm text-slate-600">Esta acción elimina el equipo del catálogo. Los equipos con historial de préstamos deben conservarse.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" autoFocus disabled={ocupado} onClick={confirmarEliminacion}
                className="rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{ocupado ? 'Eliminando…' : 'Sí, eliminar'}</button>
              <button type="button" disabled={ocupado} onClick={() => setEquipoAEliminar(null)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold disabled:opacity-50">Conservar equipo</button>
            </div>
          </section>
        )}

        {cargando ? (
          <p role="status" className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-brand">Cargando equipos…</p>
        ) : errorCarga ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{errorCarga}</p>
        ) : equiposFiltrados.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="font-semibold">{equipos.length === 0 ? 'Tu catálogo está por comenzar' : 'No se encontraron equipos'}</h3>
            <p className="mt-2 text-sm text-slate-500">{equipos.length === 0 ? 'Registra tu primer equipo para empezar a compartir recursos.' : 'Prueba con otro nombre o borra la búsqueda.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {equiposFiltrados.map((equipo) => (
              <EquipoCard key={equipo.id} {...equipo} eliminando={eliminandoId === equipo.id}
                bloquearAcciones={ocupado || formularioAbierto}
                onEditar={(seleccionado) => { setEquipoAEditar(seleccionado); setEquipoAEliminar(null); setErrorOperacion(null); setMensaje('') }}
                onEliminar={(seleccionado) => { setEquipoAEliminar(seleccionado); setErrorOperacion(null); setMensaje('') }} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
