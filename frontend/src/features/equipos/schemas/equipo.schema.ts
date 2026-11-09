import { z } from 'zod'

export const crearEquipoSchema = z.object({
  nombre: z.string().trim()
    .min(1, 'Escribe el nombre del equipo.')
    .refine((valor) => valor.length <= 100, 'El nombre no puede superar los 100 caracteres.'),
  tipo: z.string().trim()
    .min(1, 'Escribe el tipo de equipo.')
    .refine((valor) => valor.length <= 250, 'El tipo no puede superar los 250 caracteres.'),
  estado: z.enum(['Disponible', 'Mantenimiento']),
})

export type CrearEquipoSchemaType = z.infer<typeof crearEquipoSchema>
