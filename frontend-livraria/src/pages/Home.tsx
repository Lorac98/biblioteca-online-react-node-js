import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { SecaoComentarios } from '../components/SecaoComentarios';
import { toast } from 'react-toastify';
import { Livro, User, RankingSabio, Categoria } from '../types';

// ASSETS
import logoGif from '../assets/logo.gif';
import gatoLoading from '../assets/gatopretologin.gif'; 
import livroshome from '../assets/livroshome.png';

// --- ESTILOS DE ANIMAÇÃO CSS ---
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes dropdownReveal {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .book-card-item {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .book-card-item:hover {
    transform: translateY(-8px);
    border-color: #c5a677 !important;
    box-shadow: 0 12px 30px rgba(197, 166, 119, 0.15);
  }

  .book-card-item img {
    transition: transform 0.7s ease;
  }

  .book-card-item:hover img {
    transform: scale(1.05);
  }

  .nav-button-premium {
    transition: all 0.3s ease;
  }

  .nav-button-premium:hover {
    box-shadow: 0 0 15px rgba(197, 166, 119, 0.4);
    filter: brightness(1.2);
  }
`;

// --- COMPONENTE DE ESTRELAS ---
const EstrelasAvaliacao: React.FC<{livroId: string; token: string | null; notaAtual?: number; onAvaliado: () => void}> = ({ livroId, token, notaAtual, onAvaliado }) => {
  const notaExibida = Math.round(notaAtual || 0);
  const avaliar = async (valor: number) => {
    try {
      await api.post('/avaliacoes', { livroId, nota: valor }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`Nota ${valor} registrada!`);
      onAvaliado();
    } catch (error) { toast.error("Erro ao avaliar."); }
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '8px 0' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} onClick={() => avaliar(s)} style={{ cursor: 'pointer', fontSize: '18px', color: s <= notaExibida ? '#c5a677' : '#444', transition: '0.2s' }}>★</span>
      ))}
      <span style={{ fontSize: '12px', marginLeft: '8px', color: '#c5a677' }}>{notaAtual?.toFixed(1) || '0.0'}</span>
    </div>
  );
};

export const Home: React.FC = () => {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);
  const [ranking, setRanking] = useState<RankingSabio[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [catFiltro, setCatFiltro] = useState('Todas');
  const [menuAberto, setMenuAberto] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const itensPorPagina = 8;

  const navigate = useNavigate();
  const token = localStorage.getItem('@Projeto:token');
  const user: User = JSON.parse(localStorage.getItem('@Projeto:user') || '{}');

  const carregarDados = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const url = `/livros?page=${paginaAtual}&limit=${itensPorPagina}&busca=${busca}&categoria=${catFiltro}`;
      const [resLivros, resCats, resFavs, resRanking] = await Promise.all([
        api.get(url, { headers }),
        api.get('/categorias', { headers }),
        api.get('/favoritos', { headers }),
        api.get('/ranking', { headers })
      ]);
      setLivros(resLivros.data.data);
      setTotalPaginas(resLivros.data.totalPages);
      setCategorias(resCats.data);
      setFavoritosIds(resFavs.data.map((f: any) => f.livroId));
      setRanking(resRanking.data);
    } catch (error) { console.error(error); } 
    finally { setTimeout(() => setLoading(false), 800); }
  };

  useEffect(() => {
    if (!token) navigate('/'); else carregarDados();
  }, [token, paginaAtual, busca, catFiltro]);

  const toggleFavorito = async (livroId: string) => {
    try {
      if (favoritosIds.includes(livroId)) {
        await api.delete(`/favoritos/${livroId}`, { headers: { Authorization: `Bearer ${token}` } });
        setFavoritosIds(prev => prev.filter(id => id !== livroId));
      } else {
        await api.post('/favoritos', { livroId }, { headers: { Authorization: `Bearer ${token}` } });
        setFavoritosIds(prev => [...prev, livroId]);
      }
    } catch (err) { toast.error("Erro nos favoritos."); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja realmente remover esta obra?")) {
      try {
        await api.delete(`/livros/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Obra removida.");
        carregarDados();
      } catch (error) { toast.error("Erro ao excluir."); }
    }
  };

  if (loading && livros.length === 0) {
    return (
      <div style={{ 
        height: '100vh', width: '100vw', backgroundColor: '#121313', 
        display: 'flex', flexDirection: 'column', justifyContent: 'center', 
        alignItems: 'center', position: 'fixed', top: 0, left: 0, zIndex: 10000 
      }}>
        <div style={{ width: '250px', height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={gatoLoading} alt="Loading" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>
        <h2 className="fonte-antiga" style={{ 
          marginTop: '30px', color: '#fafafaa8', letterSpacing: '4px', fontSize: '20px', textAlign: 'center',
          textShadow: '0 0 10px rgba(197, 166, 119, 0.3)'
        }}>
          CONSULTANDO OS ORÁCULOS...
        </h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', overflowX: 'hidden', position: 'relative' }}>
      <style>{animationStyles}</style>

      {/* HEADER */}
      <header style={{ 
        position: 'fixed', top: 0, left: 0, width: '100%', height: '70px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '0 40px', backgroundColor: 'rgba(0,0,0,0.98)', zIndex: 9999,
        borderBottom: '1px solid #1a1a1a', boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logoGif} alt="Logo" style={{ width: '30px' }} />
          <h1 className="fonte-antiga" style={{ fontSize: '18px', color: '#fff', margin: 0 }}>GATO PRETO</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
          <div style={{ textAlign: 'right', maxWidth: '140px' }}>
            <div style={{ color: '#c5a677', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
               {user.nome?.toUpperCase()}
            </div>
          </div>
          <button 
            className="nav-button-premium"
            onClick={() => setMenuAberto(!menuAberto)} 
            style={{ background: '#c5a677', border: 'none', color: '#000', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
          >
            {menuAberto ? 'FECHAR' : 'MENU'}
          </button>

          {menuAberto && (
            <div style={{ 
              position: 'absolute', top: '55px', right: '0', width: '200px', backgroundColor: '#111', 
              border: '1px solid #c5a677', borderRadius: '4px', boxShadow: '0 10px 50px rgba(0,0,0,1)', 
              zIndex: 10000, overflow: 'hidden', display: 'flex', flexDirection: 'column',
              animation: 'dropdownReveal 0.3s ease-out forwards',
              transformOrigin: 'top right'
            }}>
              <button onClick={() => {navigate('/perfil'); setMenuAberto(false)}} style={itemMenuStyle}>👤 MEU PERFIL</button>
              <button onClick={() => {navigate('/favoritos'); setMenuAberto(false)}} style={itemMenuStyle}>❤️ FAVORITOS</button>
              {user.role === 'ADMIN' && <button onClick={() => {navigate('/dashboard'); setMenuAberto(false)}} style={{...itemMenuStyle, color: '#c5a677'}}>📟 PAINEL MESTRE</button>}
              <div style={{ height: '1px', background: '#333' }} />
              <button onClick={() => {localStorage.clear(); navigate('/')}} style={{...itemMenuStyle, color: '#ff4d4d'}}>🚪 SAIR</button>
            </div>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ 
        width: '100%', minHeight: '90vh', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', padding: '100px 5% 50px', 
        background: 'linear-gradient(to bottom, #000 0%, #0a0a0a 100%)', boxSizing: 'border-box' 
      }}>
        <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '60px', maxWidth: '1300px', width: '100%', flexWrap: 'wrap-reverse' }}>
          <div style={{ position: 'relative', flex: '1.4 1 500px', display: 'flex', justifyContent: 'center' }}>
             <span style={{ position: 'absolute', fontSize: 'clamp(80px, 18vw, 180px)', fontWeight: '900', color: '#fff', opacity: 0.04, top: '50%', transform: 'translateY(-50%)', zIndex: 0 }}>LIBRARY</span>
             <img src={livroshome} alt="Hero" style={{ width: '100%', maxWidth: '750px', zIndex: 1, filter: 'drop-shadow(0 0 30px rgba(0,0,0,0.9))', transform: 'scale(1.1)' }} />
          </div>
          <div style={{ flex: '1 1 400px', textAlign: 'left' }}>
            <h2 className="fonte-antiga" style={{ fontSize: 'clamp(40px, 6vw, 75px)', margin: 0, color: '#fff', lineHeight: 1.1 }}>VISITE ONLINE</h2>
            <p style={{ color: '#666', margin: '25px 0', fontSize: '17px', maxWidth: '400px' }}>Sua biblioteca particular nas sombras do digital.</p>
          </div>
        </div>
      </section>

      {/* BUSCA */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-35px', position: 'relative', zIndex: 500 }}>
        <div style={{ background: '#111', padding: '10px', borderRadius: '50px', border: '1px solid #222', display: 'flex', width: '90%', maxWidth: '500px' }}>
          <input placeholder="Pesquisar..." value={busca} onChange={e => {setBusca(e.target.value); setPaginaAtual(1)}} style={{ flex: 1, background: 'none', border: 'none', color: '#fff', padding: '0 20px', outline: 'none' }} />
          <select value={catFiltro} onChange={e => {setCatFiltro(e.target.value); setPaginaAtual(1)}} style={{ background: 'none', color: '#c5a677', border: 'none', cursor: 'pointer', outline: 'none' }}>
            <option value="Todas" style={{background: '#111'}}>Prateleiras</option>
            {categorias.map(c => <option key={c.id} value={c.nome} style={{background: '#111'}}>{c.nome}</option>)}
          </select>
        </div>
      </div>

      <main style={{ padding: '80px 5% 40px' }}>
        {/* RANKING */}
        <section className="animate-fade-in" style={{ border: '1px solid #1a1a1a', borderRadius: '8px', padding: '30px', marginBottom: '60px', background: 'rgba(5,5,5,0.8)' }}>
          <h3 style={{ textAlign: 'center', color: '#c5a677', marginBottom: '30px' }} className="fonte-antiga">🏆 CONSELHO DOS GRANDES SÁBIOS</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
            {ranking.map((sabio, index) => (
              <div key={index} style={{ textAlign: 'center', minWidth: '100px' }}>
                <div style={{ fontSize: '20px' }}>{index === 0 ? '👑' : '📜'}</div>
                <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{sabio.nome}</div>
                <div style={{ color: '#c5a677', fontSize: '10px' }}>{Math.floor(sabio.tempoTotal / 60)}h {sabio.tempoTotal % 60}min lidos</div>
              </div>
            ))}
          </div>
        </section>

        {/* LISTAGEM */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '40px' }}>
          {livros.map((livro, index) => (
            <div 
              key={livro.id} 
              className="book-card-item animate-fade-in" 
              style={{ 
                background: '#111', border: '1px solid #222', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                animationDelay: `${index * 0.1}s` 
              }}
            >
              <div style={{ height: '320px', position: 'relative', overflow: 'hidden' }}>
                <img src={livro.capaUrl?.startsWith('http') ? livro.capaUrl : `http://localhost:3333/files/${livro.capaUrl}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={livro.titulo} />
                <button onClick={() => toggleFavorito(livro.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', border: 'none', color: favoritosIds.includes(livro.id) ? '#e74c3c' : '#fff', borderRadius: '50%', padding: '8px', cursor: 'pointer', zIndex: 10 }}>
                  {favoritosIds.includes(livro.id) ? '❤️' : '🤍'}
                </button>
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 5px', fontSize: '16px', color: '#fff' }}>{livro.titulo}</h4>
                <p style={{ color: '#666', fontSize: '12px', marginBottom: '15px' }}>{livro.autor}</p>
                
                <EstrelasAvaliacao livroId={livro.id} token={token} notaAtual={livro.mediaAvaliacao} onAvaliado={carregarDados} />

                {user.role === 'ADMIN' && (
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <button onClick={() => navigate(`/editar-livro/${livro.id}`)} style={{ flex: 1, padding: '8px', backgroundColor: '#333', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '11px' }}>EDITAR</button>
                    <button onClick={() => handleDelete(livro.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#8a2318', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '11px' }}>EXCLUIR</button>
                  </div>
                )}

                <button onClick={() => navigate(`/ler/${livro.id}`)} className="nav-button-premium" style={{ width: '100%', padding: '12px', backgroundColor: '#c5a677', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px', marginBottom: '20px' }}>LER AGORA</button>
                
                <div style={{ marginTop: 'auto', borderTop: '1px solid #222', paddingTop: '15px' }}>
                  <SecaoComentarios livroId={livro.id} token={token} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINAÇÃO */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '60px' }}>
          <button disabled={paginaAtual === 1} onClick={() => setPaginaAtual(prev => prev - 1)} style={btnPageStyle}>←</button>
          <span style={{ color: '#c5a677', fontWeight: 'bold' }}>{paginaAtual} / {totalPaginas}</span>
          <button disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual(prev => prev + 1)} style={btnPageStyle}>→</button>
        </div>
      </main>
    </div>
  );
};

const itemMenuStyle = { width: '100%', padding: '15px', background: 'none', border: 'none', color: '#fff', textAlign: 'left' as 'left', cursor: 'pointer', fontSize: '13px', borderBottom: '1px solid #222', transition: '0.3s' };
const btnPageStyle = { background: '#111', border: '1px solid #333', color: '#c5a677', padding: '10px 20px', cursor: 'pointer', borderRadius: '4px', transition: '0.3s' };