namespace PrestamosEquipos.Application.Features.Prestamos.DTOs;

public class ConsultarPrestamosRequestDto
{
    public int? UsuarioId { get; set; }
    public int? EquipoId { get; set; }
    public string? Estado { get; set; }
}
