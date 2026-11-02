namespace PrestamosEquipos.Domain.Entities
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;

        public ICollection<Prestamo> Prestamos { get; set; } = new List<Prestamo>();
    }
}
