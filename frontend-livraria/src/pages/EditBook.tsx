import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

// ASSETS
import logoGif from '../assets/logo.gif';

interface Categoria {
  id: number;
  nome: string;
}

export const EditBook: React.FC = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const token = localStorage.getItem('@Projeto:token');
  const user = JSON.parse(localStorage.getItem('@Projeto:user') || '{}');

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  const [arquivoPdf, setArquivoPdf] = useState<File | null>(null);
  const [arquivoCapa, setArquivoCapa] = useState<File | null>(null);
  const [capaAtual, setCapaAtual] = useState<string | null>(null);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resCats, resLivro] = await Promise.all([
          api.get('/categorias', { headers: { Authorization: `Bearer ${token}` } }),
          api.get(`/livros/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setCategorias(resCats.data);
        setTitulo(resLivro.data.titulo);
        setAutor(resLivro.data.autor);
        setCategoriaId(resLivro.data.categoriaId.toString());
        setCapaAtual(resLivro.data.capaUrl);
      } catch (error) {
        toast.error("Erro ao resgatar o tomo original.");
        navigate('/home');
      }
    };

    carregarDados();
  }, [id, token, navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('titulo', titulo);
    data.append('autor', autor);
    data.append('categoriaId', categoriaId);
    
    if (arquivoPdf) data.append('pdf', arquivoPdf);
    if (arquivoCapa) data.append('capa', arquivoCapa);

    try {
      await api.put(`/livros/${id}`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Manuscrito revisado e atualizado!');
      navigate('/home');
    } catch (error) {
      toast.error('Erro ao atualizar os registros.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff' }}>
      
      {/* HEADER PREMIUM PADRONIZADO */}
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
              <button onClick={() => navigate('/dashboard')} style={itemMenuStyle}>📊 DASHBOARD</button>
              <div style={{ height: '1px', background: '#333' }} />
              <button onClick={() => {localStorage.clear(); navigate('/')}} style={{...itemMenuStyle, color: '#ff4d4d'}}>🚪 SAIR</button>
            </div>
          )}
        </div>
      </header>

      {/* ÁREA DE EDIÇÃO */}
      <main style={{ padding: '120px 20px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ width: '100%', maxWidth: '650px', textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="fonte-antiga" style={{ fontSize: '32px', color: '#c5a677', margin: '0 0 10px' }}>REVISAR VOLUME</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Altere as propriedades do tomo selecionado no acervo.</p>
        </div>

        <form onSubmit={handleUpdate} style={{ 
          width: '100%', maxWidth: '650px', backgroundColor: '#111', padding: '40px', 
          borderRadius: '4px', border: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', gap: '25px'
        }}>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>TÍTULO DO MANUSCRITO</label>
            <input 
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>AUTOR / ESCRIBA</label>
            <input 
              value={autor}
              onChange={e => setAutor(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>PRATELEIRA (CATEGORIA)</label>
            <select 
              value={categoriaId}
              onChange={e => setCategoriaId(e.target.value)}
              style={inputStyle}
              required
            >
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nome.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* ÁREA DE MÍDIA ATUAL */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ ...inputGroupStyle, backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '4px' }}>
              <label style={labelStyle}>CAPA ATUAL</label>
              {capaAtual && (
                <img 
                  src={capaAtual.startsWith('http') ? capaAtual : `http://localhost:3333/files/${capaAtual}`} 
                  alt="Capa" 
                  style={{ height: '120px', objectFit: 'contain', margin: '10px 0', borderRadius: '2px' }} 
                />
              )}
              <input type="file" accept="image/*" onChange={e => setArquivoCapa(e.target.files ? e.target.files[0] : null)} style={fileInputStyle} />
            </div>

            <div style={{ ...inputGroupStyle, backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '4px' }}>
              <label style={labelStyle}>REVISAR PDF</label>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <span style={{ fontSize: '30px' }}>📄</span>
              </div>
              <input type="file" accept="application/pdf" onChange={e => setArquivoPdf(e.target.files ? e.target.files[0] : null)} style={fileInputStyle} />
              <p style={{ fontSize: '9px', color: '#444', marginTop: '5px' }}>Deixe vazio para manter o original</p>
            </div>
          </div>

          <button type="submit" style={{ 
            backgroundColor: '#c5a677', color: '#000', padding: '18px', border: 'none', 
            borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px',
            fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase'
          }}>
            CONFIRMAR REVISÃO
          </button>

          <button type="button" onClick={() => navigate('/home')} style={{ 
            backgroundColor: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontSize: '12px'
          }}>
            DESCARTAR ALTERAÇÕES
          </button>
        </form>
      </main>
    </div>
  );
};

// ESTILOS AUXILIARES
const inputGroupStyle = { display: 'flex', flexDirection: 'column' as 'column', gap: '8px' };
const labelStyle = { fontSize: '11px', color: '#c5a677', fontWeight: 'bold', letterSpacing: '1px' };
const inputStyle = { padding: '12px', backgroundColor: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '4px', outline: 'none' };
const fileInputStyle = { fontSize: '10px', color: '#666', marginTop: '10px' };
const itemMenuStyle = { width: '100%', padding: '15px', background: 'none', border: 'none', color: '#fff', textAlign: 'left' as 'left', cursor: 'pointer', fontSize: '13px', borderBottom: '1px solid #222' };