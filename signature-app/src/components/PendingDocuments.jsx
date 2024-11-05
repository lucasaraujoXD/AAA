// src/components/PendingDocuments.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const DocumentList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const DocumentItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #ccc;
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
    <Container>
      <h2>Documentos Pendentes</h2>
      <DocumentList>
        {documents.map((doc) => (
          <DocumentItem key={doc.id}>
            {doc.name} - {doc.status}
          </DocumentItem>
        ))}
      </DocumentList>
    </Container>
  );
};

export default PendingDocuments;
