'use client';
import React, { useState } from 'react';
import './estilo.css';
import Card from 'react-bootstrap/Card';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://143.47.56.237:3000/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const data = await response.json();
      if (data.message === 'Login exitoso') {
        localStorage.setItem('user', JSON.stringify(data.usuarios));

        if (data.usuarios.role === 'admin') {
          window.location.href = '../cesta/admin';
        } else if (data.usuarios.role === 'usuario') {
          window.location.href = '../cesta/usuario';
        }
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error al realizar el login:', error);
      setErrorMessage('Hubo un error al intentar iniciar sesión');
    }
  };

  return (
    <div className='body_login'>
      <div className='login'>
        <Card>
          <h1 className='h1_login'>Iniciar Sesión</h1>
          <input
            type="email" 
            id="texto"
            name="texto"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="texto"
            name="texto"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <p className="error">{errorMessage}</p>}
          <p></p>
          <button className='but_login' onClick={handleLogin}>Login</button>
          <a href='/'><button className='but_volver'>Volver</button></a>
        </Card>
      </div>
    </div>
  );
}
