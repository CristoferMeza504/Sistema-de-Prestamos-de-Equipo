namespace PrestamosEquipos.Domain.Entities
{
    public class Prestamo
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public int EquipoId { get; set; }
        public string Estado { get; set; } = string.Empty;
        public DateTime FechaPrestamo { get; set; }
        public DateTime? FechaDevolucion { get; set; }
        public Usuario Usuario { get; set; } = null!;
        public Equipo Equipo { get; set; } = null!;
    }
}
