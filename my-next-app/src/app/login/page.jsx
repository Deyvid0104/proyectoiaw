'use client'
import React from 'react'
import './estilo.css'
import Card from 'react-bootstrap/Card';

export default function page() {
  return (
    <div className='body_login'>
    <div className='login'>
        <Card><h1 className='h1_login'>Iniciar Sesión</h1>
        <input type="text" id="texto" name="texto" placeholder="Email" />
        <input type="password" id="texto" name="texto" placeholder="Contraseña" />
        <p></p><a href='../cesta/usuario/'><button  className='but_login'>Login</button></a>
        </Card>
    </div></div>
  )
}