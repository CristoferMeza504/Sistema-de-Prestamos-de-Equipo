using FluentValidation;
using PrestamosEquipos.Application.Features.Prestamos.DTOs;

namespace PrestamosEquipos.Application.Features.Prestamos.Validators;

public class CrearPrestamoValidator : AbstractValidator<CrearPrestamoRequestDto>
{
    public CrearPrestamoValidator()
    {
        RuleFor(x => x.UsuarioId).GreaterThan(0);
        RuleFor(x => x.EquipoId).GreaterThan(0);
    }
}
