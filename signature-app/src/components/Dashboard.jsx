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
  width: 100%;
  box-sizing: border-box;
  
  /* Responsividade */
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Content = styled.div`
  flex: 1;
  margin-left: 60px;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 10px;
  }

  h2 {
    font-size: 1.8rem;
    margin-bottom: 20px;
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
