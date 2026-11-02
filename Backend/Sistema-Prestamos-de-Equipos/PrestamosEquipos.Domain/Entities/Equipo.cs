namespace PrestamosEquipos.Domain.Entities
{
    public class Equipo
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
        public ICollection<Prestamo> Prestamos { get; set; } = new List<Prestamo>();
    }
}
