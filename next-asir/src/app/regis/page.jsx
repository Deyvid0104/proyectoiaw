"use client";
import React, { useState } from 'react';
import './estilo.css';
import Card from 'react-bootstrap/Card';
import { useRouter } from 'next/navigation'; // Importa el hook useRouter

export default function Page() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    direccion: '',
    telefono: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // Inicializa el hook para la redirección

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    // Validación básica para asegurarse de que todos los campos están completos
    return Object.values(formData).every(field => field.trim() !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMessage('Por favor, complete todos los campos.');
      return;
    }

    setErrorMessage('');
    setLoading(true); // Activar el estado de carga

    try {
      // Realiza la solicitud POST para enviar los datos al backend
      const response = await fetch('http://143.47.56.237:3000/usuarios/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al registrar usuario: ${errorData.message || 'Desconocido'}`);
      }

      const data = await response.json();
      console.log('Usuario registrado:', data);

      router.push('../login'); // Redirige al login después de un registro exitoso
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error al registrar usuario:', error);
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  return (
    <div className="body_regis">
      <div className="regis">
        <Card>
          <h1 className="h1_regis">Crear cuenta</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="apellido"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="direccion"
                name="direccion"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="telefono"
                name="telefono"
                placeholder="Número de Teléfono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <button type="submit" className="but_regis" disabled={loading}>
           
              {loading ? 'Cargando...' : 'Registrar'}
            </button> 
            
          </form>
          <a href='/'><button className='but_volver' >Volver</button></a>
        </Card>
      </div>
    </div>
  );
}
