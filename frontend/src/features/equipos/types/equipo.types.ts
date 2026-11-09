// Contrato de salida de GET/POST /api/equipos.
export interface Equipo {
  id: number
  nombre: string
  tipo: string
  estado: string
}

// El servidor genera el id y solo permite estos estados al crear.
export interface CrearEquipoDto {
  nombre: string
  tipo: string
  estado: 'Disponible' | 'Mantenimiento'
}
