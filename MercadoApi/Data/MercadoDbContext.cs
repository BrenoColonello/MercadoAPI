using Microsoft.EntityFrameworkCore;
using MercadoApi.Models;

namespace MercadoApi.Data;

public class MercadoDbContext : DbContext
{
    public MercadoDbContext(DbContextOptions<MercadoDbContext> options)
        : base(options) { }

    public DbSet<Produto> Produtos => Set<Produto>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Produto>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.NomeProduto).IsRequired().HasMaxLength(200);
            e.Property(p => p.FotoProduto).HasMaxLength(5000);
            e.Property(p => p.DataEntrada).IsRequired();
            e.Property(p => p.DataValidade).IsRequired();
            e.Property(p => p.Quantidade).HasDefaultValue(1);
            e.Property(p => p.Ativo).HasDefaultValue(true);
            e.Property(p => p.CriadoEm).HasDefaultValueSql("datetime('now')");
        });
    }
}
