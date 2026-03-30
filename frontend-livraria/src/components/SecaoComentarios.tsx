import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface ComentarioProps {
  livroId: string;
  token: string | null;
}

export const SecaoComentarios: React.FC<ComentarioProps> = ({ livroId, token }) => {
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const carregarComentarios = async () => {
    try {
      const res = await api.get(`/comentarios/${livroId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComentarios(res.data);
    } catch (err) {
      console.error("Erro ao carregar pergaminhos de comentários.");
    }
  };

  useEffect(() => {
    carregarComentarios();
  }, [livroId]);

  const postarComentario = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!novoComentario.trim()) return;

  setEnviando(true);
  try {
    const response = await api.post('/comentarios', { 
      livroId, 
      texto: novoComentario 
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Limpa o campo de texto
    setNovoComentario('');
    
    // ATUALIZAÇÃO MANUAL: Em vez de esperar o servidor, 
    // adicionamos o novo comentário direto no topo da lista local
    setComentarios(prev => [response.data, ...prev]);

    // Opcional: Chama o carregar do banco para garantir sincronia total
    // carregarComentarios(); 
    
  } catch (err) {
    console.error(err);
    alert("O tinteiro secou... Erro ao postar comentário.");
  } finally {
    setEnviando(false);
  }
};

  return (
    <div style={{ marginTop: '20px', borderTop: '1px dashed #ccc', paddingTop: '15px' }}>
      <h5 className="fonte-antiga" style={{ color: 'var(--color5)', marginBottom: '15px' }}>📜 Mural de Pensamentos</h5>

      {/* FORMULÁRIO DE POSTAGEM */}
      <form onSubmit={postarComentario} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text"
          placeholder="Escreva sua crítica ou elogio..."
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          style={{ 
            flex: 1, 
            padding: '10px', 
            borderRadius: '4px', 
            border: '1px solid var(--color3)',
            backgroundColor: 'rgba(255,255,255,0.7)',
            fontFamily: 'var(--font-body)'
          }}
        />
        <button 
          type="submit" 
          disabled={enviando}
          style={{ 
            backgroundColor: 'var(--color5)', 
            color: 'white', 
            border: 'none', 
            padding: '10px 15px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            opacity: enviando ? 0.6 : 1
          }}
        >
          {enviando ? '...' : 'Postar'}
        </button>
      </form>

      {/* LISTAGEM DE COMENTÁRIOS */}
      <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {comentarios.length === 0 ? (
          <p style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>Nenhuma alma comentou sobre este tomo ainda.</p>
        ) : (
          comentarios.map((coment) => (
            <div key={coment.id} style={{ backgroundColor: '#f9f6f0', padding: '10px', borderRadius: '4px', borderLeft: '3px solid var(--color2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong style={{ fontSize: '12px', color: 'var(--color5)' }}>{coment.usuario?.nome}</strong>
                <span style={{ fontSize: '10px', color: '#999' }}>
                  {new Date(coment.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <p style={{ fontSize: '13px', margin: 0, color: '#444' }}>{coment.texto}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};