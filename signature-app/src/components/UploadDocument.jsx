import React, { useState, useRef, useEffect } from 'react';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import styled from 'styled-components';
import ExcelViewerModal from './ExcelViewerModal';
import SignatureCanvas from 'react-signature-canvas';

const Container = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
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
`;

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const sigCanvas = useRef({});
  const [userRole, setUserRole] = useState('');

  // Obtém o cargo do usuário logado
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      setUserRole(user.role);
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && /\.(xls|xlsx)$/.test(selectedFile.name)) {
      setFile(selectedFile);
      setShowModal(true);
    } else {
      alert('Por favor, selecione um arquivo Excel (.xls ou .xlsx) válido.');
    }
  };

  const clearSignature = () => sigCanvas.current.clear();

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

      const columnToPlaceSignature = columnMapping[userRole] || 4; // Padrão para engenharia

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
      <h3>Selecionar Documento</h3>
      <Input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
      <ExcelViewerModal file={file} isOpen={showModal} onClose={() => setShowModal(false)} />
      <div>
        <h4>Assinatura do Responsável ({userRole})</h4>
        <SignatureCanvas ref={sigCanvas} canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
        <Button onClick={clearSignature}>Limpar Assinatura</Button>
        <Button onClick={saveWithSignature}>Salvar com Assinatura</Button>
      </div>
    </Container>
  );
};

export default UploadDocument;
