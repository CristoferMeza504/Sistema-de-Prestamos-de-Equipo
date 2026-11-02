using System.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using PrestamosEquipos.Application.Common;
using PrestamosEquipos.Application.Interfaces;

namespace PrestamosEquipos.Infrastructure.Data;

public class UnitOfWork(AppDbContext context) : IUnitOfWork
{
    public async Task<T> ExecuteAsync<T>(Func<Task<T>> operation)
    {
        // La comprobación de reglas y sus escrituras comparten una transacción.
        // Serializable evita superar el cupo o prestar el mismo equipo por concurrencia.
        for (var intento = 0; ; intento++)
        {
            await using var transaction = await context.Database.BeginTransactionAsync(IsolationLevel.Serializable);
            try
            {
                var result = await operation();
                await transaction.CommitAsync();
                return result;
            }
            catch (Exception exception) when (ObtenerPostgresException(exception) is { } postgres)
            {
                await transaction.RollbackAsync();
                context.ChangeTracker.Clear();

                if (postgres.SqlState is PostgresErrorCodes.SerializationFailure or PostgresErrorCodes.DeadlockDetected)
                {
                    if (intento < 3)
                    {
                        await Task.Delay(25 * (intento + 1));
                        continue;
                    }
                    throw new ConflictoException("Otra operación modificó los datos al mismo tiempo. Vuelva a intentarlo.");
                }
                if (postgres.SqlState == PostgresErrorCodes.UniqueViolation)
                    throw new ConflictoException("Ya existe un registro con esos datos únicos.");
                if (postgres.SqlState == PostgresErrorCodes.ForeignKeyViolation)
                    throw new ConflictoException("La operación entra en conflicto con registros relacionados.");

                throw;
            }
        }
    }

    private static PostgresException? ObtenerPostgresException(Exception exception)
    {
        // EF Core puede envolver el error del proveedor en más de una excepción.
        for (Exception? current = exception; current is not null; current = current.InnerException)
        {
            if (current is PostgresException postgres) return postgres;
        }
        return null;
    }
}
