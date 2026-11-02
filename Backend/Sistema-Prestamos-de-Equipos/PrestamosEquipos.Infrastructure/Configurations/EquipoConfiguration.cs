using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrestamosEquipos.Domain.Entities;

namespace PrestamosEquipos.Infrastructure.Configurations
{
    public class EquipoConfiguration : IEntityTypeConfiguration<Equipo>
    {
        public void Configure(EntityTypeBuilder<Equipo> builder)
        {
            builder.ToTable("Equipos");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(e => e.Tipo)
                .HasMaxLength(250);

            builder.Property(e => e.Estado)
                .IsRequired()
                .HasMaxLength(50);

            builder.HasMany(e => e.Prestamos)
                .WithOne(p => p.Equipo)
                .HasForeignKey(p => p.EquipoId);

        }
    }
}
