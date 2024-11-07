import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  width: 400px;  /* Largura fixa do container */
  margin: auto;  /* Centraliza o container na tela */
  padding: 20px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;  /* Centraliza os itens horizontalmente */
`;

const Input = styled.input`
  width: 80%;  /* Largura dos campos de input será de 80% do container */
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 80%;  /* Largura dos botões será de 80% do container */
  padding: 10px;
  background-color: #ffcc00; /* Amarelo forte */
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #e6b800; /* Efeito hover */
  }
`;

const Logo = styled.img`
  width: 100px;
  margin-bottom: 20px;
`;

const RoleSelect = styled.select`
  width: 80%;  /* Largura da seleção de cargo será de 80% do container */
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Login = () => {
  const [re, setRe] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('engenharia'); // Default role
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/users?re=${re}&password=${password}&role=${role}`);
      if (response.data.length > 0) {
        localStorage.setItem('user', JSON.stringify(response.data[0]));
        navigate('/dashboard');
      } else {
        alert('Erro ao efetuar Login');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const newUser = { re, password, role }; // Include role in the new user
      await axios.post('http://localhost:5000/users', newUser);
      alert('Usuário registrado com sucesso!');
      setIsSignUp(false);
    } catch (error) {
      console.error('Sign Up failed:', error);
    }
  };

  return (
    <Container>
      <Logo src="/datawakelogo.png" alt="Logo da Empresa" />
      <h2>{isSignUp ? 'Criar Conta' : 'Faça Login para acessar a Assinatura Digital'}</h2>
      <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
        <Input type="text" value={re} onChange={(e) => setRe(e.target.value)} placeholder="Usuário" required />
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required />
        {isSignUp && (
          <RoleSelect value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="engenharia">Engenharia</option>
            <option value="manufatura">Manufatura</option>
            <option value="qualidade">Qualidade</option>
          </RoleSelect>
        )}
        <Button type="submit">{isSignUp ? 'Criar Conta' : 'Login'}</Button>
      </form>
      <br />
      <Button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Já possui uma conta? Login' : 'Crie uma conta'}
      </Button>
    </Container>
  );
};

export default Login;
