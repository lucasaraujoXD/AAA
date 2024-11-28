import React, { useEffect, useState } from 'react';
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
  height: 100%;

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
  overflow-x: auto;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;

  th,
  td {
    padding: 15px;
    text-align: center;
    border: 1px solid ${({ theme }) => theme.text};
    min-width: 200px;
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

  .button-container {
    display: flex;
    justify-content: center;
    gap: 10px;
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

  @media (max-width: 768px) {
    th,
    td {
      padding: 10px;
    }

    button {
      width: 100%;
      margin-top: 15px;
    }
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #222;
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  width: 90%;
  max-width: 500px;

  h3 {
    margin-bottom: 15px;
    text-align: center;
  }

  textarea {
    width: 100%;
    height: 150px;
    margin-bottom: 20px;
    padding: 10px;
    background-color: #333;
    color: #fff;
    border: none;
    border-radius: 4px;
    resize: none;
    box-sizing: border-box;
    font-size: 14px;
  }

  .button-container {
    display: flex;
    justify-content: center;
    gap: 20px;
  }

  button {
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #ffc107;
    color: #000;

    &:hover {
      background-color: #e0a800;
    }
  }
`;

const PendingDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const navigate = useNavigate();

  // Carregar documentos pendentes
  useEffect(() => {
    const fetchPendingDocuments = async () => {
      try {
        const response = await fetch('http://localhost:5000/docs');
        const data = await response.json();

        if (data) {
          const fetchedDocuments = data.map((doc) => ({
            id: doc.id,
            name: doc.fileName,
            reviewDescription: doc.description,
          }));

          setDocuments(fetchedDocuments);
        } else {
          console.error('Estrutura de dados inválida:', data);
        }
      } catch (error) {
        console.error('Erro ao buscar documentos:', error);
      }
    };

    fetchPendingDocuments();
  }, []);

  // Função para salvar a descrição no estado
  const handleSaveDescription = () => {
    if (selectedDoc && rejectionReason) {
      // Atualizar a descrição do documento no estado
      const updatedDocuments = documents.map((doc) =>
        doc.id === selectedDoc.id
          ? { ...doc, reviewDescription: rejectionReason }
          : doc
      );

      setDocuments(updatedDocuments);
      setShowPopup(false);
      setRejectionReason('');
      alert('Descrição salva com sucesso!');
    } else {
      alert('Por favor, insira uma descrição válida!');
    }
  };

  const handleSign = (id) => {
    console.log(`Assinando o documento com id: ${id}`);
    navigate('/dashboard');
  };

  const handleReject = (doc) => {
    setSelectedDoc(doc); // Guarda o documento selecionado
    setRejectionReason(doc.reviewDescription || ''); // Preenche o campo com a descrição atual
    setShowPopup(true);
  };

  const handleSendRejection = () => {
    if (selectedDoc) {
      alert('Mensagem enviada para o elaborador inicial.');
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== selectedDoc.id));
      setShowPopup(false);
    }
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
                <th>Descrição da Revisão</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.name}</td> {/* Nome do Documento */}
                  <td>{doc.reviewDescription}</td> {/* Descrição da Revisão */}
                  <td className="button-container">
                    <button onClick={() => handleSign(doc.id)}>Assinar</button>
                    <button onClick={() => handleReject(doc)}>Reprovar</button>
                  </td> {/* Ações */}
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </ContentContainer>
      {showPopup && (
        <Popup>
          <h3>Motivo da Reprovação</h3>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Digite o motivo da reprovação..."
          />
          <div className="button-container">
            <button onClick={handleSaveDescription}>Salvar Descrição</button>
            <button onClick={handleSendRejection}>Enviar</button>
            <button onClick={() => setShowPopup(false)}>Cancelar</button>
          </div>
        </Popup>
      )}
    </PageContainer>
  );
};

export default PendingDocuments;
