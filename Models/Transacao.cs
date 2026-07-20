namespace Controle_de_gastos.Models
{
    public enum TipoTransacao { Despesa, Receita }

    public class Transacao
    {
        public long Id { get; private set; }
        public string Descricao { get; private set; }
        public decimal Valor { get; private set; }
        public TipoTransacao Tipo { get; private set; }

        public long PessoaId { get; private set; }

        // O parâmetro 'tipo' agora recebe o Enum corretamente
        public Transacao(string descricao, decimal valor, TipoTransacao tipo, Pessoa pessoa)
        {
            if (string.IsNullOrWhiteSpace(descricao))
                throw new ArgumentException("A descrição da transferência é obrigatória");
            if (valor <= 0)
                throw new ArgumentException("O valor da transação deve ser positivo");
            if (pessoa == null)
                throw new ArgumentException("É obrigatório informar a qual pessoa esta transação pertence");

            // Validação direta com o Enum
            if (pessoa.Idade < 18 && tipo == TipoTransacao.Receita)
            {
                throw new ArgumentException("Pessoas menores de 18 anos só possuem permissão para registrar despesas");
            }
            
            Descricao = descricao;
            Valor = valor;
            Tipo = tipo;
            PessoaId = pessoa.Id;
        }

        protected Transacao()
        {
            Descricao = null!;
        }
    }
}