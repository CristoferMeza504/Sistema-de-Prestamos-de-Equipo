using FluentValidation;
using PrestamosEquipos.Application.Features.Prestamos.DTOs;
using PrestamosEquipos.Domain.Constants;

namespace PrestamosEquipos.Application.Features.Prestamos.Validators;

public class ConsultarPrestamosValidator : AbstractValidator<ConsultarPrestamosRequestDto>
{
    public ConsultarPrestamosValidator()
    {
        RuleFor(x => x.UsuarioId).GreaterThan(0).When(x => x.UsuarioId.HasValue);
        RuleFor(x => x.EquipoId).GreaterThan(0).When(x => x.EquipoId.HasValue);
        RuleFor(x => x.Estado)
            .Must(estado => estado is null or EstadosPrestamo.Activo or EstadosPrestamo.Devuelto)
            .WithMessage("El estado debe ser Activo o Devuelto.");
    }
}
