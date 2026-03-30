import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import gatoAnimacao from '../assets/gatopretologin.gif';
import { toast } from 'react-toastify';

// --- ESTILOS DE ANIMAÇÃO (CSS INJETADO) ---
const registerStyles = `
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .auth-card {
    animation: slideInRight 0.8s ease-out forwards;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(197, 166, 119, 0.2);
  }

  .input-premium:focus {
    border-color: #c5a677 !important;
    box-shadow: 0 0 10px rgba(197, 166, 119, 0.1);
  }

  .btn-auth-premium {
    transition: all 0.3s ease;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .btn-auth-premium:hover {
    background-color: #b3935d !important;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(197, 166, 119, 0.3);
  }

  .link-premium {
    color: #c5a677;
    cursor: pointer;
    fontWeight: bold;
    transition: 0.3s;
  }

  .link-premium:hover {
    text-shadow: 0 0 8px rgba(197, 166, 119, 0.4);
    text-decoration: underline;
  }
`;

const InputPremium = ({ label, ...props }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '15px', width: '100%' }}>
    <label style={{ fontSize: '11px', color: '#c5a677', fontWeight: 'bold', letterSpacing: '1px' }}>{label}</label>
    <input 
      {...props} 
      className="input-premium"
      style={{ 
        padding: '12px 14px', 
        borderRadius: '6px', 
        border: '1px solid #222', 
        backgroundColor: '#111', 
        color: '#fff', 
        fontSize: '14px', 
        outline: 'none',
        transition: '0.3s'
      }} 
    />
  </div>
);

export const Register: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return toast.warning("Formato de e-mail inválido.");
    if (cpf.replace(/\D/g, '').length !== 11) return toast.warning("CPF deve ter 11 dígitos.");
    if (senha !== confirmarSenha) return toast.error("As senhas não coincidem!");

    try {
      await api.post('/usuarios', { nome, email, cpf, senha });
      toast.success("Inscrição aceita! O gato guardião agora te conhece.");
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.erro || "Erro ao realizar inscrição.");
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
      <style>{registerStyles}</style>

      <div className="auth-card" style={{ 
        width: '100%', 
        maxWidth: '1000px', 
        display: 'flex', 
        backgroundColor: '#0a0a0a', 
        borderRadius: '12px', 
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row'
      }}>
        
        {/* LADO VISUAL */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#111', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '40px',
          borderRight: '1px solid #1a1a1a'
        }}>
          <img src={gatoAnimacao} alt="Gato Guardião" style={{ width: '240px', marginBottom: '20px' }} />
          <h1 className="fonte-antiga" style={{ color: '#fff', fontSize: '32px', margin: 0, textAlign: 'center' }}>Join Us</h1>
          <p style={{ color: '#c5a677', opacity: 0.8, fontSize: '11px', letterSpacing: '3px', marginTop: '10px' }}>TORNE-SE UM MEMBRO SÁBIO</p>
        </div>

        {/* LADO DO FORMULÁRIO */}
        <div style={{ flex: 1.3, padding: '50px 40px', backgroundColor: '#0a0a0a' }}>
          <h2 className="fonte-antiga" style={{ color: '#fff', fontSize: '28px', marginBottom: '10px' }}>Sign Up</h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '30px' }}>Crie seu registro no acervo do Gato Preto.</p>
          
          <form onSubmit={handleRegister} style={{ width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 600 ? '1fr' : '1fr 1fr', gap: '0 20px' }}>
              <InputPremium label="Nome Completo" type="text" placeholder="Seu nome" value={nome} onChange={(e: any) => setNome(e.target.value)} required />
              <InputPremium label="E-mail" type="email" placeholder="escriba@email.com" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
              <InputPremium label="CPF (apenas números)" type="text" maxLength={11} placeholder="000.000.000-00" value={cpf} onChange={(e: any) => setCpf(e.target.value)} required />
              <div style={{ display: 'none' }}>{/* Spacer para grid */}</div>
              <InputPremium label="Senha" type="password" placeholder="Mín. 6 caracteres" value={senha} onChange={(e: any) => setSenha(e.target.value)} minLength={6} required />
              <InputPremium label="Confirmar Senha" type="password" placeholder="Repita a senha" value={confirmarSenha} onChange={(e: any) => setConfirmarSenha(e.target.value)} required />
            </div>
            
            <button 
              type="submit" 
              className="btn-auth-premium"
              style={{ 
                width: '100%', 
                padding: '16px', 
                backgroundColor: '#c5a677', 
                color: '#000', 
                border: 'none', 
                borderRadius: '6px', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                marginTop: '15px',
                fontSize: '14px'
              }}
            >
              CANDIDATAR-SE AO ACERVO
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '13px', color: '#555' }}>
            Já possui acesso? <span className="link-premium" onClick={() => navigate('/')}>Realizar Log in</span>
          </p>
        </div>
      </div>
    </div>
  );
};