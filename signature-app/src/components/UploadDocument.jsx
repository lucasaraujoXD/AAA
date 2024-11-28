import { useState, useRef, useEffect } from 'react';
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

// Estilo do pop-up
const PopUpContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopUp = styled.div`
  background: #333;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  text-align: center;
  color: #fff;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 90%;
    padding: 15px;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 150px;
  margin-top: 10px;
  padding: 0px;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: ${({ theme }) => theme.body};
  color: #ccc;
  resize: none;

  &::placeholder {
    color: #888;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    height: 120px;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showPopUp, setShowPopUp] = useState(false);  // Controle do pop-up
  const [description, setDescription] = useState('');  // Texto da revisão
  const sigCanvas = useRef({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      setUserRole(user.role);
    }
  }, []);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
  
    if (selectedFile && /\.(xls|xlsx)$/.test(selectedFile.name)) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
  
      // Exibe o pop-up apenas para usuários de Engenharia
      if (userRole === 'engenharia') {
        setShowPopUp(true);
        return; // Aguardar o fluxo de descrição
      }
  
      // Para outros usuários, salvar apenas o nome do arquivo
      try {
        const response = await fetch('http://localhost:5000/docs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: selectedFile.name,
            description: '', // Sem descrição para outros papéis
          }),
        });
  
        if (response.ok) {
          alert('Arquivo enviado com sucesso.');
        } else {
          console.error('Erro ao salvar o arquivo no banco de dados.');
          alert('Erro ao enviar o arquivo. Tente novamente.');
        }
      } catch (error) {
        console.error('Erro de conexão com o backend:', error);
        alert('Erro ao se conectar ao backend.');
      }
    } else {
      alert('Por favor, selecione um arquivo Excel (.xls ou .xlsx) válido.');
    }
  };
  

  const handleDescriptionSubmit = async () => {
    if (!description.trim()) {
      alert('Por favor, insira uma descrição.');
      return;
    }
  
    if (!file) {
      alert('Nenhum arquivo selecionado.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          description: description.trim(), // Envia a descrição capturada
        }),
      });
  
      if (response.ok) {
        alert('Arquivo e descrição enviados com sucesso.');
        setShowPopUp(false);
        setDescription('');
        // Não reseta o arquivo aqui!
      } else {
        console.error('Erro ao adicionar arquivo no banco de dados');
        alert('Erro ao enviar os dados. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro de conexão com o backend:', error);
      alert('Erro ao se conectar ao backend.');
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
  
        // Agora redefina o arquivo
        setFile(null);
        setFileName('');
      } else {
        alert('Por favor, faça a assinatura antes de salvar.');
      }
    } catch (error) {
      console.error('Erro ao salvar o documento:', error);
      alert('Erro ao salvar o documento.');
    }
  };
  

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePasteSignature = async () => {
    try {
      // Recupera o usuário logado
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Usuário não encontrado.');
        return;
      }

      // Faz a requisição para buscar a assinatura no banco de dados (supondo que você tenha um endpoint para isso)
      const response = await fetch(`http://localhost:5000/signatures?userId=${user.id}&documentId=1`);
      const data = await response.json();

      // Busca a assinatura associada ao userId e documentId
      const signatureFromDB = data.find(item => item.userId === user.id)?.signature;
      if (signatureFromDB) {
        // Se encontrou a assinatura, coloca no canvas
        sigCanvas.current.fromDataURL(signatureFromDB);
      } else {
        alert('Nenhuma assinatura encontrada para o usuário e documento especificados.');
      }
    } catch (error) {
      console.error('Erro ao buscar a assinatura:', error);
      alert('Erro ao buscar a assinatura.');
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

      {showPopUp && (
        <PopUpContainer>
          <PopUp>
            <h4>Descrição das alterações</h4>
            <Textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Digite a descrição das alterações para este documento."
            />
            <ButtonWrapper>
              <Button onClick={handleDescriptionSubmit}>Enviar</Button>
            </ButtonWrapper>
          </PopUp>
        </PopUpContainer>
      )}

      <SignatureContainer>
        <h4>Assinatura do Responsável ({userRole})</h4>
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
        />
        <Button onClick={clearSignature}>Limpar Assinatura</Button>
        <Button onClick={handlePasteSignature}>Colar assinatura</Button>
        <Button onClick={saveWithSignature}>Salvar Documento</Button>
      </SignatureContainer>
    </Container>
  );
};

export default UploadDocument;
