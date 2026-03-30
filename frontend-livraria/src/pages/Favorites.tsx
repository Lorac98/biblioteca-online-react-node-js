import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// ASSETS
import logoGif from '../assets/logo.gif';

export const Favorites: React.FC = () => {
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('@Projeto:token');
  const user = JSON.parse(localStorage.getItem('@Projeto:user') || '{}');

  const carregarFavoritos = async () => {
    try {
      const res = await api.get('/favoritos', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setFavoritos(res.data);
    } catch (err) {
      console.error("Erro ao carregar favoritos", err);
    }
  };

  useEffect(() => {
    if (!token) navigate('/'); else carregarFavoritos();
  }, [token]);

  const removerDosFavoritos = async (idLivro: string) => {
    try {
      await api.delete(`/favoritos/${idLivro}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      // Filtra localmente para o livro sumir da tela na hora
      setFavoritos(prev => prev.filter(fav => fav.livroId !== idLivro));
      toast.info("Removido dos seus tesouros.");
    } catch (err: any) {
      toast.error("Não foi possível remover da estante.");
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
              <button onClick={() => navigate('/home')} style={itemMenuStyle}>📚 BIBLIOTECA</button>
              <button onClick={() => navigate('/perfil')} style={itemMenuStyle}>⚙️ MEU PERFIL</button>
              {user.role === 'ADMIN' && <button onClick={() => navigate('/dashboard')} style={{...itemMenuStyle, color: '#c5a677'}}>📟 PAINEL MESTRE</button>}
              <div style={{ height: '1px', background: '#333' }} />
              <button onClick={() => {localStorage.clear(); navigate('/')}} style={{...itemMenuStyle, color: '#ff4d4d'}}>🚪 SAIR</button>
            </div>
          )}
        </div>
      </header>

      <main style={{ padding: '120px 40px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '50px', textAlign: 'center' }}>
          <h2 className="fonte-antiga" style={{ fontSize: '36px', color: '#fff', margin: 0 }}>MEUS TESOUROS</h2>
          <p style={{ color: '#c5a677', letterSpacing: '2px', fontSize: '12px', marginTop: '5px' }}>OBRAS FAVORITADAS NO ACERVO</p>
        </div>

        {favoritos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 20px', color: '#444' }}>
            <span style={{ fontSize: '50px', display: 'block', marginBottom: '20px' }}>🏺</span>
            <p className="fonte-antiga">Sua estante de relíquias está vazia no momento.</p>
            <button onClick={() => navigate('/home')} style={{ background: 'none', border: '1px solid #c5a677', color: '#c5a677', padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>EXPLORAR BIBLIOTECA</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '40px' }}>
            {favoritos.map(fav => {
              const livro = fav.livro;
              if (!livro) return null;

              return (
                <div key={fav.id} style={{ backgroundColor: '#111', border: '1px solid #1a1a1a', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                  
                  {/* BOTÃO REMOVER (CORAÇÃO CHEIO) */}
                  <button 
                    onClick={() => removerDosFavoritos(fav.livroId)}
                    style={{ 
                      position: 'absolute', top: '15px', right: '15px', 
                      background: 'rgba(0,0,0,0.7)', border: 'none', 
                      borderRadius: '50%', width: '38px', height: '38px', 
                      cursor: 'pointer', zIndex: 10, color: '#e74c3c'
                    }}
                  >❤️</button>

                  <div style={{ height: '360px', overflow: 'hidden' }}>
                    <img 
                      src={livro.capaUrl?.startsWith('http') ? livro.capaUrl : `http://localhost:3333/files/${livro.capaUrl}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
                      alt={livro.titulo} 
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=Capa+Indisponível'; }}
                    />
                  </div>

                  <div style={{ padding: '20px' }}>
                    <h4 className="fonte-antiga" style={{ margin: '0 0 5px', fontSize: '18px', color: '#fff' }}>{livro.titulo}</h4>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>{livro.autor.toUpperCase()}</p>
                    
                    <button 
                      onClick={() => navigate(`/ler/${livro.id}`)}
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: 'transparent', 
                        color: '#c5a677', 
                        border: '1px solid #c5a677', 
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '12px',
                        letterSpacing: '2px'
                      }}
                    >
                      ABRIR MANUSCRITO
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

// ESTILOS AUXILIARES
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