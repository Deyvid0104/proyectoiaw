import React from 'react'
import '../estilo.css'
import Card from 'react-bootstrap/Card';
import Link from "next/link"

export default function page() {
  return (
    <div className='body_about'>
      <div>
        <h1 className='top_autor'>Creadores de la página web</h1>
        <div className='about'>
          <Card><h1 className='autor'>Fabio</h1><hr /><h4>Nombre completo: Fabio Fábrega da Silva</h4>
            <h3>Edad: 19 años</h3></Card>
        </div>
        <h2 className='bot_autor'><Link href="/">Volver</Link></h2>
      </div></div>
  )
}
