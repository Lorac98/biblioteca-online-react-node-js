import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server'; 

describe('Validações de Usuário', () => {
  
  it('Não deve permitir cadastro com e-mail em formato inválido', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Teste Erro',
        email: 'email-sem-arroba', 
        senha: '123456',
        cpf: '12345678901'
      });

    expect(response.status).toBe(400);
    // Ajustado para bater com a mensagem do seu UserController
    expect(response.body.erro).toBe('Formato de e-mail inválido.');
  });

  it('Não deve permitir cadastro com CPF matematicamente inválido', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Teste CPF',
        email: 'teste@exemplo.com',
        senha: '123456',
        cpf: '11111111111' 
      });

    expect(response.status).toBe(400);
    expect(response.body.erro).toBe('CPF inválido.');
  });
});