import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';

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
  width: 100%;

  &:hover {
    background-color: #e6b800;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 8px;
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
      console.error('Erro ao salvar:', error);
    }
  };

  return (
    <SignatureWrapper>
      <h3>Assinatura Digital</h3>
      <SignatureCanvas
        ref={sigCanvas}
        canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
      />
      <Button onClick={clear}>Limpar</Button>
      <Button onClick={save}>Salvar Assinatura</Button>
      {trimmedDataURL && <img src={trimmedDataURL} alt="Assinatura" />}
    </SignatureWrapper>
  );
};

export default SignaturePad;
