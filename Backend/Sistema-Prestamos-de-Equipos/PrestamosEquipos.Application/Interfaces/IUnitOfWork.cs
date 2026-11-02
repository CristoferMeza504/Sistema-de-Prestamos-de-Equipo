namespace PrestamosEquipos.Application.Interfaces;

public interface IUnitOfWork
{
    Task<T> ExecuteAsync<T>(Func<Task<T>> operation);
}
