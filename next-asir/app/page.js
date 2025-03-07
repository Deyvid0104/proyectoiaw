'use client'
import { FaBasketShopping } from "react-icons/fa6";
import Link from "next/link";
import "./globals.css";
import { IoPersonCircle } from "react-icons/io5";
import Carrusel from "./carrusel/page";
import Productos from "./productos/page";

export default function HomePage() {
  return (
    <div className="container">
      <header>
        <nav>
          <h1>TechStore</h1>
          <input type="text" id="texto" name="texto" placeholder="Buscar productos..." />
          <div className="nav-links">
            <Link href="/"><IoPersonCircle />Mi cuenta</Link>
            <Link href="/"><FaBasketShopping />Mi cesta</Link>
          </div>
        </nav>
      </header>

      <main>
        <div className="divC">
          <Carrusel />
        </div>
        
        <section className="productos-section">
          <h2>Productos Destacados</h2>
          <Productos />
        </section>
      </main>
    </div>
  );
}
