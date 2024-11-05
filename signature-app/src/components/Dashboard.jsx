// src/components/Dashboard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import UploadDocument from './UploadDocument';
import Sidebar from './Sidebar';
import PendingDocuments from './PendingDocuments';  // Importando o novo componente

const Container = styled.div`
  padding: 20px;
  position: relative;
`;

const Dashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <Container>
      <Sidebar visible={sidebarVisible} onToggle={toggleSidebar} user={user} />
      <h2>Dashboard</h2>
      <UploadDocument />
      <PendingDocuments />  {/* Adicionando o componente de documentos pendentes */}
    </Container>
  );
};

export default Dashboard;
