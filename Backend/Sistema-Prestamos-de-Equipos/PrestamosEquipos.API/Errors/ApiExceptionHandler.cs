using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using PrestamosEquipos.Application.Common;

namespace PrestamosEquipos.API.Errors;

public class ApiExceptionHandler(ILogger<ApiExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        ProblemDetails problem;
        switch (exception)
        {
            case ValidationException validation:
                var errors = validation.Errors.GroupBy(e => e.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).Distinct().ToArray());
                if (errors.Count == 0) errors["Solicitud"] = [validation.Message];
                problem = new ValidationProblemDetails(errors)
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Los datos de la solicitud no son válidos."
                };
                break;
            case RecursoNoEncontradoException:
                problem = new ProblemDetails { Status = 404, Title = "Recurso no encontrado", Detail = exception.Message };
                break;
            case ConflictoException:
                problem = new ProblemDetails { Status = 409, Title = "Conflicto con el estado actual", Detail = exception.Message };
                break;
            default:
                logger.LogError(exception, "Error inesperado al procesar {Path}", context.Request.Path);
                problem = new ProblemDetails { Status = 500, Title = "Ocurrió un error interno al procesar la solicitud." };
                break;
        }

        problem.Instance = context.Request.Path;
        context.Response.StatusCode = problem.Status!.Value;
        await context.Response.WriteAsJsonAsync((object)problem, options: null, contentType: "application/problem+json; charset=utf-8", cancellationToken: cancellationToken);
        return true;
    }
}
