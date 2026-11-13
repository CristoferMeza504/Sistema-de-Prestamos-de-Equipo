import axios from 'axios'
import type { ActualizarEquipoDto, CrearEquipoDto, Equipo } from '../types/equipo.types'

const baseURL = import.meta.env.VITE_API_BASE_URL?.trim()

const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: { Accept: 'application/json' },
})

function comprobarConfiguracion() {
  if (!baseURL) throw new Error('No se ha configurado la conexión con el servidor.')
}

// El genérico de Axios no valida JSON: comprobamos los campos que utiliza la UI.
function esEquipo(valor: unknown): valor is Equipo {
  if (!valor || typeof valor !== 'object') return false
  const equipo = valor as Record<string, unknown>
  return Number.isInteger(equipo.id) && Number(equipo.id) > 0
    && typeof equipo.nombre === 'string'
    && typeof equipo.tipo === 'string'
    && typeof equipo.estado === 'string'
}

export async function obtenerEquiposAsync(signal?: AbortSignal): Promise<Equipo[]> {
  comprobarConfiguracion()
  const respuesta = await apiClient.get<unknown>('/equipos', { signal })
  if (!Array.isArray(respuesta.data) || !respuesta.data.every(esEquipo)) {
    throw new Error('El servidor devolvió un catálogo con un formato inesperado.')
  }
  return respuesta.data
}

export async function crearEquipoAsync(datos: CrearEquipoDto): Promise<Equipo> {
  comprobarConfiguracion()
  const respuesta = await apiClient.post<unknown>('/equipos', datos)
  if (!esEquipo(respuesta.data)) {
    throw new Error('No se pudo comprobar la respuesta de creación. Actualiza el catálogo antes de volver a guardar.')
  }
  return respuesta.data
}

export async function eliminarEquipoAsync(id: number): Promise<void> {
  comprobarConfiguracion()
  await apiClient.delete(`/equipos/${id}`)
}

export async function actualizarEquipoAsync(id: number, datos: ActualizarEquipoDto): Promise<void> {
  comprobarConfiguracion()
  await apiClient.put(`/equipos/${id}`, datos)
}

// El backend propio utiliza ValidationProblemDetails: errors contiene arrays por campo.
export function extraerMensajeErrorBackend(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
  }
  if (!error.response) {
    return 'No se recibió confirmación del servidor. Comprueba la conexión y actualiza el catálogo antes de repetir la operación.'
  }
  if (error.response.status >= 500) return 'El servidor no pudo completar la operación. Inténtalo más tarde.'

  const datos: unknown = error.response.data
  if (datos && typeof datos === 'object' && !Array.isArray(datos)) {
    const problema = datos as Record<string, unknown>
    if (problema.errors && typeof problema.errors === 'object') {
      const mensajes = Object.values(problema.errors).flat()
        .filter((mensaje): mensaje is string => typeof mensaje === 'string' && mensaje.trim().length > 0)
      if (mensajes.length) return [...new Set(mensajes)].join(' ')
    }
    if (typeof problema.detail === 'string' && problema.detail.trim()) return problema.detail
    if (typeof problema.title === 'string' && problema.title.trim()) return problema.title
  }
  return 'No se pudo completar la operación solicitada.'
}
