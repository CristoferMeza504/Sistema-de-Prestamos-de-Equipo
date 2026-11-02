using FluentValidation;
using PrestamosEquipos.Application.Common;
using PrestamosEquipos.Application.Features.Usuarios.DTOs;
using PrestamosEquipos.Application.Interfaces;
using PrestamosEquipos.Domain.Entities;

namespace PrestamosEquipos.Application.Features.Usuarios;

public class UsuarioService(
    IUsuarioRepository usuarios,
    IPrestamoRepository prestamos,
    IUnitOfWork unitOfWork,
    IValidator<CrearUsuarioRequestDto> crearValidator,
    IValidator<ActualizarUsuarioRequestDto> actualizarValidator)
{
    public async Task<IEnumerable<UsuarioResponseDto>> GetAllAsync() =>
        (await usuarios.GetAllAsync()).Select(ToResponse);

    public async Task<UsuarioResponseDto> GetByIdAsync(int id) => ToResponse(await ObtenerAsync(id));

    public async Task<UsuarioResponseDto> CreateAsync(CrearUsuarioRequestDto request)
    {
        await crearValidator.ValidateAndThrowAsync(request);
        return await unitOfWork.ExecuteAsync(async () =>
        {
            var correo = request.Correo.Trim().ToLowerInvariant();
            if (await usuarios.ExisteCorreoAsync(correo))
                throw new ConflictoException("El correo ya está registrado.");

            var usuario = new Usuario { Nombre = request.Nombre.Trim(), Correo = correo };
            return ToResponse(await usuarios.AddAsync(usuario));
        });
    }

    public async Task UpdateAsync(int id, ActualizarUsuarioRequestDto request)
    {
        await actualizarValidator.ValidateAndThrowAsync(request);
        await unitOfWork.ExecuteAsync(async () =>
        {
            var usuario = await ObtenerAsync(id);
            var correo = request.Correo.Trim().ToLowerInvariant();
            if (await usuarios.ExisteCorreoAsync(correo, id))
                throw new ConflictoException("El correo ya está registrado.");

            usuario.Nombre = request.Nombre.Trim();
            usuario.Correo = correo;
            await usuarios.UpdateAsync(usuario);
            return true;
        });
    }

    public async Task DeleteAsync(int id)
    {
        await unitOfWork.ExecuteAsync(async () =>
        {
            var usuario = await ObtenerAsync(id);
            if (await prestamos.UsuarioTieneHistorialAsync(id))
                throw new ConflictoException("No se puede eliminar un usuario con historial de préstamos.");
            await usuarios.DeleteAsync(usuario);
            return true;
        });
    }

    private async Task<Usuario> ObtenerAsync(int id) =>
        await usuarios.GetByIdAsync(id) ?? throw new RecursoNoEncontradoException("El usuario no existe.");

    private static UsuarioResponseDto ToResponse(Usuario usuario) => new()
    {
        Id = usuario.Id, Nombre = usuario.Nombre, Correo = usuario.Correo
    };
}
