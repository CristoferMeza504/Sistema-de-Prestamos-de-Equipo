using Microsoft.AspNetCore.Mvc;
using PrestamosEquipos.Application.Features.Prestamos;
using PrestamosEquipos.Application.Features.Prestamos.DTOs;

namespace PrestamosEquipos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PrestamosController(PrestamoService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PrestamoResponseDto>>> GetPrestamos([FromQuery] ConsultarPrestamosRequestDto query) =>
        Ok(await service.GetAllAsync(query));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PrestamoResponseDto>> GetPrestamo(int id) =>
        Ok(await service.GetByIdAsync(id));

    [HttpPost]
    public async Task<ActionResult<PrestamoResponseDto>> CrearPrestamo([FromBody] CrearPrestamoRequestDto request)
    {
        var prestamo = await service.CreateAsync(request);
        return CreatedAtAction(nameof(GetPrestamo), new { id = prestamo.Id }, prestamo);
    }

    [HttpPost("{id:int}/devolucion")]
    public async Task<IActionResult> DevolverPrestamo(int id)
    {
        await service.DevolverAsync(id);
        return NoContent();
    }
}
