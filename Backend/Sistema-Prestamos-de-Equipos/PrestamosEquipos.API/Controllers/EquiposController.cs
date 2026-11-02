using Microsoft.AspNetCore.Mvc;
using PrestamosEquipos.Application.Features.Equipos;
using PrestamosEquipos.Application.Features.Equipos.DTOs;

namespace PrestamosEquipos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EquiposController(EquipoService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EquipoResponseDto>>> GetEquipos([FromQuery] string? estado) =>
        Ok(await service.GetAllAsync(estado));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<EquipoResponseDto>> GetEquipo(int id) =>
        Ok(await service.GetByIdAsync(id));

    [HttpPost]
    public async Task<ActionResult<EquipoResponseDto>> CrearEquipo([FromBody] CrearEquipoRequestDto request)
    {
        var equipo = await service.CreateAsync(request);
        return CreatedAtAction(nameof(GetEquipo), new { id = equipo.Id }, equipo);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> ActualizarEquipo(int id, [FromBody] ActualizarEquipoRequestDto request)
    {
        await service.UpdateAsync(id, request);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> EliminarEquipo(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}
