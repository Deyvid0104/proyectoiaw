import React from 'react'
import './estilo.css'
import Card from 'react-bootstrap/Card';

export default function page() {
  return (
    <div className='body_regis'>
    <div className='regis'>
        <Card><h1 className='h1_regis'>Crear cuenta</h1>
        <input type="text" id="texto" name="texto" placeholder="Nombre" />
        <input type="text" id="texto" name="texto" placeholder="Apellido" />
        <input type="text" id="texto" name="texto" placeholder="Email" />
        <input type="password" id="texto" name="texto" placeholder="contraseña" />
        <input type="text" id="texto" name="texto" placeholder="direccion" />
        <input type="text" id="texto" name="texto" placeholder="telefono" />
        <p></p><a href='../cesta/usuario'><button className='but_regis'>Register</button></a>
        </Card>
    </div>
    </div>
    
  )
}
