import { useState, useEffect } from "react";
import './index.css';

interface Pessoa {
  id : number;
  nome : string;
  idade : number;
}
 interface Transacao{
  id: number;
  descricao: string;
  valor: number;
  tipo: 'RECEITA' | 'DESPESA';
  pessoaId: number;
 }
// interface de Transação igual

export default function App(){
  // estado agora começa vazio esperando os dados reais do banco
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [pessoaSelecionada, setPessoaSelecionada] = useState<Pessoa | null>(null);
 
  // teste de transações so para a tela não ficar vazia por enquanto

  const [transacoes, setTransacoes] = useState<Transacao[]>([
    { id: 400118, descricao: 'Salário mensal', valor: 4200.00, tipo: 'RECEITA', pessoaId: 1 },
    { id: 400115, descricao: 'Supermercado', valor: 640.00, tipo: 'DESPESA', pessoaId: 1 },
  ]);



  /* o estado de transacoes mantido por igual por enquanto
   useEffect roda apenas uma vez quando a tela carrega
  o bloco try/catch impede que erros de rede quebrem a interface
  */

  useEffect(() => {
    const buscarPesssoas = async () => {
      try {
        // troque a porta pela porta que o seu .NET está rodando
        const resposta = await fetch('http://localhost:5014/api/pessoa');

        if(!resposta.ok){
          throw new Error('Acesso negado rota indisponivel');
        }

        const dadosDaApi = await resposta.json();
        setPessoas(dadosDaApi);

        // seleciona a primeira pessoa da lista automaticamente se existir
        if (dadosDaApi.length> 0){
          setPessoaSelecionada(dadosDaApi[0]);
        }
      } catch (erro){
        // fallha para tratar silenciosamente não expor vunerabilidades
        console.error('conexao interrompida , falha na api');
      }
      
    };

    buscarPesssoas();
  }, []);

  // blindagem visual mostrando uma tela de carregamento se a api ainda não respondeu
  // Se a API conectou, mas a lista veio vazia
  if (pessoas.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontSize: '18px' }}>
        <strong>Banco de dados conectado, mas está vazio!</strong> <br/><br/>
        Acesse o Swagger e cadastre a primeira pessoa.
      </div>
    );
  }

  // Se a API ainda não respondeu
  if (!pessoaSelecionada) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando dados...</div>;
  }
  //if(!pessoaSelecionada){
    //return <div style ={{padding : '40px', textAlign: 'center'}} >Carregando dados</div>;
  //}
  const transacoesDaPessoa = transacoes.filter(t => t.pessoaId === pessoaSelecionada.id);
  const totalReceitas = transacoesDaPessoa.filter(t => t.tipo === 'RECEITA').reduce((acc,curr) => acc + curr.valor,0);
  const totalDespesas = transacoesDaPessoa.filter(t => t.tipo === 'DESPESA').reduce((acc,curr) => acc + curr.valor,0);
  const saldo = totalReceitas - totalDespesas;

  return (
  
    <div className="app-container" style={{ display: 'flex', height: '100vh', backgroundColor: '#F8FAFC' }}>
      
      {/* BARRA LATERAL */}
      <aside className="sidebar" style={{ width: '300px', backgroundColor: '#FFF', borderRight: '1px solid #E2E8F0', padding: '24px' }}>
        <h3 style={{ fontSize: '14px', color: '#64748B', marginBottom: '20px' }}>PESSOAS CADASTRADAS</h3>
        {pessoas.map(pessoa => (
          <div 
            key={pessoa.id} 
            onClick={() => setPessoaSelecionada(pessoa)}
            style={{ 
              padding: '12px', 
              borderBottom: '1px solid #E2E8F0', 
              cursor: 'pointer',
              backgroundColor: pessoa.id === pessoaSelecionada.id ? '#EFF6FF' : 'transparent',
              borderRadius: '8px'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{pessoa.nome}</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>{pessoa.idade} anos</div>
          </div>
        ))}
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="main-content" style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        
        <h2 style={{ marginBottom: '8px' }}>{pessoaSelecionada.nome}</h2>
        <p style={{ color: '#64748B', marginBottom: '24px' }}>Resumo individual de receitas, despesas e saldo</p>
        
        <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '12px', flex: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 'bold' }}>TOTAL RECEITAS</div>
            <div style={{ fontSize: '24px', color: '#10B981', fontWeight: 'bold' }}>R$ {totalReceitas.toFixed(2)}</div>
          </div>
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '12px', flex: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 'bold' }}>TOTAL DESPESAS</div>
            <div style={{ fontSize: '24px', color: '#EF4444', fontWeight: 'bold' }}>R$ {totalDespesas.toFixed(2)}</div>
          </div>
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '12px', flex: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 'bold' }}>SALDO LÍQUIDO</div>
            <div style={{ fontSize: '24px', color: saldo >= 0 ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>R$ {saldo.toFixed(2)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3>TRANSAÇÕES</h3>
            {pessoaSelecionada.idade < 18 && (
              <span style={{ backgroundColor: '#FEF2F2', color: '#EF4444', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                Regra de Negócio: Apenas despesa permitida
              </span>
            )}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
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
        </div>

      </main>
    </div>
  );

}
