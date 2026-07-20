import { useEffect, useState } from "react";
import './index.css';

//Moldes de dados o formato exato que a pessoa e a transação deve ter

interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: 'RECEITA' | 'DESPESA';
  pessoaId: number;
}

export default function App(){
  // Estados da Tela 
  // o 'useState' ele guarda a informações temporariamente para conseguir 
  // mostrar no visual da tela

  // lista de dados vindas do banco
  const [pessoas , setPessoas] = useState<Pessoa[]>([]);
  const [transacoes,setTransacoes] = useState<Transacao[]>([]);

  // Controles de navegação da interface
  const [pessoaSelecionada,setPessoaSelecionada] = useState<Pessoa | null>(null);
  const [buscandoDados, setBuscandoDados] = useState(true);

  // Caixas de texto dos formularios (onde o usuario digita as coisas)
  const [nomePessoa, setNomePessoa] = useState('');
  const [idadePessoa, setIdadePessoa] = useState('');
  const [descTransacao, setDescTransacao] = useState('');
  const [valorTransacao, setValorTransacao] = useState('');
  const [tipoTransacao, setTipoTransacao] = useState<'RECEITA' | 'DESPESA'>('DESPESA');

  //Comunicação com o servidor (API)
  // essas funções vão ate o servidor que e o meu codigo C# e pegam os dados e trazem para a nossa tela

  //Função que roda automaticamente assim que a tela abre
  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    try {
      // busca as pessoas cadastradas
      const resPessoas = await fetch('http://localhost:5014/api/pessoa');
      if(resPessoas.ok){
        const dadosPessoas = await resPessoas.json();
        setPessoas(dadosPessoas);
        if(dadosPessoas.length > 0) {
          setPessoaSelecionada(dadosPessoas[0]);
        }
      }

      //Busca o historico financeiro
      // so funciona se o codigo feito em C# tem a rota GET de transacao pronta
      
      const resTransacoes = await fetch('http://localhost:5014/api/transacao');
      if(resTransacoes.ok){
        const dadosTransacoes = await resTransacoes.json();
        setTransacoes(dadosTransacoes);
      }
    } catch (erro){
      console.error('Falha na comunicação com o servidor ');
    } finally {
      setBuscandoDados(false);
    }

    };

    // Ações dos botões (criar e deletar)

    // Função para cadastrar uma nova pessoa no banco
    const cadastrarPessoa = async () => {
      if (!nomePessoa || !idadePessoa) return alert('Preencha os dados da Pessoa');
      const novaPessoa = {Nome: nomePessoa, Idade: parseInt(idadePessoa)};

      try {
        const resposta = await fetch('http://localhost:5014/api/pessoa', {
          method : 'POST',
          headers : {'Content-Type': 'application/json'},
          body: JSON.stringify(novaPessoa)
        });

        if (resposta.ok) {
          // Limpa os campos de digitação e recarrega a lista
          setNomePessoa('');
          setIdadePessoa('');
          carregarDadosIniciais();
        }
      } catch (erro) {
        alert('Erro ao criar pessoa');
      }
    };

    //Função para excluir uma pessoa e seus gastos 
    const deletarPessoa = async (id: number) => {
      const confirmar = window.confirm('Deseja excluir esta pessoa e todas as suas transações ? ');
      if (!confirmar) return;

      try{
        const resposta = await fetch (`http://localhost:5014/api/pessoa/${id}`, {
          method: 'DELETE'
        });
        
        if(resposta.ok){
          alert('Pessoa removida com sucesso!');
          carregarDadosIniciais();
        }
      }catch (erro) {
          alert('Erro ao deletar pessoa');
        }
      };

      // Função para registar um gasto ou receita
      const cadastrarTransacao = async () => {
        if (!pessoaSelecionada) return;
        if (!descTransacao || !valorTransacao) return alert('Preencha os detalhes do valor');

        // impede que menores de idade registrem rendimentos 

        if (pessoaSelecionada.idade < 18 && tipoTransacao === 'RECEITA') {
          alert('Atenção : Menores de idade só podem registar despesas');
          return;
        }

        const novaTransacao = {
          descricao: descTransacao,
          valor: parseFloat(valorTransacao),
          tipo: tipoTransacao,
          PessoaId: pessoaSelecionada.id
        };

        try {
          const resposta = await fetch('http://localhost:5014/api/transacao',{
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(novaTransacao)
          });

          if (resposta.ok) {
            setDescTransacao('');
            setValorTransacao('');
            carregarDadosIniciais();
          } else {
            // O truque está aqui: se o banco recusar, ele avisa o motivo na tela!
          const erroServidor = await resposta.text();
          alert(`O servidor recusou: ${erroServidor}`);
          }

        } catch (erro) {
          alert('Erro ao salvar movimentação');
        }
      };

      // Tela de proteção visual com avisos

      if (buscandoDados) {
        return <div style={{ padding : '40px', textAlign: 'center'}}>Conectando ao banco de dados.....</div>;

      }

      // Filta apenas o historico da pessoa que esta clicada no menu

      const transacoesDaPessoa = pessoaSelecionada
         ? transacoes.filter(t => t.pessoaId === pessoaSelecionada.id)
         :[];
      
      const totalReceitas = transacoesDaPessoa.filter(t => t.tipo === 'RECEITA').reduce((acc,curr) => acc + curr.valor,0);
      const totalDespesas = transacoesDaPessoa.filter(t => t.tipo === "DESPESA").reduce((acc, curr) => acc + curr.valor,0);
      const saldo = totalReceitas - totalDespesas;
      // Essas são as Telas que o Usuario vai ver 


      return (
<div className="app-container" style={{ display: 'flex', height: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      
      {/* BARRA LATERAL - LISTA DE PESSOAS */}
      <aside className="sidebar" style={{ width: '300px', backgroundColor: '#FFF', borderRight: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Formulário de Nova Pessoa */}
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#F1F5F9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>NOVO MORADOR</h4>
          <input 
            placeholder="Nome" 
            value={nomePessoa} 
            onChange={e => setNomePessoa(e.target.value)}
            style={{ width: '100%', marginBottom: '8px', padding: '8px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
          />
          <input 
            placeholder="Idade" 
            type="number"
            value={idadePessoa} 
            onChange={e => setIdadePessoa(e.target.value)}
            style={{ width: '100%', marginBottom: '8px', padding: '8px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
          />
          <button onClick={cadastrarPessoa} style={{ width: '100%', padding: '8px', backgroundColor: '#3B82F6', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Adicionar Pessoa
          </button>
        </div>

        <h3 style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>PESSOAS CADASTRADAS</h3>
        
        {/* Listagem rolável de pessoas */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {pessoas.length === 0 ? <p style={{ fontSize: '12px', color: '#94A3B8' }}>Nenhuma pessoa cadastrada.</p> : null}
          {pessoas.map(pessoa => (
            <div 
              key={pessoa.id} 
              onClick={() => setPessoaSelecionada(pessoa)}
              style={{ 
                padding: '12px', 
                marginBottom: '8px',
                border: '1px solid #E2E8F0', 
                cursor: 'pointer',
                backgroundColor: pessoaSelecionada?.id === pessoa.id ? '#EFF6FF' : 'transparent',
                borderColor: pessoaSelecionada?.id === pessoa.id ? '#3B82F6' : '#E2E8F0',
                borderRadius: '8px'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{pessoa.nome}</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>{pessoa.idade} anos</div>
            </div>
          ))}
        </div>
      </aside>

      {/* ÁREA PRINCIPAL - DETALHES DA PESSOA */}
      <main className="main-content" style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        
        {!pessoaSelecionada ? (
          <div style={{ color: '#64748B', textAlign: 'center', marginTop: '100px' }}>
            Selecione ou cadastre uma pessoa para ver os detalhes.
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ margin: '0 0 8px 0' }}>{pessoaSelecionada.nome}</h2>
                <p style={{ color: '#64748B', margin: 0 }}>Resumo individual de receitas, despesas e saldo</p>
              </div>
              <button 
                onClick={() => deletarPessoa(pessoaSelecionada.id)}
                style={{ backgroundColor: '#FEE2E2', color: '#EF4444', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Excluir Pessoa
              </button>
            </div>
            
            {/* Cards de Resumo Financeiro */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
              <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '12px', flex: 1, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 'bold' }}>TOTAL RECEITAS</div>
                <div style={{ fontSize: '24px', color: '#10B981', fontWeight: 'bold' }}>R$ {totalReceitas.toFixed(2)}</div>
              </div>
              <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '12px', flex: 1, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 'bold' }}>TOTAL DESPESAS</div>
                <div style={{ fontSize: '24px', color: '#EF4444', fontWeight: 'bold' }}>R$ {totalDespesas.toFixed(2)}</div>
              </div>
              <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '12px', flex: 1, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 'bold' }}>SALDO LÍQUIDO</div>
                <div style={{ fontSize: '24px', color: saldo >= 0 ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>R$ {saldo.toFixed(2)}</div>
              </div>
            </div>

            {/* Cabeçalho da Lista de Transações */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0 }}>TRANSAÇÕES</h3>
                {pessoaSelecionada.idade < 18 && (
                  <span style={{ backgroundColor: '#FEF2F2', color: '#EF4444', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginTop: '8px' }}>
                    Aviso: Menores de dezoito anos só podem registrar despesas
                  </span>
                )}
              </div>
            </div>

            {/* Formulário de Nova Transação */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', backgroundColor: '#FFF', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <input 
                placeholder="Ex: Conta de Luz" 
                value={descTransacao}
                onChange={e => setDescTransacao(e.target.value)}
                style={{ flex: 2, padding: '8px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
              />
              <input 
                placeholder="Valor (Ex: 150.50)" 
                type="number"
                value={valorTransacao}
                onChange={e => setValorTransacao(e.target.value)}
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
              />
              <select 
                value={tipoTransacao} 
                onChange={e => setTipoTransacao(e.target.value as 'RECEITA' | 'DESPESA')}
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
              >
                <option value="DESPESA">Saída (Despesa)</option>
                <option value="RECEITA">Entrada (Receita)</option>
              </select>
              <button 
                onClick={cadastrarTransacao}
                style={{ padding: '8px 16px', backgroundColor: '#10B981', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Lançar
              </button>
            </div>

            {/* Tabela de Histórico */}
            <div style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
              {transacoesDaPessoa.length === 0 ? (
                <p style={{ color: '#94A3B8', textAlign: 'center', margin: 0 }}>Nenhuma movimentação registrada.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B' }}>
                      <th style={{ paddingBottom: '12px' }}>DESCRIÇÃO</th>
                      <th style={{ paddingBottom: '12px' }}>TIPO</th>
                      <th style={{ paddingBottom: '12px' }}>VALOR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transacoesDaPessoa.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '16px 0' }}>{t.descricao}</td>
                        <td style={{ padding: '16px 0' }}>{t.tipo}</td>
                        <td style={{ padding: '16px 0', color: t.tipo === 'RECEITA' ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>
                          R$ {t.valor.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
      );
    }

  
