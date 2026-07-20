using Microsoft.AspNetCore.Mvc;
using Controle_de_gastos.Data;
using Microsoft.EntityFrameworkCore;
using Controle_de_gastos.Models;

namespace Controle_de_gastos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResumoController : ControllerBase
    {
        private readonly AppdbContext _context;

        public ResumoController(AppdbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> ObterTotais()
        {
            var pessoas = await _context.Pessoas.ToListAsync();
            var transacoes = await _context.Transacao.ToListAsync();

            // Calcula o resumo individual
            var resumoPessoas = pessoas.Select(p => {
                var transacoesPessoa = transacoes.Where(t => t.PessoaId == p.Id);
                
                var receitas = transacoesPessoa.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor);
                var despesas = transacoesPessoa.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor);
                
                return new 
                {
                    Nome = p.Nome,
                    Receitas = receitas,
                    Despesas = despesas,
                    Saldo = receitas - despesas
                };
            }).ToList();

            // Calcula o montante final da casa
            var totalReceitasGeral = resumoPessoas.Sum(r => r.Receitas);
            var totalDespesasGeral = resumoPessoas.Sum(r => r.Despesas);

            var resumoGeral = new 
            {
                Pessoas = resumoPessoas,
                TotalReceitas = totalReceitasGeral,
                TotalDespesas = totalDespesasGeral,
                SaldoGeral = totalReceitasGeral - totalDespesasGeral
            };

            return Ok(resumoGeral);
        }
    }
}