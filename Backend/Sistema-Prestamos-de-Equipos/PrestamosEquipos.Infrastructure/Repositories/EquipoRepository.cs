using Microsoft.EntityFrameworkCore;
using PrestamosEquipos.Application.Interfaces;
using PrestamosEquipos.Domain.Entities;
using PrestamosEquipos.Infrastructure.Data;

namespace PrestamosEquipos.Infrastructure.Repositories;

public class EquipoRepository : IEquipoRepository
{
    private readonly AppDbContext _context;

    public EquipoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Equipo>> GetAllAsync(string? estado = null)
    {
        var query = _context.Equipos.AsNoTracking();
        if (estado is not null) query = query.Where(e => e.Estado == estado);
        return await query.OrderBy(e => e.Id).ToListAsync();
    }

    public async Task<Equipo?> GetByIdAsync(int id) => await _context.Equipos.FindAsync(id);

    public async Task<Equipo> AddAsync(Equipo equipo)
    {
        await _context.Equipos.AddAsync(equipo);
        await _context.SaveChangesAsync();

        return equipo;
    }

    public async Task UpdateAsync(Equipo equipo)
    {
        _context.Equipos.Update(equipo);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Equipo equipo)
    {
        _context.Equipos.Remove(equipo);
        await _context.SaveChangesAsync();
    }
}
