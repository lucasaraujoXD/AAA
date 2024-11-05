import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/datawakelogo.png';

const SidebarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 250px;
  background-color: ${({ theme }) => theme.sidebarBg};
  transition: transform 0.3s ease;
  transform: ${({ visible }) => (visible ? 'translateX(0)' : 'translateX(-100%)')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
`;

const LogoContainer = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const UserName = styled.h3`
  margin: 20px 0;
  color: ${({ theme }) => theme.text};
`;

const UserRole = styled.p`
  color: ${({ theme }) => theme.text};
`;

const LogoutButton = styled.button`
  margin-top: 10px;
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

const ArrowIcon = styled.div`
  position: absolute;
  right: -20px;
  top: 20px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
`;

const Sidebar = ({ visible, onToggle, user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <SidebarContainer visible={visible}>
        <LogoContainer>
          <img src={logo} alt="Logo" style={{ maxHeight: '100%' }} />
        </LogoContainer>
        <UserName>{user.re}</UserName>
        <UserRole>{user.role}</UserRole> {/* Mostra a função do usuário */}
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </SidebarContainer>
      <ArrowIcon onClick={onToggle}>➡️</ArrowIcon>
    </>
  );
};

export default Sidebar;
