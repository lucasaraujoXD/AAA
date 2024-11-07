import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/datawakelogo.png';
import { FaUser, FaSignOutAlt, FaFileUpload, FaClipboardList } from 'react-icons/fa';

const SidebarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 60px;
  background-color: #1c1c1c;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
`;

const LogoContainer = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const IconContainer = styled.div`
  color: #fff;
  font-size: 20px;
  margin: 20px 0;
  cursor: pointer;

  &:hover {
    color: #ffcc00;
  }
`;

const UserInfoPopup = styled.div`
  position: absolute;
  top: 60px;
  left: 70px;
  background-color: #333;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  z-index: 10;

  p {
    margin: 5px 0;
  }
`;

const Sidebar = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const navigate = useNavigate();

  // Pega o usuário do localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleUserInfoPopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <SidebarContainer>
      <LogoContainer>
        <img src={logo} alt="Logo" style={{ maxWidth: '100%' }} />
      </LogoContainer>

      <IconContainer onClick={toggleUserInfoPopup}>
        <FaUser />
      </IconContainer>

      {/* Exibe o popup com nome e cargo do usuário */}
      {isPopupVisible && user && (
        <UserInfoPopup>
          <p><strong>Nome:</strong> {user.re}</p>
          <p><strong>Cargo:</strong> {user.role}</p>
        </UserInfoPopup>
      )}

      <IconContainer>
        <FaFileUpload title="Selecionar Documento" />
      </IconContainer>

      <IconContainer>
        <FaClipboardList title="Documentos Pendentes" />
      </IconContainer>

      <IconContainer onClick={handleLogout}>
        <FaSignOutAlt />
      </IconContainer>
    </SidebarContainer>
  );
};

export default Sidebar;
