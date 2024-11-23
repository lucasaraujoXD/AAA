import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ContentContainer = styled.div`
  padding: 20px;
  flex: 1;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  height: 100%;  /* Garantindo que ocupe toda a altura da tela */

  h2 {
    text-align: center;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;  /* Permite rolagem horizontal quando necessário */
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;  /* Define a largura mínima da tabela */

  th,
  td {
    padding: 15px;
    text-align: center;
    border: 1px solid ${({ theme }) => theme.text};
    min-width: 200px; /* Aumenta a largura mínima das células para mais espaço */
  }

  th {
    background-color: #222;
    color: #ffcc00;
  }

  tr:nth-child(odd) {
    background-color: #333;
  }

  tr:nth-child(even) {
    background-color: #444;
  }

  td {
    vertical-align: middle;
  }

  button {
    padding: 12px 20px;
    background-color: #ffcc00;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
      background-color: #e6b800;
    }
  }

  /* Responsividade para telas menores */
  @media (max-width: 768px) {
    th, td {
      padding: 10px;
    }

    button {
      width: 100%;
      margin-top: 15px;
    }
  }
`;

const PendingDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingDocuments = async () => {
      try {
        const simulatedDocuments = [
          { id: 1, name: 'FTP001 - Teste de estanqueidade' },
          { id: 2, name: 'FTP002 - Montagem de componentes' },
          { id: 3, name: 'FTP003 - Injeção' },
          { id: 4, name: 'FTP004 - Refile' },
          { id: 5, name: 'FTP005 - Embalagem' },
          { id: 6, name: 'FTP006 - Montagem de flexguard' },
          { id: 7, name: 'FTP007 - Lavadora' },
          { id: 8, name: 'FTP008 - Kneader' },
          { id: 9, name: 'FTP009 - Extrusão' },
          { id: 10, name: 'FTP010 - Espumação' },
        ];
        setDocuments(simulatedDocuments);
      } catch (error) {
        console.error('Error fetching pending documents:', error);
      }
    };

    fetchPendingDocuments();
  }, []);

  const handleSign = () => {
    navigate('/dashboard');
  };

  return (
    <PageContainer>
      <Sidebar />
      <ContentContainer>
        <h2>Documentos Pendentes</h2>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Nome do Documento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.name}</td>
                  <td>
                    <button onClick={handleSign}>Assinar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default PendingDocuments;
