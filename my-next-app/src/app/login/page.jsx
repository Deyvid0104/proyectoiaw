'use client'
import React, { useState } from 'react';
import './estilo.css';
import Card from 'react-bootstrap/Card';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    // Realizamos la solicitud POST al backend de NestJS
    const response = await fetch('http://143.47.56.237:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    
    // Si el mensaje de la respuesta es 'Login exitoso'
    if (data.message === 'Login exitoso') {
      // Aquí puedes almacenar un token JWT en el localStorage si lo necesitas
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'admin') {
        window.location.href = '../cesta/admin'; // Redirigir a la página de admin
      } else if (data.user.role === 'usuario') {
        window.location.href = '../cesta/usuario'; // Redirigir a la página de usuario
      }
    } else {
      setErrorMessage(data.message); // Mostrar el mensaje de error si el login falla
    }
  };

  return (
    <div className='body_login'>
      <div className='login'>
        <Card>
          <h1 className='h1_login'>Iniciar Sesión</h1>
          <input
            type="text"
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
          <a href='/'><button className='but_volver' >Volver</button></a>
        </Card>
      </div>
    </div>
  );
}
