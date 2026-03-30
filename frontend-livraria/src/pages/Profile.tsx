import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logoGif from '../assets/logo.gif';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const token = localStorage.getItem('@Projeto:token');

  // 1. CARREGAR DADOS ATUALIZADOS DO BACKEND (Incluindo o tempo de leitura)
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const response = await api.get('/perfil', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    };

    if (token) carregarPerfil();
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [token]);

  const isMobile = windowWidth < 768;

  // Se ainda estiver carregando os dados
  if (!userData) return <div style={{ backgroundColor: 'var(--color1)', height: '100vh' }} />;

  // Cálculo do tempo amigável
  const tempoTotal = userData.tempoTotalLeitura || 0;
  const horas = Math.floor(tempoTotal / 60);
  const minutos = tempoTotal % 60;

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh' }}>
      
      {/* SIDEBAR PADRONIZADA */}
      <aside style={{ 
        width: isMobile ? '100%' : '260px', 
        backgroundColor: 'var(--color5)', 
        color: 'var(--color1)', 
        padding: '30px 20px',
        position: isMobile ? 'relative' : 'fixed',
        height: isMobile ? 'auto' : '100vh',
        borderRight: isMobile ? 'none' : '4px solid var(--color3)',
        boxSizing: 'border-box',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src={logoGif} alt="Logo" style={{ width: '80px', borderRadius: '50%', border: '2px solid var(--color2)' }} />
          <h2 className="fonte-antiga" style={{ margin: '10px 0 0', fontSize: '22px' }}>Meu Perfil</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div onClick={() => navigate('/home')} style={{ padding: '12px', cursor: 'pointer', opacity: 0.8 }}>← Biblioteca</div>
          <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontWeight: 'bold' }}>⚙️ Configurações</div>
          <div onClick={() => navigate('/favoritos')} style={{ padding: '12px', cursor: 'pointer', opacity: 0.8 }}>❤️ Favoritos</div>
          <div onClick={() => { localStorage.clear(); navigate('/'); }} style={{ padding: '12px', cursor: 'pointer', marginTop: '40px', color: '#e74c3c' }}>🚪 Sair</div>
        </nav>
      </aside>

      {/* CONTEÚDO PERFIL */}
      <main style={{ flex: 1, marginLeft: isMobile ? '0' : '260px', padding: isMobile ? '20px' : '40px 60px', backgroundColor: 'var(--color1)' }}>
        <h3 className="fonte-antiga" style={{ color: 'var(--color5)', fontSize: '32px', borderBottom: '2px solid var(--color2)', paddingBottom: '10px', marginBottom: '40px' }}>
          Ficha do Membro
        </h3>

        <div className="pergaminho" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
          
          {/* CABEÇALHO DA FICHA */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '60px', marginBottom: '10px' }}>🎭</div>
            <h4 className="fonte-antiga" style={{ fontSize: '28px', margin: '0' }}>{userData.nome}</h4>
            <div style={{ marginTop: '10px' }}>
              <span style={{ backgroundColor: 'var(--color5)', color: 'var(--color1)', padding: '5px 15px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>
                {userData.role}
              </span>
            </div>
          </div>

          {/* CARD DE ESTATÍSTICA (ESTILO RETRÔ) */}
          <div style={{ 
            backgroundColor: 'rgba(0,0,0,0.05)', 
            border: '1px dashed var(--color5)', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center', 
            marginBottom: '30px' 
          }}>
            <label style={{ fontSize: '11px', color: 'var(--color4)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Tempo de Sabedoria
            </label>
            <p style={{ margin: '10px 0 0', fontSize: '24px', color: 'var(--color5)', fontWeight: 'bold' }}>
              <span style={{ fontSize: '30px' }}>⏳</span> {horas}h {minutos}min
            </p>
          </div>

          {/* DADOS CADASTRAIS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              <label style={{ fontSize: '11px', color: '#888', fontWeight: 'bold', letterSpacing: '1px' }}>CORREIO ELETRÔNICO</label>
              <p style={{ margin: '5px 0', fontSize: '16px', color: '#333' }}>{userData.email}</p>
            </div>
            <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              <label style={{ fontSize: '11px', color: '#888', fontWeight: 'bold', letterSpacing: '1px' }}>IDENTIFICAÇÃO (CPF)</label>
              <p style={{ margin: '5px 0', fontSize: '16px', color: '#333' }}>{userData.cpf || 'Não informado'}</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};