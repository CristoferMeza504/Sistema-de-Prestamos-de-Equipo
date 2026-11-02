using FluentValidation;
using PrestamosEquipos.Application.Features.Usuarios.DTOs;

namespace PrestamosEquipos.Application.Features.Usuarios.Validators;

public class ActualizarUsuarioValidator : AbstractValidator<ActualizarUsuarioRequestDto>
{
    public ActualizarUsuarioValidator()
    {
        RuleFor(x => x.Nombre).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Correo).NotEmpty().MaximumLength(150).EmailAddress();
    }
}
