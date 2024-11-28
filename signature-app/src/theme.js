import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
  body: '#FFF',
  text: '#000',
  buttonBg: '#FFD700',  // Amarelo forte
  buttonText: '#000',
  sidebarBg: '#f0f0f0',
};

export const darkTheme = {
  body: '#333',
  text: '#fff',
  buttonBg: '#FFD700',  // Amarelo forte
  buttonText: '#000',
  sidebarBg: '#444',
};

export const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: 'Arial', sans-serif;
  }

  button {
    background-color: ${({ theme }) => theme.buttonBg};
    color: ${({ theme }) => theme.buttonText};
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-radius: 5px;
  }

  button:hover {
    background-color: #e0ac00; /* Efeito hover para o botão de amarelo forte */
  }
`;
