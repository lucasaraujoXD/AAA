import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';
import styled from 'styled-components';

const SignatureWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;

  @media (max-width: 768px) {
    padding: 5px;
  }
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: #ffcc00;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%; /* Botões mais largos em telas pequenas */
  
  &:hover {
    background-color: #e6b800;
  }

  @media (max-width: 768px) {
    width: auto; /* Desfaz o efeito de largura total em telas grandes */
  }
`;

const SignaturePad = () => {
  const sigCanvas = useRef({});
  const [trimmedDataURL, setTrimmedDataURL] = useState(null);

  const clear = () => sigCanvas.current.clear();

  const save = async () => {
    const signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    setTrimmedDataURL(signature);

    try {
      await axios.post('http://localhost:5000/signatures', { signature });
      alert('Assinatura salva com sucesso!');
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  return (
    <SignatureWrapper>
      <h3>Assinatura do Responsável</h3>
      <SignatureCanvas ref={sigCanvas} canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
      <Button onClick={clear}>Limpar</Button>
      <Button onClick={save}>Salvar Assinatura</Button>
      {trimmedDataURL ? <img src={trimmedDataURL} alt="signature" /> : null}
    </SignatureWrapper>
  );
};

export default SignaturePad;
