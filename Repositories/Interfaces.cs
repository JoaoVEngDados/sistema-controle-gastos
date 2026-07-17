using Controle_de_gastos.Models;

namespace Controle_de_gastos.Repositories
{
    // Interface que define o contrato de persistencia para a entidade Pessoa
    // isso facilita a criação de testes e a futura migração para bancos em nuvem

    public interface IPessoaRepository
    {
        Task<Pessoa> AddAsync(Pessoa pessoa);
        Task<IEnumerable<Pessoa>> GetAllAsync();

        // o metodo de deleção acionara automaticamente a exclusão em cascata das transações no banco
        Task DeleteAsync(long id);
    }
    // Interface para as operações de Tranações
    // a inexistência de métodos de edição/deleção aqui é proposital atendendo aos requisitos do sistema
    public interface ITransacaoRepository
    {
        Task<Transacao> AddAsync(Transacao transacao);
        Task<IEnumerable<Transacao>> GetAllAsync();
    }
}