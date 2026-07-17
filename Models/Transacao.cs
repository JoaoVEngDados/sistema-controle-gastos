namespace Controle_de_gastos.Models
{
    public enum TipoTransacao { Despesa, Receita }

   // Representa uma movimentação financeira (receita ou despesa) obprigatoriamente vinculada a uma pessoa
   
   public class Transacao
    {
        public long Id { get; private set; }
        public string Descricao { get; private set; }
        public decimal Valor { get; private set; }
        public TipoTransacao Tipo { get; private set; }

        // Chave estrangeira que aponta para o dono desta transação
        public long PessoaId { get; private set; }

        // Construtor que garante a integridade da transação e aplica as regras de negocio de idade antes de salvar.
        public Transacao(string descricao, decimal valor, TipoTransacao tipo, Pessoa pessoa)
        {
            if (string.IsNullOrWhiteSpace(descricao))
                throw new ArgumentException(" A descrição da transferencia é obrigatório ");
            if (valor <= 0)
                throw new ArgumentException("o valor da transação deve ser positivo");
            if (pessoa == null)
                throw new ArgumentException("é obrigatorio informar a qual pessoa esta transação pertence");

            // Regra de Negocio: caso a pessoa informada seja menor de idade apenas despesas poderão ser cadastradas
            if (pessoa.Idade < 18 && tipo == TipoTransacao.Receita)
            {
                throw new ArgumentException(" Pessoas menores de 18 anos só possuem permissão para registrar despesas ");

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