import React from 'react';
import styled from 'styled-components';
import UploadDocument from './UploadDocument';
import Sidebar from './Sidebar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Content = styled.div`
  flex: 1;
  margin-left: 60px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza o conteúdo horizontalmente */
  text-align: center; /* Centraliza o texto */

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 10px;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
`;

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Container>
      <Sidebar user={user} />
      <Content>
        <h2>Assinatura Digital</h2>
        <UploadDocument />
      </Content>
    </Container>
  );
};

export default Dashboard;
