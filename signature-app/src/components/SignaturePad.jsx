import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';

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
    <div>
      <h3>Assinatura do Responsável</h3>
      <SignatureCanvas ref={sigCanvas} canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
      <button onClick={clear}>Limpar</button>
      <button onClick={save}>Salvar Assinatura</button>
      {trimmedDataURL ? <img src={trimmedDataURL} alt="signature" /> : null}
    </div>
  );
};

export default SignaturePad;
