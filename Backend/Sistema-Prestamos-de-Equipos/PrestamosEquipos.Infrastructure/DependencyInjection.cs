using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PrestamosEquipos.Application.Interfaces;
using PrestamosEquipos.Infrastructure.Data;
using PrestamosEquipos.Infrastructure.Repositories;

namespace PrestamosEquipos.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string connectionString)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IEquipoRepository, EquipoRepository>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IPrestamoRepository, PrestamoRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
