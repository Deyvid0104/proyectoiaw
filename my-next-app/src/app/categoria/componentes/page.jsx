'use client'
import Link from "next/link";
import "../../globals.css";
import { IoPersonCircle } from "react-icons/io5";
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  return (
    <div className="global">
      <header>
        <nav>
        <a href="/" className="inicio"><h1>TechStore</h1></a>
          <input type="text" id="texto" name="texto" placeholder="Busca aqui..." />
          <h3><Link href="./login"><IoPersonCircle />Login</Link><p></p>
          <Link href="./regis"><IoPersonCircle />Registrer</Link></h3>
        </nav></header>
      <main><aside>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Categoría
          </Dropdown.Toggle>
          <Dropdown.Menu id="dropdown-menu">
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
                Componentes
              </button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        
      </aside><section><div className="divC">
        </div></section></main>
        <footer><h2 className="link_about"><Link href="../../about">Nuestro equipo</Link></h2></footer>
    </div>
  );
}
