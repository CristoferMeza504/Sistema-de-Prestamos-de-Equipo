using Microsoft.AspNetCore.Mvc;
using PrestamosEquipos.Application.Features.Usuarios;
using PrestamosEquipos.Application.Features.Usuarios.DTOs;

namespace PrestamosEquipos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController(UsuarioService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UsuarioResponseDto>>> GetUsuarios() =>
        Ok(await service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UsuarioResponseDto>> GetUsuario(int id) =>
        Ok(await service.GetByIdAsync(id));

    [HttpPost]
    public async Task<ActionResult<UsuarioResponseDto>> CrearUsuario([FromBody] CrearUsuarioRequestDto request)
    {
        var usuario = await service.CreateAsync(request);
        return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, usuario);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> ActualizarUsuario(int id, [FromBody] ActualizarUsuarioRequestDto request)
    {
        await service.UpdateAsync(id, request);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> EliminarUsuario(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}
