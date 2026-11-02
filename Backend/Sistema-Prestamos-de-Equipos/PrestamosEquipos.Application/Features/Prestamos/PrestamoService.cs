using FluentValidation;
using PrestamosEquipos.Application.Common;
using PrestamosEquipos.Application.Features.Prestamos.DTOs;
using PrestamosEquipos.Application.Interfaces;
using PrestamosEquipos.Domain.Constants;
using PrestamosEquipos.Domain.Entities;

namespace PrestamosEquipos.Application.Features.Prestamos;

public class PrestamoService(
    IPrestamoRepository prestamos,
    IUsuarioRepository usuarios,
    IEquipoRepository equipos,
    IUnitOfWork unitOfWork,
    TimeProvider clock,
    IValidator<CrearPrestamoRequestDto> crearValidator,
    IValidator<ConsultarPrestamosRequestDto> consultarValidator)
{
    public async Task<IEnumerable<PrestamoResponseDto>> GetAllAsync(ConsultarPrestamosRequestDto query)
    {
        await consultarValidator.ValidateAndThrowAsync(query);
        return (await prestamos.GetAllAsync(query.UsuarioId, query.EquipoId, query.Estado)).Select(ToResponse);
    }

    public async Task<PrestamoResponseDto> GetByIdAsync(int id) => ToResponse(await ObtenerAsync(id));

    public async Task<PrestamoResponseDto> CreateAsync(CrearPrestamoRequestDto request)
    {
        await crearValidator.ValidateAndThrowAsync(request);
        return await unitOfWork.ExecuteAsync(async () =>
        {
            _ = await usuarios.GetByIdAsync(request.UsuarioId)
                ?? throw new RecursoNoEncontradoException("El usuario no existe.");
            var equipo = await equipos.GetByIdAsync(request.EquipoId)
                ?? throw new RecursoNoEncontradoException("El equipo no existe.");

            if (equipo.Estado != EstadosEquipo.Disponible || await prestamos.EquipoTieneActivoAsync(equipo.Id))
                throw new ConflictoException("El equipo no está disponible para préstamo.");
            if (await prestamos.ContarActivosAsync(request.UsuarioId) >= 4)
                throw new ConflictoException("El usuario ya tiene el máximo de cuatro préstamos activos.");

            equipo.Estado = EstadosEquipo.Prestado;
            await equipos.UpdateAsync(equipo);
            var prestamo = new Prestamo
            {
                UsuarioId = request.UsuarioId, EquipoId = equipo.Id,
                Estado = EstadosPrestamo.Activo, FechaPrestamo = clock.GetUtcNow().UtcDateTime
            };
            return ToResponse(await prestamos.AddAsync(prestamo));
        });
    }

    public async Task DevolverAsync(int id)
    {
        await unitOfWork.ExecuteAsync(async () =>
        {
            var prestamo = await ObtenerAsync(id);
            if (prestamo.Estado != EstadosPrestamo.Activo || prestamo.FechaDevolucion.HasValue)
                throw new ConflictoException("El préstamo ya fue devuelto.");
            var equipo = await equipos.GetByIdAsync(prestamo.EquipoId)
                ?? throw new RecursoNoEncontradoException("El equipo no existe.");

            prestamo.Estado = EstadosPrestamo.Devuelto;
            prestamo.FechaDevolucion = clock.GetUtcNow().UtcDateTime;
            equipo.Estado = EstadosEquipo.Disponible;
            await prestamos.UpdateAsync(prestamo);
            await equipos.UpdateAsync(equipo);
            return true;
        });
    }

    private async Task<Prestamo> ObtenerAsync(int id) =>
        await prestamos.GetByIdAsync(id) ?? throw new RecursoNoEncontradoException("El préstamo no existe.");

    private static PrestamoResponseDto ToResponse(Prestamo prestamo) => new()
    {
        Id = prestamo.Id, UsuarioId = prestamo.UsuarioId, EquipoId = prestamo.EquipoId,
        Estado = prestamo.Estado, FechaPrestamo = prestamo.FechaPrestamo,
        FechaLimite = prestamo.FechaPrestamo.AddMonths(2), FechaDevolucion = prestamo.FechaDevolucion
    };
}
