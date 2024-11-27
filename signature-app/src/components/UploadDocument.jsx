import React, { useState, useRef, useEffect } from 'react';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import styled from 'styled-components';
import SignatureCanvas from 'react-signature-canvas';

// Estilos para o container, título, botões, etc.
const Container = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  max-width: 100%;
  box-sizing: border-box;
  text-align: center;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Title = styled.h3`
  margin-bottom: 20px;
`;

const FileInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  width: 100%;
`;

const FileInputLabel = styled.label`
  padding: 10px;
  background-color: #ffcc00;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  width: 100%;

  &:hover {
    background-color: #e6b800;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 8px;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileName = styled.p`
  margin-top: 10px;
  font-size: 0.9rem;
  text-align: center;
  word-break: break-word;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: #ffcc00;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #e6b800;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 8px;
  }
`;

const SignatureContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  canvas {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    h4 {
      font-size: 1rem;
      text-align: center;
    }
  }
`;

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [savedSignature, setSavedSignature] = useState(null); // Armazena a assinatura salva
  const sigCanvas = useRef({});

  // Obtém o papel do usuário e a assinatura salva no banco ao carregar o componente
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      setUserRole(user.role);

      // Busca a assinatura salva no banco
      fetch(`http://localhost:5000/signatures?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            setSavedSignature(data[0].signature); // Salva a assinatura existente
          }
        })
        .catch((err) => console.error('Erro ao buscar assinatura:', err));
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && /\.(xls|xlsx)$/.test(selectedFile.name)) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      alert('Por favor, selecione um arquivo Excel (.xls ou .xlsx) válido.');
    }
  };

  const clearSignature = () => sigCanvas.current.clear();

  const saveSignatureToDatabase = () => {
    const trimmedSignature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!trimmedSignature || !user) {
      alert('Por favor, faça a assinatura antes de salvar.');
      return;
    }

    fetch(`http://localhost:5000/signatures?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          // Atualiza a assinatura existente
          fetch(`http://localhost:5000/signatures/${data[0].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...data[0],
              signature: trimmedSignature,
            }),
          }).then(() => {
            alert('Assinatura atualizada com sucesso!');
            setSavedSignature(trimmedSignature);
          });
        } else {
          // Salva uma nova assinatura
          fetch('http://localhost:5000/signatures', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              signature: trimmedSignature,
            }),
          }).then(() => {
            alert('Assinatura salva com sucesso!');
            setSavedSignature(trimmedSignature);
          });
        }
      });
  };

  const loadSavedSignature = () => {
    if (savedSignature) {
      const img = new Image();
      img.src = savedSignature;
      img.onload = () => {
        const canvas = sigCanvas.current.getCanvas();
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    } else {
      alert('Nenhuma assinatura salva foi encontrada.');
    }
  };

  const saveWithSignature = async () => {
    if (!file) {
      alert('Por favor, carregue um arquivo antes de salvar.');
      return;
    }

    try {
      const data = new Uint8Array(await file.arrayBuffer());
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(data);

      const worksheet = workbook.getWorksheet('INSTRUÇÃO CONTROLE');
      if (!worksheet) {
        alert('A planilha "instrução de controle" não foi encontrada no arquivo.');
        return;
      }

      const lastRow = worksheet.lastRow;
      if (!lastRow) {
        alert('Nenhuma linha encontrada na planilha "instrução de controle".');
        return;
      }

      const columnMapping = {
        engenharia: 4,
        manufatura: 18,
        qualidade: 24,
      };

      const columnToPlaceSignature = columnMapping[userRole] || 4;

      if (sigCanvas.current.getTrimmedCanvas()) {
        const imgData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        const response = await fetch(imgData);
        const buffer = await response.arrayBuffer();

        const img = workbook.addImage({
          buffer,
          extension: 'png',
        });

        const lastRowNumber = lastRow.number;
        worksheet.addImage(img, {
          tl: { col: columnToPlaceSignature - 1, row: lastRowNumber - 2 },
          ext: { width: 150, height: 50 },
        });

        const updatedBuffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([updatedBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'DocumentoAssinado.xlsx');
        alert('Documento salvo com a assinatura!');
      } else {
        alert('Por favor, faça a assinatura antes de salvar.');
      }
    } catch (error) {
      console.error('Erro ao salvar o documento:', error);
      alert('Erro ao salvar o documento.');
    }
  };

  return (
    <Container>
      <FileInputContainer>
        <FileInputLabel>
          Escolher Arquivo
          <HiddenInput type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
        </FileInputLabel>
        {fileName && <FileName>Arquivo selecionado: {fileName}</FileName>}
      </FileInputContainer>

      <SignatureContainer>
        <h4>Assinatura do Responsável ({userRole})</h4>
        <SignatureCanvas ref={sigCanvas} canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
        <Button onClick={clearSignature}>Limpar Assinatura</Button>
        <Button onClick={saveWithSignature}>Salvar Documento</Button>
        <Button onClick={loadSavedSignature}>Usar Assinatura Salva</Button>
      </SignatureContainer>
    </Container>
  );
};

export default UploadDocument;
