using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using PrestamosEquipos.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

var connectionString =
    Environment.GetEnvironmentVariable("ConnectionStrings__PostgresConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
