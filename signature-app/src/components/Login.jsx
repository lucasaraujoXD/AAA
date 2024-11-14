import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #111;
  color: #fff;
  text-align: center;
`;

const FormContainer = styled.div`
  width: 400px;
  padding: 40px;
  background-color: #222;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    width: 90vw;
    padding: 20px;
    border-radius: 0;
  }
`;

const Input = styled.input`
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  border: none;
  border-radius: 4px;
  background-color: #333;
  color: #fff;
  font-size: 16px;
  outline: none;

  ::placeholder {
    color: #ccc;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #ffcc00;
  color: #000;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #e6b800;
  }
`;

const ToggleButton = styled(Button)`
  background-color: transparent;
  color: #ffcc00;
  border: 1px solid #ffcc00;
  margin-top: 10px;

  &:hover {
    background-color: #ffcc00;
    color: #000;
  }
`;

const Logo = styled.img`
  width: 120px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-weight: normal;
  margin-bottom: 20px;
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
      const response = await axios.get(`http://localhost:5000/users?re=${re}&password=${password}`);
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
      <FormContainer>
        <Logo src="/datawakelogo.png" alt="Logo da Empresa" />
        <Title>{isSignUp ? 'Criar Conta' : 'Faça Login para acessar o DataDriven'}</Title>
        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          <Input type="text" value={re} onChange={(e) => setRe(e.target.value)} placeholder="E-mail" required />
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required />
          {isSignUp && (
            <select value={role} onChange={(e) => setRole(e.target.value)} required style={{ width: '100%', margin: '10px 0', padding: '12px', borderRadius: '4px', backgroundColor: '#333', color: '#fff' }}>
              <option value="engenharia">Engenharia</option>
              <option value="manufatura">Manufatura</option>
              <option value="qualidade">Qualidade</option>
            </select>
          )}
          <Button type="submit">{isSignUp ? 'Criar Conta' : 'Login'}</Button>
        </form>
        <ToggleButton onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Já possui uma conta? Login' : 'Crie uma conta'}
        </ToggleButton>
      </FormContainer>
    </Container>
  );
};

export default Login;
