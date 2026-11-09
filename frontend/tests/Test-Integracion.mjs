// Ejecutar desde frontend con API y PostgreSQL iniciados: node tests/Test-Integracion.mjs
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
const creados = new Set()
let comprobaciones = 0
const prefijo = `prueba_${randomUUID()}`

function comprobar(condicion, mensaje) {
  assert.ok(condicion, mensaje)
  comprobaciones++
}

let api
try {
  api = await vite.ssrLoadModule('/src/features/equipos/api/equiposApi.ts')
  const { crearEquipoSchema } = await vite.ssrLoadModule('/src/features/equipos/schemas/equipo.schema.ts')
  const baseURL = vite.config.env.VITE_API_BASE_URL
  assert.ok(baseURL, 'Configura VITE_API_BASE_URL en frontend/.env')
  const originales = await api.obtenerEquiposAsync()

  comprobar(crearEquipoSchema.safeParse({ nombre: 'A', tipo: 'T', estado: 'Disponible' }).success, 'No exigir mínimo 3')
  comprobar(!crearEquipoSchema.safeParse({ nombre: '  ', tipo: 'T', estado: 'Disponible' }).success, 'Rechazar espacios')
  comprobar(!crearEquipoSchema.safeParse({ nombre: 'A', tipo: '', estado: 'Disponible' }).success, 'Tipo obligatorio')
  comprobar(!crearEquipoSchema.safeParse({ nombre: 'A', tipo: 'T', estado: 'Prestado' }).success, 'No crear Prestado')
  comprobar(!crearEquipoSchema.safeParse({ nombre: 'A'.repeat(101), tipo: 'T', estado: 'Disponible' }).success, 'Límite nombre')
  comprobar(!crearEquipoSchema.safeParse({ nombre: 'A', tipo: 'T'.repeat(251), estado: 'Disponible' }).success, 'Límite tipo')
  comprobar(!crearEquipoSchema.safeParse({ nombre: '😀'.repeat(51), tipo: 'T', estado: 'Disponible' }).success, 'Longitud compatible con .NET')
  comprobar(crearEquipoSchema.parse({ nombre: ' A ', tipo: ' T ', estado: 'Mantenimiento' }).nombre === 'A', 'Recortar espacios')

  const cors = await fetch(`${baseURL}/equipos`, { method: 'OPTIONS', headers: {
    Origin: 'http://localhost:5173',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'content-type',
  } })
  comprobar(cors.status === 204, 'Preflight 204')
  comprobar(cors.headers.get('access-control-allow-origin') === 'http://localhost:5173', 'Origen permitido')
  const noPermitido = await fetch(`${baseURL}/equipos`, { headers: { Origin: 'https://origen-no-permitido.example' } })
  comprobar(!noPermitido.headers.has('access-control-allow-origin'), 'No autorizar origen ajeno')

  try {
    await api.crearEquipoAsync({ nombre: '', tipo: '', estado: 'Prestado' })
    assert.fail('El servidor debe rechazar el DTO inválido')
  } catch (error) {
    comprobar(error.response?.status === 400, 'Validación backend 400')
    comprobar(!!error.response.data.errors.Nombre, 'Contrato errors por campo')
    const mensaje = api.extraerMensajeErrorBackend(error)
    comprobar(mensaje.includes('Disponible') && mensaje.includes('Mantenimiento'), 'Propagar regla de estado')
  }

  const equipo = await api.crearEquipoAsync({ nombre: prefijo, tipo: 'Computadora portátil', estado: 'Disponible' })
  creados.add(equipo.id)
  comprobar(equipo.id > 0 && equipo.nombre === prefijo, 'POST retorna entidad persistida')
  comprobar((await api.obtenerEquiposAsync()).some((e) => e.id === equipo.id), 'GET confirma persistencia')
  const individual = await fetch(`${baseURL}/equipos/${equipo.id}`)
  comprobar(individual.status === 200, 'GET individual 200')
  comprobar(Object.keys(await individual.json()).sort().join() === 'estado,id,nombre,tipo', 'DTO sin relaciones EF')

  await api.eliminarEquipoAsync(equipo.id)
  creados.delete(equipo.id)
  comprobar(!(await api.obtenerEquiposAsync()).some((e) => e.id === equipo.id), 'DELETE retira de PostgreSQL')
  try {
    await api.eliminarEquipoAsync(equipo.id)
    assert.fail('La segunda eliminación debe devolver 404')
  } catch (error) {
    comprobar(error.response?.status === 404, 'DELETE inexistente 404')
    comprobar(api.extraerMensajeErrorBackend(error).includes('no existe'), 'Propagar detail 404')
  }

  const conflicto = { isAxiosError: true, response: { status: 409, data: { detail: 'No se puede eliminar un equipo con historial de préstamos.' } } }
  comprobar(api.extraerMensajeErrorBackend(conflicto).includes('historial'), 'Extraer conflicto ProblemDetails')
  comprobar(api.extraerMensajeErrorBackend({ isAxiosError: true }).includes('No se recibió confirmación'), 'Distinguir red de HTTP')
  const finales = await api.obtenerEquiposAsync()
  comprobar(originales.every((anterior) => finales.some((actual) => actual.id === anterior.id)), 'Conservar equipos preexistentes')
  console.log(`${comprobaciones} comprobaciones correctas. Registros temporales retirados.`)
} finally {
  try {
    if (api) for (const id of creados) await api.eliminarEquipoAsync(id)
  } finally {
    await vite.close()
  }
}
