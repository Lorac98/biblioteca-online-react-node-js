import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import gatoAnimacao from '../assets/gatopretologin.gif';
import { toast } from 'react-toastify';

// --- ESTILOS DE ANIMAÇÃO (CSS INJETADO) ---
const loginStyles = `
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .auth-card {
    animation: slideIn 0.8s ease-out forwards;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(197, 166, 119, 0.2);
  }

  .input-premium:focus {
    border-color: #c5a677 !important;
    box-shadow: 0 0 10px rgba(197, 166, 119, 0.2);
  }

  .btn-auth-premium {
    transition: all 0.3s ease;
    letter-spacing: 2px;
  }

  .btn-auth-premium:hover {
    background-color: #b3935d !important;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(197, 166, 119, 0.4);
  }

  .link-premium {
    color: #555;
    transition: 0.3s;
    cursor: pointer;
  }

  .link-premium:hover {
    color: #c5a677;
    text-shadow: 0 0 5px rgba(197, 166, 119, 0.3);
  }
`;

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, senha: password });
      localStorage.setItem('@Projeto:token', response.data.token);
      localStorage.setItem('@Projeto:user', JSON.stringify(response.data.user));
      toast.success("Bem-vindo de volta ao Gato Preto!");
      navigate('/home');
    } catch (error) {
      toast.error("O gato guardião não permitiu sua entrada. Verifique os dados.");
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000', 
      backgroundImage: 'radial-gradient(circle at center, #111 0%, #000 100%)',
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '20px'
    }}>
      <style>{loginStyles}</style>

      <div className="auth-card" style={{ 
        width: '100%', 
        maxWidth: '900px', 
        display: 'flex', 
        backgroundColor: '#0a0a0a', 
        borderRadius: '12px', 
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row'
      }}>
        
        {/* LADO VISUAL - SEM SOMBRA NO GIF */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#111', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '60px 40px',
          borderRight: '1px solid #1a1a1a'
        }}>
          <img 
            src={gatoAnimacao} 
            alt="Gato Guardião" 
            style={{ 
              width: '240px', 
              marginBottom: '20px' 
              // Removi o filter: drop-shadow daqui
            }} 
          />
          <h1 className="fonte-antiga" style={{ color: '#fff', fontSize: '32px', margin: 0, textAlign: 'center' }}>Welcome Back</h1>
          <p style={{ color: '#c5a677', opacity: 0.8, fontSize: '11px', letterSpacing: '3px', marginTop: '10px' }}>O CONHECIMENTO AGUARDA</p>
        </div>

        {/* LADO DO FORMULÁRIO */}
        <div style={{ flex: 1.2, padding: '60px 40px', backgroundColor: '#0a0a0a' }}>
          <h2 className="fonte-antiga" style={{ color: '#fff', fontSize: '28px', marginBottom: '8px' }}>Log In</h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '35px' }}>Entre com suas credenciais de membro.</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#c5a677', letterSpacing: '1px' }}>EMAIL</label>
              <input 
                className="input-premium"
                type="email" 
                placeholder="escriba@gatopreto.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ 
                  padding: '14px', 
                  borderRadius: '6px', 
                  border: '1px solid #222', 
                  backgroundColor: '#111', 
                  color: '#fff',
                  outline: 'none',
                  transition: '0.3s'
                }}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#c5a677', letterSpacing: '1px' }}>PASSWORD</label>
              <input 
                className="input-premium"
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ 
                  padding: '14px', 
                  borderRadius: '6px', 
                  border: '1px solid #222', 
                  backgroundColor: '#111', 
                  color: '#fff',
                  outline: 'none',
                  transition: '0.3s'
                }}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-auth-premium"
              style={{ 
                backgroundColor: '#c5a677', 
                color: '#000', 
                padding: '16px', 
                border: 'none', 
                borderRadius: '6px', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                marginTop: '10px',
                fontSize: '13px',
                textTransform: 'uppercase'
              }}
            >
              INICIAR JORNADA
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '13px', color: '#444' }}>
            Ainda não possui um registro? <br />
            <span 
              onClick={() => navigate('/register')} 
              className="link-premium"
              style={{ fontWeight: 'bold', fontSize: '12px' }}
            >
              Crie sua conta aqui
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};