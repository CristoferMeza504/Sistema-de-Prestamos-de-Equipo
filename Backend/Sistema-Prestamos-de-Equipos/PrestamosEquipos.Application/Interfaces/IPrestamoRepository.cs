using PrestamosEquipos.Domain.Entities;

namespace PrestamosEquipos.Application.Interfaces;

public interface IPrestamoRepository
{
    Task<IEnumerable<Prestamo>> GetAllAsync(int? usuarioId, int? equipoId, string? estado);
    Task<Prestamo?> GetByIdAsync(int id);
    Task<int> ContarActivosAsync(int usuarioId);
    Task<bool> EquipoTieneActivoAsync(int equipoId);
    Task<bool> EquipoTieneHistorialAsync(int equipoId);
    Task<bool> UsuarioTieneHistorialAsync(int usuarioId);
    Task<Prestamo> AddAsync(Prestamo prestamo);
    Task UpdateAsync(Prestamo prestamo);
}
