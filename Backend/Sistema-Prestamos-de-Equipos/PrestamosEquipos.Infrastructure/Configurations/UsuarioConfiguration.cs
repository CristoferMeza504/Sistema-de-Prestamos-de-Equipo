using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrestamosEquipos.Domain.Entities;

namespace PrestamosEquipos.Infrastructure.Configurations
{
    public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {
            builder.ToTable("Usuarios");

            builder.HasKey(u => u.Id);

            builder.Property(u => u.Nombre)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(u => u.Correo)
                .IsRequired()
                .HasMaxLength(150);

            builder.HasIndex(u => u.Correo)
                .IsUnique();

            //navegacion de usuarios a prestamos
            builder.HasMany(u => u.Prestamos)
                .WithOne(p => p.Usuario)
                .HasForeignKey(p => p.UsuarioId);
        }
    }
}
