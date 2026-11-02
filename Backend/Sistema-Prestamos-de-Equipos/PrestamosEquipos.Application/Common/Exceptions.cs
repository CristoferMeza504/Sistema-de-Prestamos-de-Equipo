namespace PrestamosEquipos.Application.Common;

public class RecursoNoEncontradoException(string mensaje) : Exception(mensaje);

public class ConflictoException(string mensaje) : Exception(mensaje);
