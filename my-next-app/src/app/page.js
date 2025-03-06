'use client'
import Link from "next/link";
import "./globals.css";
import { IoPersonCircle } from "react-icons/io5";
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  return (
    <div>
      <header>
        <nav>
          <h1>Tienda en desarrollo</h1>
          <input type="text" id="texto" name="texto" placeholder="Busca aqui..." />
          <h3><Link href="./login"><IoPersonCircle />Login</Link><p></p>
          <Link href="/"><IoPersonCircle />Registrer</Link></h3>
        </nav></header>
      <main><aside>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Categoría
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>
              <button >
                Ordenadores
              </button>
            </Dropdown.Item>
            <Dropdown.Item>
              <button >
                Moviles
              </button>
            </Dropdown.Item>
            <Dropdown.Item>
              <button >
                Teléfonos
              </button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <h2><Link href="./about">About</Link></h2>
      </aside><section><h1>Prueba</h1></section></main>
    </div>
  );
}
