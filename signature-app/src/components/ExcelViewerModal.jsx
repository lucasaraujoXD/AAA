import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Modal from 'react-modal';
import styled from 'styled-components';

const ModalContent = styled.div`
  padding: 20px;
  max-height: 80vh;
  overflow-y: auto;
  background: white;
  color: black;
  width: 90%;
  margin: auto;
  border-radius: 8px;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
`;

const TableCell = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
`;

const ExcelViewerModal = ({ file, isOpen, onClose }) => {
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState(0);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const loadedSheets = workbook.SheetNames.map((name, index) => ({
          name,
          data: XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1, defval: '' })
        }));
        setSheets(loadedSheets);
      };
      reader.readAsArrayBuffer(file);
    }
  }, [file]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Excel Viewer" ariaHideApp={false}>
      <ModalContent>
        <h2>Visualizador de Excel</h2>
        <div>
          {sheets.map((sheet, index) => (
            <button key={index} onClick={() => setActiveSheet(index)} style={{ margin: '0 10px' }}>
              {sheet.name}
            </button>
          ))}
        </div>
        <Table>
          <tbody>
            {sheets[activeSheet] &&
              sheets[activeSheet].data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </tr>
              ))}
          </tbody>
        </Table>
        <button onClick={onClose}>Fechar</button>
      </ModalContent>
    </Modal>
  );
};

export default ExcelViewerModal;
