import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import ExcelViewerModal from './ExcelViewerModal';
import SignatureCanvas from 'react-signature-canvas';
import styled from 'styled-components';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const Container = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    padding: 10px; /* Menos padding em telas pequenas */
  }
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  width: 100%; /* Garante que o input ocupe a largura total da tela */
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: #ffcc00;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%; /* Botões maiores em telas pequenas */
  
  &:hover {
    background-color: #e6b800;
  }

  @media (max-width: 768px) {
    width: auto; /* Desfaz o efeito de largura total em telas grandes */
  }
`;

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const sigCanvas = useRef({});

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

      if (workbook.worksheets.length === 0) {
        alert('Nenhuma planilha encontrada no arquivo.');
        return;
      }

      const worksheet = workbook.worksheets[0];

      if (sigCanvas.current.getTrimmedCanvas()) {
        const imgData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        const response = await fetch(imgData);
        const buffer = await response.arrayBuffer();

        const img = workbook.addImage({
          buffer,
          extension: 'png',
        });

        worksheet.addImage(img, {
          tl: { col: 0, row: worksheet.rowCount + 3 },
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
        <h4>Assinatura do Responsável</h4>
        <SignatureCanvas ref={sigCanvas} canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
        <Button onClick={clearSignature}>Limpar Assinatura</Button>
        <Button onClick={saveWithSignature}>Salvar com Assinatura</Button>
      </div>
    </Container>
  );
};

export default UploadDocument;
