using FluentValidation;
using PrestamosEquipos.Application.Common;
using PrestamosEquipos.Application.Features.Equipos.DTOs;
using PrestamosEquipos.Application.Interfaces;
using PrestamosEquipos.Domain.Constants;
using PrestamosEquipos.Domain.Entities;

namespace PrestamosEquipos.Application.Features.Equipos;

public class EquipoService(
    IEquipoRepository equipos,
    IPrestamoRepository prestamos,
    IUnitOfWork unitOfWork,
    IValidator<CrearEquipoRequestDto> crearValidator,
    IValidator<ActualizarEquipoRequestDto> actualizarValidator)
{
    public async Task<IEnumerable<EquipoResponseDto>> GetAllAsync(string? estado)
    {
        if (estado is not null && estado is not (EstadosEquipo.Disponible or EstadosEquipo.Prestado or EstadosEquipo.Mantenimiento))
            throw new ValidationException("El estado debe ser Disponible, Prestado o Mantenimiento.");

        return (await equipos.GetAllAsync(estado)).Select(ToResponse);
    }

    public async Task<EquipoResponseDto> GetByIdAsync(int id) => ToResponse(await ObtenerAsync(id));

    public async Task<EquipoResponseDto> CreateAsync(CrearEquipoRequestDto request)
    {
        await crearValidator.ValidateAndThrowAsync(request);
        return await unitOfWork.ExecuteAsync(async () =>
        {
            var equipo = new Equipo
            {
                Nombre = request.Nombre.Trim(), Tipo = request.Tipo.Trim(), Estado = request.Estado
            };
            return ToResponse(await equipos.AddAsync(equipo));
        });
    }

    public async Task UpdateAsync(int id, ActualizarEquipoRequestDto request)
    {
        await actualizarValidator.ValidateAndThrowAsync(request);
        await unitOfWork.ExecuteAsync(async () =>
        {
            var equipo = await ObtenerAsync(id);
            var tieneActivo = await prestamos.EquipoTieneActivoAsync(id);
            if (tieneActivo && request.Estado != EstadosEquipo.Prestado)
                throw new ConflictoException("Registre la devolución antes de cambiar el estado de un equipo prestado.");
            if (!tieneActivo && request.Estado == EstadosEquipo.Prestado)
                throw new ConflictoException("Para marcar el equipo como Prestado debe registrar un préstamo.");

            equipo.Nombre = request.Nombre.Trim();
            equipo.Tipo = request.Tipo.Trim();
            equipo.Estado = request.Estado;
            await equipos.UpdateAsync(equipo);
            return true;
        });
    }

    public async Task DeleteAsync(int id)
    {
        await unitOfWork.ExecuteAsync(async () =>
        {
            var equipo = await ObtenerAsync(id);
            if (await prestamos.EquipoTieneHistorialAsync(id))
                throw new ConflictoException("No se puede eliminar un equipo con historial de préstamos.");
            await equipos.DeleteAsync(equipo);
            return true;
        });
    }

    private async Task<Equipo> ObtenerAsync(int id) =>
        await equipos.GetByIdAsync(id) ?? throw new RecursoNoEncontradoException("El equipo no existe.");

    private static EquipoResponseDto ToResponse(Equipo equipo) => new()
    {
        Id = equipo.Id, Nombre = equipo.Nombre, Tipo = equipo.Tipo, Estado = equipo.Estado
    };
}
