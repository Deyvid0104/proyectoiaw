'use client'
import { FaBasketShopping } from "react-icons/fa6";
import Link from "next/link";
import "./globals.css";
import { IoPersonCircle } from "react-icons/io5";
import Carrusel from "./carrusel/page";

  async function getLibros() {
  const res = await fetch("http://localhost:4000/libro");
  if (!res.ok) throw new Error("Failed to fetch libros");
  return res.json();
}

export default async function RootLayout() {
  const libros = await getLibros();

  return (
    <html>
      <body >
        <header>
          <nav>
            <h1>Tienda en desarrollo</h1>
            <input type="text" id="texto" name="texto" placeholder="Busca aqui..." />
            <h3><Link href="/"><IoPersonCircle/>Mi cuenta</Link><p></p><Link href="/"><FaBasketShopping/>Mi cesta</Link></h3>
          </nav>
        </header>
        <div className="divC"><Carrusel/></div>
        <div>
        {libros.map((libro) => (
          <Link href={`/bibliotecatic/libros/${libro.id}`} key={libro.id}>
                <img className="product-img"src={libro.portadaUrl || "/file.svg"} alt={libro.titulo} />
                <h4>{libro.titulo}</h4>
                <p>{libro.autor?.nombre && `Autor: ${libro.autor.nombre}`}</p>
          </Link>
        ))}
      </div>
      </body>
    </html>
  );
}