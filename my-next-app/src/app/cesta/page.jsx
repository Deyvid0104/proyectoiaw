'use client'
import React from 'react'
import './estilo.css'
import Card from 'react-bootstrap/Card';

export default function page() {
  return (
    <div className='body_cesta'>
        <Card>
        <a href='./cesta/usuario/'><button  className='but_cesta'>volver</button></a>
        </Card>
    </div>
  )
}