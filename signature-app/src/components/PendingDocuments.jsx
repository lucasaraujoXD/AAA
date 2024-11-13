// src/components/PendingDocuments.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Sidebar from './Sidebar';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;

  /* Altera para layout em linha em telas maiores */
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ContentContainer = styled.div`
  padding: 20px;
  flex: 1;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
`;

const PendingDocuments = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchPendingDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pending-documents');
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching pending documents:', error);
      }
    };

    fetchPendingDocuments();
  }, []);

  return (
    <PageContainer>
      <Sidebar />
      <ContentContainer>
        <h2>Documentos Pendentes</h2>
        <ul>
          {documents.map((doc) => (
            <li key={doc.id}>{doc.name} - {doc.status}</li>
          ))}
        </ul>
      </ContentContainer>
    </PageContainer>
  );
};

export default PendingDocuments;
