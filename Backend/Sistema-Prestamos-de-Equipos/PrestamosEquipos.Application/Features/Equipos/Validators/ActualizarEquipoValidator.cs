using FluentValidation;
using PrestamosEquipos.Application.Features.Equipos.DTOs;
using PrestamosEquipos.Domain.Constants;

namespace PrestamosEquipos.Application.Features.Equipos.Validators;

public class ActualizarEquipoValidator : AbstractValidator<ActualizarEquipoRequestDto>
{
    public ActualizarEquipoValidator()
    {
        RuleFor(x => x.Nombre).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Tipo).NotEmpty().MaximumLength(250);
        RuleFor(x => x.Estado).NotEmpty()
            .Must(estado => estado is EstadosEquipo.Disponible or EstadosEquipo.Prestado or EstadosEquipo.Mantenimiento)
            .WithMessage("El estado debe ser Disponible, Prestado o Mantenimiento.");
    }
}
