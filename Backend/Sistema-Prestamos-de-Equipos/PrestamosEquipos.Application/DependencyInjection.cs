using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using PrestamosEquipos.Application.Features.Equipos;
using PrestamosEquipos.Application.Features.Prestamos;
using PrestamosEquipos.Application.Features.Usuarios;

namespace PrestamosEquipos.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);
        services.AddScoped<EquipoService>();
        services.AddScoped<UsuarioService>();
        services.AddScoped<PrestamoService>();
        services.AddSingleton(TimeProvider.System);
        return services;
    }
}
