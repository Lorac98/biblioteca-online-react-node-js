import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import logoGif from '../assets/logo.gif';
import { toast } from 'react-toastify';

export const ReadBook: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('@Projeto:token');
  
  const [livro, setLivro] = useState<any>(null);
  const [modoNoturno, setModoNoturno] = useState(true); 
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  useEffect(() => {
    const carregarLivro = async () => {
      try {
        const response = await api.get(`/livros/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLivro(response.data);
      } catch (error) {
        navigate('/home');
      }
    };
    if (token) carregarLivro();
  }, [id, token, navigate]);

  // Registro de progresso (Tempo de Leitura) com correção do Toast
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await api.post('/livros/progresso', { 
          livroId: id, 
          minutos: 1 
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // CORREÇÃO AQUI: icon agora recebe um elemento JSX <span> para evitar erro de tipo
        toast.success("✨ +1 Minuto de Sabedoria adquirido!", {
          style: { 
            backgroundColor: '#1a1a1a', 
            color: '#c5a677', 
            border: '1px solid #c5a677' 
          },
          icon: <span>📜</span>
        });
      } catch (err) {
        console.error("Falha ao registrar tempo.");
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [id, token]);

  if (!livro) return <div style={{ background: '#000', height: '100vh' }} />;

  const pdfUrl = livro.pdfUrl?.startsWith('http') 
    ? livro.pdfUrl 
    : `http://localhost:3333/files/${livro.pdfUrl}`;

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#0a0a0a', 
      transition: '0.3s',
      overflow: 'hidden'
    }}>
      
      {/* HEADER PREMIUM DE LEITURA */}
      <header style={{ 
        height: '70px',
        padding: '0 40px', 
        backgroundColor: 'rgba(0,0,0,0.98)', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #1a1a1a', 
        zIndex: 100,
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={() => navigate('/home')} 
            style={{ background: 'none', border: 'none', color: '#c5a677', cursor: 'pointer', fontSize: '24px' }}
          >
            ←
          </button>
          <img 
            src={logoGif} 
            alt="Logo" 
            style={{ width: '30px', height: '30px', borderRadius: '50%' }} 
          />
          <div style={{ maxWidth: isMobile ? '150px' : '400px' }}>
            <div className="fonte-antiga" style={{ fontSize: '18px', lineHeight: '1.2', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {livro.titulo?.toUpperCase()}
            </div>
            <div style={{ fontSize: '11px', color: '#c5a677', letterSpacing: '1px' }}>{livro.autor}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button 
            onClick={() => setModoNoturno(!modoNoturno)}
            style={{ 
              backgroundColor: 'transparent', 
              color: '#c5a677',
              border: '1px solid #c5a677', 
              padding: '8px 16px', 
              borderRadius: '4px', 
              cursor: 'pointer', 
              fontSize: '11px', 
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}
          >
            {modoNoturno ? 'MODO CLARO' : 'MODO NOTURNO'}
          </button>
        </div>
      </header>

      {/* ÁREA DO MANUSCRITO */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: isMobile ? '10px' : '20px 40px',
        backgroundColor: modoNoturno ? '#0f0f0f' : '#e5e5e5',
        backgroundImage: modoNoturno 
          ? 'radial-gradient(circle, #1a1a1a 0%, #0a0a0a 100%)' 
          : 'none',
        transition: '0.3s ease'
      }}>
        
        <div style={{ 
          width: '100%',
          maxWidth: '1000px',
          height: '100%',
          backgroundColor: '#fff',
          position: 'relative',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          borderRadius: '4px',
          overflow: 'hidden',
          display: 'flex',
          filter: modoNoturno ? 'sepia(10%) contrast(90%)' : 'none',
          transition: 'filter 0.3s ease'
        }}>
          
          <div style={{ 
            width: '20px', height: '100%', 
            background: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 100%)',
            position: 'absolute', left: 0, zIndex: 10, pointerEvents: 'none'
          }} />

          <iframe
            src={`${pdfUrl}#view=FitH&toolbar=0`}
            width="100%"
            height="100%"
            style={{ border: 'none', zIndex: 5 }}
            title="Leitor Gato Preto"
          />

          <div style={{ 
            width: '4px', height: '100%', 
            backgroundColor: 'rgba(0,0,0,0.05)',
            position: 'absolute', right: 0, zIndex: 10
          }} />
        </div>
      </main>
    </div>
  );
};