import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import * as ExcelJS from 'exceljs';

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
  background-color: ${({ $bgColor }) => $bgColor || 'white'};
  color: ${({ $fontColor }) => $fontColor || 'black'};
  font-weight: ${({ $bold }) => ($bold ? 'bold' : 'normal')};
  vertical-align: ${({ $verticalAlign }) => $verticalAlign || 'middle'};
`;

const ImageCell = styled.td`
  width: 100px; /* Ajuste conforme necessário */
  height: 100px; /* Ajuste conforme necessário */
  background-color: #f3f3f3;
  text-align: center;
  vertical-align: middle;
`;

const ExcelViewerModal = ({ file, isOpen, onClose }) => {
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState(0);

  useEffect(() => {
    const loadExcelFile = async () => {
      if (file) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(await file.arrayBuffer());

        const loadedSheets = workbook.worksheets.map((worksheet) => {
          const sheetData = [];
          const merges = worksheet.merges || []; // Garantir que merges seja um array vazio, se não existir

          worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
            const rowData = [];
            row.eachCell({ includeEmpty: true }, (cell, cellIndex) => {
              let cellValue;
              let image = null;

              // Lidar com imagens
              if (cell.value && typeof cell.value === 'object') {
                if (cell.value.richText) {
                  cellValue = cell.value.richText.map((item) => item.text).join('');
                } else if (cell.value instanceof Date) {
                  cellValue = cell.value.toLocaleDateString();
                } else {
                  cellValue = cell.value.toString();
                }

                // Se o conteúdo da célula for uma imagem
                if (cell.value.type === 'image') {
                  image = cell.value.imageId; // A referência à imagem
                }
              } else {
                cellValue = cell.value;
              }

              // Verificar se a célula é mesclada
              const isMerged = merges.some((merge) => {
                return (
                  merge.top <= rowIndex &&
                  merge.bottom >= rowIndex &&
                  merge.left <= cellIndex &&
                  merge.right >= cellIndex
                );
              });

              const cellData = {
                value: cellValue,
                bgColor: cell.fill?.fgColor?.argb ? `#${cell.fill.fgColor.argb.slice(2)}` : undefined,
                fontColor: cell.font?.color?.argb ? `#${cell.font.color.argb.slice(2)}` : undefined,
                bold: cell.font?.bold,
                merge: isMerged, // Marca se a célula está mesclada
                image: image, // Referência de imagem
                rowSpan: isMerged ? (merge.top === rowIndex ? merge.bottom - rowIndex + 1 : 1) : 1,
                colSpan: isMerged ? (merge.left === cellIndex ? merge.right - cellIndex + 1 : 1) : 1,
              };

              rowData.push(cellData);
            });
            sheetData.push(rowData);
          });

          return { name: worksheet.name, data: sheetData };
        });

        setSheets(loadedSheets);
      }
    };

    loadExcelFile();
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
            {sheets[activeSheet]?.data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  cell.image ? (
                    <ImageCell key={cellIndex}>
                      {/* Mostrar imagem se disponível */}
                      <img
                        src={`data:image/png;base64,${cell.image}`} // Substitua com o caminho correto da imagem
                        alt={`Image ${rowIndex}-${cellIndex}`}
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                      />
                    </ImageCell>
                  ) : (
                    <TableCell
                      key={cellIndex}
                      $bgColor={cell.bgColor}
                      $fontColor={cell.fontColor}
                      $bold={cell.bold}
                      rowSpan={cell.rowSpan} // Usando a propriedade rowSpan
                      colSpan={cell.colSpan} // Usando a propriedade colSpan
                    >
                      {cell.value || ''}
                    </TableCell>
                  )
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
