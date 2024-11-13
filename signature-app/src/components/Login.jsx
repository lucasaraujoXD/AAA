import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centraliza verticalmente */
  align-items: center; /* Centraliza horizontalmente */
  width: 400px;
  margin: auto;
  padding: 20px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  text-align: center;

  /* Ajuste para ocupar toda a tela em dispositivos móveis */
  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 0;
  }
`;

const Input = styled.input`
  width: 80%;
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Button = styled.button`
  width: 80%;
  padding: 10px;
  background-color: #ffcc00;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e6b800;
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Logo = styled.img`
  width: 100px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    width: 80px;
  }
`;

const RoleSelect = styled.select`
  width: 80%;
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Login = () => {
  const [re, setRe] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('engenharia');
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
      const newUser = { re, password, role };
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
