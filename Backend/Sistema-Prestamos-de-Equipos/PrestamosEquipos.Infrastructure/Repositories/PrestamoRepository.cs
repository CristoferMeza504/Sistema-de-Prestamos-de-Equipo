using Microsoft.EntityFrameworkCore;
using PrestamosEquipos.Application.Interfaces;
using PrestamosEquipos.Domain.Constants;
using PrestamosEquipos.Domain.Entities;
using PrestamosEquipos.Infrastructure.Data;

namespace PrestamosEquipos.Infrastructure.Repositories;

public class PrestamoRepository(AppDbContext context) : IPrestamoRepository
{
    public async Task<IEnumerable<Prestamo>> GetAllAsync(int? usuarioId, int? equipoId, string? estado)
    {
        var query = context.Prestamos.AsNoTracking();
        if (usuarioId.HasValue) query = query.Where(p => p.UsuarioId == usuarioId.Value);
        if (equipoId.HasValue) query = query.Where(p => p.EquipoId == equipoId.Value);
        if (estado is not null) query = query.Where(p => p.Estado == estado);
        return await query.OrderByDescending(p => p.FechaPrestamo).ThenByDescending(p => p.Id).ToListAsync();
    }

    public async Task<Prestamo?> GetByIdAsync(int id) => await context.Prestamos.FindAsync(id);

    public Task<int> ContarActivosAsync(int usuarioId) =>
        context.Prestamos.CountAsync(p => p.UsuarioId == usuarioId && p.Estado == EstadosPrestamo.Activo);

    public Task<bool> EquipoTieneActivoAsync(int equipoId) =>
        context.Prestamos.AnyAsync(p => p.EquipoId == equipoId && p.Estado == EstadosPrestamo.Activo);

    public Task<bool> EquipoTieneHistorialAsync(int equipoId) =>
        context.Prestamos.AnyAsync(p => p.EquipoId == equipoId);

    public Task<bool> UsuarioTieneHistorialAsync(int usuarioId) =>
        context.Prestamos.AnyAsync(p => p.UsuarioId == usuarioId);

    public async Task<Prestamo> AddAsync(Prestamo prestamo)
    {
        await context.Prestamos.AddAsync(prestamo);
        await context.SaveChangesAsync();
        return prestamo;
    }

    public async Task UpdateAsync(Prestamo prestamo)
    {
        context.Prestamos.Update(prestamo);
        await context.SaveChangesAsync();
    }
}
