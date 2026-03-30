import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Chamada para a rota que criamos no Backend
      await api.patch('/recuperar-senha', { 
        email, 
        cpf, 
        novaSenha 
      });

      alert("Sua senha foi atualizada com sucesso! Use a nova senha para entrar.");
      navigate('/'); // Volta para o Login
    } catch (error: any) {
      const mensagem = error.response?.data?.erro || "Erro ao recuperar senha. Verifique seus dados.";
      alert(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      backgroundColor: '#f5f5f5', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <div style={{ 
        padding: '40px', 
        backgroundColor: '#fff', 
        borderRadius: '12px', 
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)', 
        width: '100%', 
        maxWidth: '400px' 
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>Recuperar Senha</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '25px', fontSize: '14px' }}>
          Confirme seus dados para cadastrar uma nova senha.
        </p>

        <form onSubmit={handleRecover} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>E-mail cadastrado:</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>CPF (Somente números):</label>
            <input 
              type="text" 
              placeholder="00000000000" 
              value={cpf} 
              onChange={e => setCpf(e.target.value)} 
              required 
              style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Nova Senha:</label>
            <input 
              type="password" 
              placeholder="Digite a nova senha" 
              value={novaSenha} 
              onChange={e => setNovaSenha(e.target.value)} 
              required 
              style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '14px', 
              background: '#007bff', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            {loading ? 'Processando...' : 'Atualizar Senha'}
          </button>

          <button 
            type="button" 
            onClick={() => navigate('/')} 
            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '14px' }}
          >
            Voltar para o Login
          </button>
        </form>
      </div>
    </div>
  );
};