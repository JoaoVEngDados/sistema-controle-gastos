# Sistema de Controle de Gastos Residenciais

**Aplicação  para gestão financeira doméstica, com cadastro de pessoas, transações e consulta de totais**

Sistema desenvolvido  seguindo o padrão arquitetural **MVC**, com persistência de dados em nuvem (Cloud SQL), garantindo que as informações permaneçam salvas mesmo após o fechamento da aplicação.

---

## Objetivo central

O objetivo do sistema é permitir que uma residência controle suas finanças de forma organizada, associando cada transação financeira (receita ou despesa) a uma pessoa específica do grupo familiar. A partir disso, o sistema calcula automaticamente o saldo individual de cada pessoa e o saldo consolidado da residência como um todo, dando visibilidade completa sobre para onde o dinheiro está indo e quem está gerando receita ou despesa.

O sistema cobre três frentes principais:

- **Cadastro de pessoas** — criação, listagem e deleção, com deleção em cascata: ao remover uma pessoa, todas as suas transações associadas são apagadas automaticamente.
- **Cadastro de transações** — criação e listagem de receitas e despesas vinculadas a uma pessoa já cadastrada, com uma regra de negócio central: **pessoas menores de 18 anos só podem registrar transações do tipo despesa**, nunca receita.
- **Consulta de totais** — uma tela consolidada que lista todas as pessoas com seu total de receitas, despesas e saldo individual (receita − despesa), e ao final exibe o total geral da residência: soma de todas as receitas, todas as despesas e o saldo líquido consolidado.



---

## Diagramas e planejamento do projeto

### 1. Modelo Conceitual de Entidades
![Modelo Conceitual de Entidades](./assets/01-modelo-conceitual-entidades.png)

Mapa conceitual das entidades centrais do sistema. **Pessoa** possui identificador único e automático, nome e idade, e se relaciona com **Transação** por meio de uma cardinalidade 1 para 0..* — uma pessoa realiza zero ou várias transações. Cada **Transação** possui identificador único, descrição, valor, tipo (despesa/receita) e o identificador da pessoa responsável. O diagrama já registra as duas regras de negócio centrais do sistema: se a idade da pessoa for menor que 18 anos, apenas despesas são permitidas; e ao deletar uma pessoa, todas as suas transações devem ser apagadas em cascata. Na parte inferior, o bloco "Consulta de Totais" formaliza a funcionalidade de listar todas as pessoas e exibir o total de receitas, despesas e saldo de cada uma, além do total geral consolidado.

### 2. Arquitetura MVC — .NET C# / Nuvem
![Arquitetura MVC .NET C#](./assets/02-arquitetura-mvc-net.png)

Detalha a arquitetura técnica em camadas do sistema. Na camada **Física**, a infraestrutura de nuvem utiliza um banco de dados SQL via Cloud SQL para persistência dos dados. A **Camada de Modelo** define as classes `Pessoa` (Id, Nome, Idade) e `Transação` (Id, Descrição, Valor, Tipo, PessoaId), com a validação de negócio que impede transações de receita para menores de 18 anos. A **Camada de Controle** contém o `PessoaController` (criação e deleção de pessoa) e o `TransaçãoController` (cadastro de transação, aplicando a validação de idade). O **Pacote de Repositórios** implementa `CloudSqlPessoaRepository` e `CloudSqlTransaçãoRepository`, responsáveis pela lógica de deleção em cascata e pela validação de dados em cascata, respectivamente. Por fim, a **Camada de Visão** expõe a tela de consulta de totais, atendendo ao requisito de exibição de totais gerais e individuais.

### 3. Fluxo de Processos (BPMN)
![Fluxo de Processos BPMN](./assets/03-fluxo-processos-bpmn.png)

Representa o fluxo ponta a ponta das interações entre o **Usuário** e o **Sistema de Controle**, organizado em três raias funcionais. Em **Gestão de Pessoas**, o usuário inicia o cadastro, visualiza a listagem ou solicita a deleção de uma pessoa — esta última aciona o processo de deleção em cascata das transações associadas. Em **Gestão de Transações**, ao iniciar um cadastro o sistema verifica a idade da pessoa: se maior ou igual a 18 anos, permite despesa ou receita; se menor de 18, permite apenas despesa. Em **Análise Financeira**, o usuário solicita a consulta de totais, o sistema processa os dados (respeitando a mesma regra de idade) e gera o resumo geral e individual, exibindo o resultado final ao usuário.

### 4. Cronograma de Desenvolvimento (5 dias)
![Cronograma de Desenvolvimento](./assets/04-cronograma-desenvolvimento.png)

Planejamento de execução do projeto distribuído em 5 dias de trabalho. O **Dia 1** cobre a criação do projeto .NET API, definição das entidades Pessoa/Transação, repositórios iniciais, configuração do EF Core & Migration e persistência básica local. O **Dia 2** implementa os controllers da API, a validação da regra de idade, e dá início ao front-end em React/TS com seus componentes e views base. O **Dia 3** foca nas funcionalidades de front-end: cadastro e listagem de pessoas e transações, incluindo a deleção com cascata. O **Dia 4** implementa a lógica de consulta de totais no back-end e no front-end, o resumo geral e individual, e a migração do banco de dados para a nuvem (Cloud SQL). O **Dia 5** é dedicado à integração final entre front e back, testes das regras de negócio (idade, cascata), testes de persistência em nuvem, revisão, documentação do código e ajustes finais de UI/UX.

---

## Stack tecnológica

| Camada | Tecnologias |
|---|---|
| Back-end | .NET / C#, padrão MVC |
| Front-end | React com TypeScript |
| Persistência | Banco de dados SQL em nuvem (Cloud SQL) |
| ORM / Migrations | Entity Framework Core |
| Arquitetura | MVC (Model-View-Controller) com camada de repositórios |

## Regras de negócio implementadas

- Identificadores de **Pessoa** e **Transação** são únicos e gerados automaticamente.
- Ao deletar uma pessoa, **todas as suas transações são apagadas em cascata**.
- Pessoas **menores de 18 anos só podem cadastrar transações do tipo despesa** — receitas são bloqueadas pela validação de negócio.
- A consulta de totais exibe, por pessoa, o total de receitas, despesas e saldo (receita − despesa), e ao final o **total geral consolidado** de todas as pessoas.

---

## Protótipo do sistema finalizado

Abaixo, um protótipo conceitual da interface final do sistema, reunindo a listagem de pessoas cadastradas, o resumo individual de receitas/despesas/saldo, a tabela de transações com cadastro rápido, e o resumo geral consolidado de todas as pessoas.

![Protótipo do Sistema de Controle de Gastos](./assets/05-prototipo-sistema.svg)

> Protótipo conceitual com dados fictícios, ilustrando a interface final da aplicação React/TS integrada ao back-end .NET C#.

---

## Status do projeto

Desenvolvido  com um  cronograma de execução de 5 dias, cobrindo desde a modelagem de dados até a integração completa entre front-end, back-end e persistência em nuvem.


