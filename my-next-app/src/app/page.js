'use client'; // Esto convierte el componente en un cliente
import { useEffect, useState } from "react";
import { FaEuroSign } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carrusel from "./carrusel/page";
import Link from "next/link";
import "./globals.css";

// Función para obtener productos
async function getProductos() {
  try {
    const res = await fetch("http://143.47.56.237:3000/productos");
    if (!res.ok) {
      throw new Error("Failed to fetch productos");
    }
    return res.json();
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return null;
  }
}

// Navbar
const Navbar = () => (
  <header>
    <div className="head">
      <Link href="/" className="inicio"><h1>TechStore</h1></Link>
      <input type="text" id="texto" name="texto" placeholder="Busca aquí..." aria-label="Buscar productos" />
      <h3>
        <Link href="./login"><IoPersonCircle />Login</Link><p></p>
        <Link href="./regis"><IoPersonCircle />Registrar</Link>
      </h3>
    </div>
    <hr className="hr_global" />
    <nav>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Categoría
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="./categoria/ordenadores"><button>Ordenadores</button></Dropdown.Item>
          <Dropdown.Item href="./categoria/moviles"><button>Móviles</button></Dropdown.Item>
          <Dropdown.Item href="./categoria/componentes"><button>Componentes</button></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Nuestro equipo
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="./about/Fabio"><button>Fabio</button></Dropdown.Item>
          <Dropdown.Item href="./about/Deyvid"><button>Deyvid</button></Dropdown.Item>
          <Dropdown.Item href="./about/Kevin"><button>Kevin</button></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </nav>
  </header>
);

const Producto = ({ producto, onVerDetalle }) => (
  <div className="div_producto">
    <img className="producto-imagen" src={producto?.imagen || "/file.svg"} alt={producto?.nombre || "Imagen del producto"} />
    <h2 className="producto-nombre">{producto?.nombre}</h2>
    <p className="producto-descripcion">{producto?.descripcion}</p>
    <p className="producto-precio">{producto?.precio} <FaEuroSign /></p>
    <button onClick={() => onVerDetalle(producto)}>Ver detalles</button>
  </div>
);

const ProductoDetalle = ({ producto, onCerrarDetalle }) => (
  <div className="producto-detalles">
    <h2>Detalles del producto</h2>
    <img className="img_detalle" src={producto?.imagen || "/file.svg"} alt={producto?.nombre || "Imagen del producto"} />
    <div className="producto-info">
      <h1>{producto?.nombre}</h1>
      <p>{producto?.descripcion}</p>
      <p className="producto-precio">Precio: {producto?.precio} <FaEuroSign /></p>
    </div>
    <button className="cerrar-btn" onClick={onCerrarDetalle}>Cerrar detalle</button>
  </div>
);

export default function Home() {
  const [productos, setProductos] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      const productosData = await getProductos();
      setProductos(productosData);
    };

    fetchProductos();
  }, []); 

  const handleVerDetalle = (producto) => {
    setProductoSeleccionado(producto);
  };

  const handleCerrarDetalle = () => {
    setProductoSeleccionado(null);
  };

  return (
    <div className="global">
      <Navbar />
      <main>
        {productoSeleccionado && (
          <section>
            <ProductoDetalle producto={productoSeleccionado} onCerrarDetalle={handleCerrarDetalle} />
          </section>
        )}

        <section>
          <div className="divC">
            <Carrusel />
          </div>

          <div className="products-container">
            {productos ? (
              productos.map((producto) => (
                <Producto key={producto.id_producto} producto={producto} onVerDetalle={handleVerDetalle} />
              ))
            ) : (
              <p>Cargando productos...</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
