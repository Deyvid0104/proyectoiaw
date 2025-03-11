'use client'
import Link from "next/link";
import { IoPersonCircle } from "react-icons/io5";
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carrusel from "../../carrusel/page";

export default function Home() {
  return (
    <div>
      <header>
        <nav>
        <a href="/" className="inicio"><h1>TechStore</h1></a>
          <input type="text" id="texto" name="texto" placeholder="Busca aqui..." />
          <h3><Link href="/"><IoPersonCircle />Cerrar sesión</Link></h3>
          <h3><Dropdown>
          <Dropdown.Toggle variant="success" id="cesta-basic">
            <h4>Mi cesta</h4>
          </Dropdown.Toggle>
          <Dropdown.Menu id="cesta-menu">
            <Dropdown.Item>
              <button >
                Ordenadores
              </button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown></h3>
        </nav></header>
      <main><aside>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Categoría
          </Dropdown.Toggle>
          <Dropdown.Menu id="dropdown-menu">
            <Dropdown.Item href="./categoria usuario/ordenadores">
              <button >
                Ordenadores
              </button>
            </Dropdown.Item>
            <Dropdown.Item href="./categoria usuario/moviles">
              <button >
                Moviles
              </button>
            </Dropdown.Item>
            <Dropdown.Item href="./categoria usuario/componentes">
              <button >
                Componentes
              </button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        
      </aside><section><div className="divC">
          <Carrusel />
        </div></section></main>
        <footer><h2 className="link_about"><Link href="../../about">Nuestro equipo</Link></h2></footer>
    </div>
  );
}
