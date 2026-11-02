namespace PrestamosEquipos.Application.Features.Prestamos.DTOs;

public class PrestamoResponseDto
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public int EquipoId { get; set; }
    public string Estado { get; set; } = string.Empty;
    public DateTime FechaPrestamo { get; set; }
    public DateTime FechaLimite { get; set; }
    public DateTime? FechaDevolucion { get; set; }
}
