using Microsoft.EntityFrameworkCore;
using Controle_de_gastos.Models;

namespace Controle_de_gastos.Data
{
    // Contexto central do Entity Framework Core
    // Gerencia a "tradução" entre o codigo e as tabelas fisicas no banco de dados
    public class AppdbContext : DbContext
    {
        public DbSet<Pessoa> Pessoas { get; set; }
        public DbSet<Transacao> Transacao { get; set; }

        public AppdbContext(DbContextOptions<AppdbContext> options) : base(options) { }

         // Metodo ultilizado para configurar regras avançadas de tabelas e relacionamentos
        protected override void OnModelCreating(ModelBuilder modelbulider)
        {
            // Deleção em cascata
            // garante que ao deletar uma pessoa , todas as transações dela sejam apagadas do banco
            // evita falhas de integridade
            modelbulider.Entity<Pessoa>()
            .HasMany(p => p.Transacoes)
            .WithOne()
            .HasForeignKey(t => t.PessoaId)
            .OnDelete(DeleteBehavior.Cascade);
        }
    }
}