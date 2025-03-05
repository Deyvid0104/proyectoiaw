'use client'
import { FaBasketShopping } from "react-icons/fa6";
import Link from "next/link";
import "./globals.css";
import { IoPersonCircle } from "react-icons/io5";
export default function Home() {
  return (
    <html lang="en">
        <header>
          <nav>
            <h1>Tienda en desarrollo</h1>
            <input type="text" id="texto" name="texto" placeholder="Busca aqui..." />
            <h3><Link href="/"><IoPersonCircle/>Mi cuenta</Link><p>
              </p><Link href="/"><FaBasketShopping/>Mi cesta</Link></h3>
          </nav></header>
         <main><aside>
            <h2>prueba</h2>
          </aside></main>
        <body>
      </body>
    </html>
  );
}
