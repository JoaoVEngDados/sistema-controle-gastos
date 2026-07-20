using Microsoft.AspNetCore.Mvc;
using Controle_de_gastos.Data;
using Controle_de_gastos.Models;
using Microsoft.EntityFrameworkCore;

namespace Controle_de_gastos.Controllers
{
    // View_data que simplifica os dados que vem da requisição web front-end
    public class ViewDataTransacao
    {
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public string Tipo { get; set; } = string.Empty; // Corrigido para string
        public long PessoaId { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class TransacaoController : ControllerBase
    {
        private readonly AppdbContext _context;

        //Injeção de dependencia do banco de dados (SQLite)
        public TransacaoController(AppdbContext context) => _context = context;

        // Rota para listar o histórico (Exigência do projeto)
        [HttpGet]
        public async Task<IActionResult> ListarTransacoes()
        {
            var transacoes = await _context.Transacao.ToListAsync();
            return Ok(transacoes);
        }

        // Rota responsavel por cadastrar uma nova transação financeira
        [HttpPost]
        public async Task<IActionResult> CadastrarTransacao([FromBody] ViewDataTransacao dados)
        {
            try
            {
                // verifica se a pessoa informada realmente existe no banco de dados
                var pessoa = await _context.Pessoas.FindAsync(dados.PessoaId);

                // retorna erro 404 caso o usuario tente vincular a uma pessoa que não existe
                if (pessoa == null) return NotFound("Pessoa não encontrada");

                // a regra (menor de 18 anos = apenas despesa) está protegida dentro do modelo transacao
                
                   // Cria a transação usando o tipo já traduzido
                  // Converte o texto da tela e cria a transação pelo construtor
                var tipoConvertido = Enum.Parse<TipoTransacao>(dados.Tipo, true);
                var novaTransacao = new Transacao(dados.Descricao, dados.Valor, tipoConvertido, pessoa);

                // Corrigido para o plural e adicionado o comando de salvar no banco
                _context.Transacao.Add(novaTransacao);
                await _context.SaveChangesAsync(); 

                return Ok(novaTransacao);
            }
            catch (Exception ex)
            {
                // devolve para a tela do usuario a mensagem de erro da regra de negocio
                return BadRequest(ex.Message);
            }
        }
    }
}