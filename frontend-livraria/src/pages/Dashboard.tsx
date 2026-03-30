import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// ASSETS
import logoGif from '../assets/logo.gif';

export const Dashboard: React.FC = () => {
  const [estatisticas, setEstatisticas] = useState<any>({ totalLivros: 0, totalCategorias: 0 });
  const [novaCategoria, setNovaCategoria] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('@Projeto:token');
  const user = JSON.parse(localStorage.getItem('@Projeto:user') || '{}');

  const carregarEstatisticas = async () => {
    try {
      const [resLivros, resCats] = await Promise.all([
        api.get('/livros', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/categorias', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      // Ajuste para pegar o total correto baseado na estrutura da sua API
      setEstatisticas({
        totalLivros: resLivros.data.total || resLivros.data.length,
        totalCategorias: resCats.data.length
      });
    } catch (error) { 
      console.error("Erro no Dashboard:", error); 
    }
  };

  useEffect(() => {
    if (user.role !== 'ADMIN') {
      toast.error("Acesso restrito aos Mestres.");
      navigate('/home');
    } else {
      carregarEstatisticas();
    }
  }, [token, navigate, user.role]);

  const handleAddCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaCategoria) return;
    try {
      await api.post('/categorias', { nome: novaCategoria }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      toast.success("Nova prateleira adicionada ao acervo!");
      setNovaCategoria('');
      carregarEstatisticas(); // Recarrega sem dar refresh na página
    } catch (error) { 
      toast.error("Erro ao criar categoria."); 
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff' }}>
      
      {/* HEADER PADRONIZADO (PREMIUM DARK) */}
      <header style={{ 
        position: 'fixed', top: 0, left: 0, width: '100%', height: '70px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '0 40px', backgroundColor: 'rgba(0,0,0,0.98)', zIndex: 9999,
        borderBottom: '1px solid #1a1a1a', boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/home')}>
          <img src={logoGif} alt="Logo" style={{ width: '30px' }} />
          <h1 className="fonte-antiga" style={{ fontSize: '18px', color: '#fff', margin: 0 }}>GATO PRETO</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#c5a677', fontWeight: 'bold', fontSize: '12px' }}>✨ {user.nome?.toUpperCase()}</div>
          </div>
          <button onClick={() => setMenuAberto(!menuAberto)} style={{ background: '#c5a677', border: 'none', color: '#000', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
            {menuAberto ? 'FECHAR' : 'MENU'}
          </button>

          {menuAberto && (
            <div style={{ position: 'absolute', top: '55px', right: '0', width: '200px', backgroundColor: '#111', border: '1px solid #c5a677', borderRadius: '4px', boxShadow: '0 10px 50px rgba(0,0,0,1)', zIndex: 10000, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <button onClick={() => navigate('/home')} style={itemMenuStyle}>📚 VOLTAR À BIBLIOTECA</button>
              <button onClick={() => navigate('/novo-livro')} style={itemMenuStyle}>➕ ADICIONAR OBRA</button>
              <div style={{ height: '1px', background: '#333' }} />
              <button onClick={() => {localStorage.clear(); navigate('/')}} style={{...itemMenuStyle, color: '#ff4d4d'}}>🚪 SAIR</button>
            </div>
          )}
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main style={{ padding: '120px 40px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '50px' }}>
          <h2 className="fonte-antiga" style={{ fontSize: '36px', color: '#fff', margin: 0 }}>PAINEL DO MESTRE</h2>
          <p style={{ color: '#c5a677', letterSpacing: '2px', fontSize: '12px', marginTop: '5px' }}>VISÃO GERAL DO ACERVO</p>
        </div>

        {/* CARDS DE ESTATÍSTICAS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '60px' }}>
          <div style={cardStyle}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>📜</div>
            <h4 style={{ margin: 0, color: '#666', fontSize: '14px', letterSpacing: '1px' }}>VOLUMES CATALOGADOS</h4>
            <div style={{ fontSize: '48px', fontWeight: '900', color: '#fff', margin: '10px 0' }}>{estatisticas.totalLivros}</div>
            <button onClick={() => navigate('/novo-livro')} style={cardButtonStyle}>GERENCIAR LIVROS</button>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>🏺</div>
            <h4 style={{ margin: 0, color: '#666', fontSize: '14px', letterSpacing: '1px' }}>PRATELEIRAS ATIVAS</h4>
            <div style={{ fontSize: '48px', fontWeight: '900', color: '#fff', margin: '10px 0' }}>{estatisticas.totalCategorias}</div>
            <p style={{ color: '#c5a677', fontSize: '12px', margin: 0 }}>Categorias de organização</p>
          </div>
        </div>

        {/* GERENCIAMENTO DE CATEGORIAS */}
        <div style={{ ...cardStyle, maxWidth: '600px', textAlign: 'left', alignItems: 'flex-start' }}>
          <h3 className="fonte-antiga" style={{ color: '#c5a677', fontSize: '24px', margin: '0 0 10px' }}>NOVA PRATELEIRA</h3>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '25px' }}>Crie uma nova seção temática para organizar os futuros manuscritos.</p>
          
          <form onSubmit={handleAddCategoria} style={{ display: 'flex', gap: '15px', width: '100%' }}>
            <input 
              placeholder="Ex: Alquimia, Poesia..." 
              value={novaCategoria}
              onChange={e => setNovaCategoria(e.target.value)}
              style={{ 
                flex: 1, 
                padding: '15px', 
                backgroundColor: '#000', 
                border: '1px solid #333', 
                color: '#fff', 
                borderRadius: '4px',
                outline: 'none'
              }}
            />
            <button type="submit" style={{ 
              backgroundColor: '#c5a677', 
              color: '#000', 
              border: 'none', 
              padding: '0 30px', 
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '12px'
            }}>
              CRIAR SEÇÃO
            </button>
          </form>
        </div>

      </main>
    </div>
  );
};

// ESTILOS AUXILIARES
const cardStyle: React.CSSProperties = {
  backgroundColor: '#111',
  border: '1px solid #1a1a1a',
  padding: '40px',
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: '0.3s',
};

const cardButtonStyle = {
  marginTop: '15px',
  background: 'none',
  border: '1px solid #333',
  color: '#888',
  padding: '8px 20px',
  borderRadius: '20px',
  fontSize: '11px',
  cursor: 'pointer',
  fontWeight: 'bold' as 'bold',
  transition: '0.3s',
};

const itemMenuStyle = { 
  width: '100%', 
  padding: '15px', 
  background: 'none', 
  border: 'none', 
  color: '#fff', 
  textAlign: 'left' as 'left', 
  cursor: 'pointer', 
  fontSize: '12px', 
  fontWeight: 'bold', 
  borderBottom: '1px solid #222' 
};