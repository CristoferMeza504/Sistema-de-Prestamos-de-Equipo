using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrestamosEquipos.Domain.Entities;

namespace PrestamosEquipos.Infrastructure.Configurations
{
    public class PrestamoConfiguration : IEntityTypeConfiguration<Prestamo>
    {
        public void Configure(EntityTypeBuilder<Prestamo> builder)
        {
            builder.ToTable("Prestamos");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.FechaPrestamo)
                .IsRequired();

            builder.Property(p => p.FechaDevolucion)
                .IsRequired(false);

            builder.Property(p => p.Estado)
                .IsRequired()
                .HasMaxLength(50);

            builder.HasOne(p => p.Usuario)
                .WithMany(u => u.Prestamos)
                .HasForeignKey(p => p.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Equipo)
                .WithMany(e => e.Prestamos)
                .HasForeignKey(p => p.EquipoId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
