using PrestamosEquipos.Domain.Entities;

namespace PrestamosEquipos.Application.Interfaces;

public interface IEquipoRepository
{
    Task<IEnumerable<Equipo>> GetAllAsync(string? estado = null);
    Task<Equipo?> GetByIdAsync(int id);
    Task<Equipo> AddAsync(Equipo equipo);
    Task UpdateAsync(Equipo equipo);
    Task DeleteAsync(Equipo equipo);
}
