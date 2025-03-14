'use client'
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Card from 'react-bootstrap/Card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://143.47.56.237:3000/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.access_token);
      const decodedToken = JSON.parse(atob(response.data.access_token.split('.')[1]));
      
      if (decodedToken.rol === 'admin') {
        router.push('../cesta/admin');
      } else if (decodedToken.rol === 'usuario') {
        router.push('../cesta/usuario');
      }
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className='body_login'>
      <div className='login'>
        <Card><h1 className='h1_login'>Iniciar sessión</h1>
      <form onSubmit={handleLogin}>
        <div>
          <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <input type="password" value={password} placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className='but_login' type="submit">Login</button>
        
      </form>
      
      <a href='/'><button className='but_volver'>Volver</button></a>
      {error && <p>{error}</p>}</Card></div>
    </div>
  );
}
