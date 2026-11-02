namespace PrestamosEquipos.Application.Features.Equipos.DTOs;

public class CrearEquipoRequestDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
}
