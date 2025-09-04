import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// Estilos globales para el formulario
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

// Componentes estilizados
const FormContainer = styled.div`
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  margin: 20px auto;
  font-family: 'Poppins', sans-serif;
  color: white;
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 25px;
  font-weight: 600;
  font-size: 28px;
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
`;

const Input = styled.input`
  padding: 14px 16px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:focus {
    outline: none;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  gap: 15px;
`;

const Button = styled.button`
  padding: 14px 25px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #333;
  
  &:hover {
    background: linear-gradient(135deg, #38f9d7 0%, #43e97b 100%);
  }
`;

const CancelButton = styled(Button)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ContactForm = ({ contact, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    direccion: '',
    celular: '',
    correo: ''
  });

  useEffect(() => {
    if (contact) {
      // Formatear la fecha para el input type="date" (YYYY-MM-DD)
      const fecha = contact.fecha_nacimiento 
        ? new Date(contact.fecha_nacimiento).toISOString().split('T')[0]
        : '';
      
      setFormData({
        nombres: contact.nombres || '',
        apellidos: contact.apellidos || '',
        fecha_nacimiento: fecha,
        direccion: contact.direccion || '',
        celular: contact.celular || '',
        correo: contact.correo || ''
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <GlobalStyle />
      <FormContainer>
        <FormTitle>{contact ? 'Editar Contacto' : 'Nuevo Contacto'}</FormTitle>
        <StyledForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nombres:</Label>
            <Input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              placeholder="Ingresa los nombres"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Apellidos:</Label>
            <Input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              placeholder="Ingresa los apellidos"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Fecha de Nacimiento:</Label>
            <Input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Dirección:</Label>
            <Input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Ingresa la dirección"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Celular:</Label>
            <Input
              type="tel"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              placeholder="Ingresa el número de celular"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Correo:</Label>
            <Input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="Ingresa el correo electrónico"
            />
          </FormGroup>
          
          <FormActions>
            <CancelButton type="button" onClick={onCancel}>Cancelar</CancelButton>
            <SubmitButton type="submit">Guardar</SubmitButton>
          </FormActions>
        </StyledForm>
      </FormContainer>
    </>
  );
};

export default ContactForm;