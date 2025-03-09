import React from 'react'
import './estilo.css'
import Card from 'react-bootstrap/Card';

export default function page() {
  return (
    <div className='body_regis'>
    <div className='regis'>
        <Card><h1 className='h1_regis'>Crear cuenta</h1>
        <input type="text" id="texto" name="texto" placeholder="Username" />
        <input type="text" id="texto" name="texto" placeholder="Email" />
        <input type="password" id="texto" name="texto" placeholder="contraseña" />
        <input type="password" id="texto" name="texto" placeholder="Repetir contraseña" />
        <p></p><button className='but_regis'>Register</button>
        </Card>
    </div>
    </div>
    
  )
}
