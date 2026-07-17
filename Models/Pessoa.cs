namespace Controle_de_gastos.Models
{

    // representa uma pessoa cadastrada no sistema

    public class Pessoa
    {
        // o indentificador exclusivo e gerado automaticamente pelo banco de dados.
        public long Id { get; private set; }
        public string Nome { get; private set; }
        public int Idade { get; private set; }

        // relacionamento EF core: uma pessoa pode ter uma lista de tranções vinculadas a ela
        public ICollection<Transacao> Transacoes { get; private set; } = new List<Transacao>();

        //construtor principal ultilizado para criar uma nova Pessoa
        // centraliza a validação de dados no exato momento da criação do objeto em memoria.

        public Pessoa(string nome, int idade)
        {
            if (string.IsNullOrWhiteSpace(nome))
                throw new ArgumentException("O Nome da Pessoa é Obrigatoria e não pode estar em branco.");
            if (idade < 0)
                throw new ArgumentException("A idade informada não pode ser negativa.");
            Nome = nome;
            Idade = idade;
        }

        // Construtor vazio exigido nativamente pelo Entity Framework para conseguir ler os dados do banco
        protected Pessoa()
        {
            Nome = null!;
        }
    }
}