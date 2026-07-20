using Microsoft.AspNetCore.Mvc;
using Controle_de_gastos.Data;
using Controle_de_gastos.Models;

namespace Controle_de_gastos.Controllers
{
    // View_data que simplifica os dados que vem da requisição web front-end
    public record ViewDataTransacao(string Descricao, decimal Valor, TipoTransacao Tipo, long PessoaId);

    [ApiController]
    [Route("api/[controller]")]
    public class TransacaoController : ControllerBase
    {
        private readonly AppdbContext _context;

        //Injeção de dependencia do banco de dados (SQLite)
        public TransacaoController(AppdbContext context) => _context = context;

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
                // se quebrar a regra o construtor gera uma Exception e o codigo pula direto para o catch
                var novaTransacao = new Transacao(dados.Descricao, dados.Valor, dados.Tipo, pessoa);

                // salvando no banco se tudo estiver valido
                _context.Transacao.Add(novaTransacao);

                return Ok(novaTransacao);
            }
            catch (Exception ex){
            
                // devolve para a tela do usuario a mensagem de erro da regra de negocio
                return BadRequest(ex.Message);
            }
           
            
        }
    }
}

