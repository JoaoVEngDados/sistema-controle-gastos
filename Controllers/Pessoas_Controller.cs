using Microsoft.AspNetCore.Mvc;
using Controle_de_gastos.Data;
using Controle_de_gastos.Models;
using Microsoft.EntityFrameworkCore;

namespace Controle_de_gastos.Controllers
{
    // Estrutura leve para receber os dados limpos do formulario do front-end
    public record ViewDataPessoa(string Nome, int Idade);

    [ApiController]
    [Route("api/[controller]")]
    public class PessoaController : ControllerBase
    {

        private readonly AppdbContext _context;

       // injeção do banco de dados
        public PessoaController( AppdbContext context) => _context = context;
        
        // A NOVA ROTA ENTRA AQUI: Rota para enviar a lista de pessoas para o React
        [HttpGet]
        public async Task<IActionResult> ListarPessoas()
        {
            var pessoas = await _context.Pessoas.ToListAsync();
            return Ok(pessoas);
        }

        // Rota para criar um novo usuário no sistema
        [HttpPost]
        public async Task<IActionResult> CriarPessoa([FromBody] ViewDataPessoa dados)
        {
            try
            {
                // Criação encapsulada : se p nome for vazio ou a idade negativa vai dar erro no construtor
                var novaPessoa = new Pessoa(dados.Nome, dados.Idade);
                _context.Pessoas.Add(novaPessoa);
                await _context.SaveChangesAsync();

                return Ok(novaPessoa);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        // Esta parte e para deletar uma pessoa
        // por conta dessa deleção em cascata todas as transações dessa pessoa sumiram do banco automaticamente
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarPessoa(long id)
        {
            // Busca a pessoa no banco pelo ID informado na URL 
            var pessoa = await _context.Pessoas.FindAsync(id);

            // se não achar a pessoa avisa o Front-end o erro 404
            if (pessoa == null) return NotFound("Pessoa não localizada para deleção ");

            // remove a pessoa o banco de dados EF core cuida de apagar as transações ligadas a ela
            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();

            return Ok("Pessoa e histórico de transações deletados com sucesso");
        }
    } 
}