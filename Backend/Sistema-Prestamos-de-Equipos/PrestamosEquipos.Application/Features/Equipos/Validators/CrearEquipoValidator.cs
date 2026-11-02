using FluentValidation;
using PrestamosEquipos.Application.Features.Equipos.DTOs;
using PrestamosEquipos.Domain.Constants;

namespace PrestamosEquipos.Application.Features.Equipos.Validators;

public class CrearEquipoValidator : AbstractValidator<CrearEquipoRequestDto>
{
    public CrearEquipoValidator()
    {
        RuleFor(x => x.Nombre).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Tipo).NotEmpty().MaximumLength(250);
        RuleFor(x => x.Estado).NotEmpty()
            .Must(estado => estado is EstadosEquipo.Disponible or EstadosEquipo.Mantenimiento)
            .WithMessage("Un equipo nuevo debe estar Disponible o en Mantenimiento.");
    }
}
