// src/components/Dashboard.jsx
import React from 'react';
import styled from 'styled-components';
import UploadDocument from './UploadDocument';
import Sidebar from './Sidebar';

const Container = styled.div`
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%; /* Garante que a largura total da tela seja utilizada */
  box-sizing: border-box; /* Inclui o padding na largura total para evitar overflow */

  /* Ajuste de responsividade */
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Content = styled.div`
  flex: 1;
  margin-left: 60px;
  max-width: 100%; /* Garante que o conteúdo não ultrapasse a largura da tela */
  box-sizing: border-box; /* Inclui o padding na largura total */

  /* Ajuste de margens em dispositivos móveis */
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 10px; /* Adiciona um pequeno padding para dispositivos móveis */
  }
`;

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Container>
      <Sidebar user={user} />
      <Content>
        <h2>Dashboard</h2>
        <UploadDocument />
      </Content>
    </Container>
  );
};

export default Dashboard;
