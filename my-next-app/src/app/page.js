'use client'
import Link from "next/link";
import "./globals.css";
import { IoPersonCircle } from "react-icons/io5";
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carrusel from "./carrusel/page";

export default function Home() {
  return (
    <div className="global">
      <header>
        <div className="head">
          <a href="/" className="inicio"><h1>TechStore</h1></a>
          <input type="text" id="texto" name="texto" placeholder="Busca aqui..." />
          <h3><Link href="./login"><IoPersonCircle />Login</Link><p></p>
          <Link href="./regis"><IoPersonCircle />Registrer</Link></h3>
        </div><hr/><nav><Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Categoría
          </Dropdown.Toggle>
          <Dropdown.Menu id="dropdown-menu">
            <Dropdown.Item href="./categoria/ordenadores">
              <button >
                Ordenadores
              </button>
            </Dropdown.Item>
            <Dropdown.Item href="./categoria/moviles">
              <button >
                Moviles
              </button>
            </Dropdown.Item>
            <Dropdown.Item href="./categoria/componentes">
              <button >
                Componentes
              </button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Nuestro equipo
          </Dropdown.Toggle>
          <Dropdown.Menu id="dropdown-menu">
            <Dropdown.Item href="./about/Fabio">
              <button >
                Fabio
              </button>
            </Dropdown.Item>
            <Dropdown.Item href="./about/Deyvid">
              <button >
                Deyvid
              </button>
            </Dropdown.Item>
            <Dropdown.Item href="./about/Kevin">
              <button >
                Kevin
              </button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown></nav></header>
      <main><section><div className="divC">
          <Carrusel />
        </div></section></main>
    </div>
  );
}
