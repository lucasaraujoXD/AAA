// src/components/CreateSignature.jsx
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import SignatureCanvas from 'react-signature-canvas';
import Sidebar from './Sidebar'; // Importe o Sidebar

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.body};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Container = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 600px;
  width: 100%;
  margin-top: 20px;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 100%;
  }
`;

const Title = styled.h3`
  margin-bottom: 20px;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const SignatureCanvasContainer = styled.div`
  width: 100%;
  height: 200px;
  margin: 20px 0;
  border: 2px solid white; /* Borda branca ao redor do canvas */
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  canvas {
    width: 100% !important;
    height: 100% !important;
    border-radius: 8px;
    background-color: transparent; /* Remover o fundo branco do canvas */
  }

  @media (max-width: 768px) {
    height: 150px;
  }
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  background-color: #ffcc00;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background-color: #e6b800;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
`;

const CreateSignature = () => {
  const sigCanvas = useRef({});
  const [savedSignature, setSavedSignature] = useState(null);

  // Carregar assinatura salva ao montar o componente
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      fetch(`http://localhost:5000/signatures?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) setSavedSignature(data[0].signature);
        })
        .catch((err) => console.error('Erro ao buscar assinatura:', err));
    }
  }, []);

  const clearSignature = () => sigCanvas.current.clear();

  const saveSignatureToDatabase = () => {
    const trimmedSignature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!trimmedSignature || !user) {
      alert('Por favor, crie uma assinatura antes de salvar.');
      return;
    }

    fetch(`http://localhost:5000/signatures?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          // Atualiza a assinatura existente
          fetch(`http://localhost:5000/signatures/${data[0].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data[0], signature: trimmedSignature }),
          }).then(() => {
            alert('Assinatura atualizada com sucesso!');
            setSavedSignature(trimmedSignature);
          });
        } else {
          // Salva uma nova assinatura
          fetch('http://localhost:5000/signatures', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, signature: trimmedSignature }),
          }).then(() => {
            alert('Assinatura salva com sucesso!');
            setSavedSignature(trimmedSignature);
          });
        }
      });
  };

  return (
    <PageContainer>
      <Sidebar /> {/* Sidebar fica ao lado esquerdo */}
      <MainContent>
        <Container>
          <Title>Criação de Assinatura</Title>
          <SignatureCanvasContainer>
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
            />
          </SignatureCanvasContainer>
          <Button onClick={clearSignature}>Limpar</Button>
          <Button onClick={saveSignatureToDatabase}>Salvar Assinatura</Button>
        </Container>
      </MainContent>
    </PageContainer>
  );
};

export default CreateSignature;
