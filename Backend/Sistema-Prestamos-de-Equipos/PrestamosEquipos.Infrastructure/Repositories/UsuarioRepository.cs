using Microsoft.EntityFrameworkCore;
using PrestamosEquipos.Application.Interfaces;
using PrestamosEquipos.Domain.Entities;
using PrestamosEquipos.Infrastructure.Data;

namespace PrestamosEquipos.Infrastructure.Repositories;

public class UsuarioRepository(AppDbContext context) : IUsuarioRepository
{
    public async Task<IEnumerable<Usuario>> GetAllAsync() =>
        await context.Usuarios.AsNoTracking().OrderBy(u => u.Id).ToListAsync();

    public async Task<Usuario?> GetByIdAsync(int id) => await context.Usuarios.FindAsync(id);

    public Task<bool> ExisteCorreoAsync(string correo, int? excluirId = null) =>
        context.Usuarios.AnyAsync(u => u.Correo.ToLower() == correo && (!excluirId.HasValue || u.Id != excluirId.Value));

    public async Task<Usuario> AddAsync(Usuario usuario)
    {
        await context.Usuarios.AddAsync(usuario);
        await context.SaveChangesAsync();
        return usuario;
    }

    public async Task UpdateAsync(Usuario usuario)
    {
        context.Usuarios.Update(usuario);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Usuario usuario)
    {
        context.Usuarios.Remove(usuario);
        await context.SaveChangesAsync();
    }
}
