'use client'; // Esto convierte el componente en un cliente
import { useEffect, useState } from "react";
import { FaEuroSign } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carrusel from "../../carrusel/page";
import Link from "next/link";
import "../../globals.css";

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


const Navbar = ({ cesta, eliminarDeCesta }) => (
  <header>
    <div className="head">
      <Link href="" className="inicio"><h1>TechStore</h1></Link>
      <input type="text" id="texto" name="texto" placeholder="Busca aquí..." aria-label="Buscar productos" />
      <h3><Link href="/"><IoPersonCircle />Cerrar sesión</Link></h3>
      <h3><Dropdown>
        <Dropdown.Toggle variant="success" id="cesta-basic">
          <h4>Mi cesta ({cesta.length})</h4>
        </Dropdown.Toggle>
        <Dropdown.Menu id="cesta-menu">
          {cesta.length > 0 ? (
            cesta.map((producto) => (
              <Dropdown.Item key={producto.id}> {/* Usamos producto.id como key */}
                {producto.imagen} - {producto.nombre} - {producto.precio} 
                <span> x {producto.cantidad}</span> {/* Mostrar cantidad */}
                <button onClick={() => eliminarDeCesta(producto.id)} style={{ marginLeft: "10px", backgroundColor: "#e74c3c", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px" }}>Eliminar</button>
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item>No hay productos en la cesta</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown></h3>
    </div>
    <hr className="hr_global" />
    <nav>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Categoría
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="../../categoria_usuario/ordenadores"><button>Ordenadores</button></Dropdown.Item>
          <Dropdown.Item href="../../categoria_usuario/moviles"><button>Móviles</button></Dropdown.Item>
          <Dropdown.Item href="../../categoria_usuario/componentes"><button>Componentes</button></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </nav>
  </header>
);

const Producto = ({ producto, onVerDetalle }) => (
  <div className="div_producto">
    <img className="producto-imagen" src={producto?.imagen} alt={producto?.nombre || "Imagen del producto"} />
    <h2 className="producto-nombre">{producto?.nombre}</h2>
    <p className="producto-descripcion">{producto?.descripcion}</p>
    <p className="producto-precio">{producto?.precio} <FaEuroSign /></p>
    <button className="detalle_but" onClick={() => onVerDetalle(producto)}>Ver detalles</button>
  </div>
);

const ProductoDetalle = ({ producto, añadirACesta, onCerrarDetalle }) => {
  const [cantidad, setCantidad] = useState(1);

  // Función para manejar el cambio de cantidad
  const handleCantidadChange = (event) => {
    const nuevaCantidad = Math.min(event.target.value, producto.stock);  // No dejar que se elija más de lo disponible
    setCantidad(nuevaCantidad);
  };

  const handleAñadirACesta = () => {
    if (cantidad > 0) {
      añadirACesta(producto, cantidad);
    }
  };

  return (
    <div className="producto-detalles">
      <h2>Detalles del producto</h2>
      <img className="img_detalle" src={producto?.imagen || "/file.svg"} alt={producto?.nombre || "Imagen del producto"} />
      <div className="producto-info">
        <h1>{producto?.nombre}</h1>
        <p>{producto?.descripcion}</p>
        <p className="producto-precio">Precio: {producto?.precio} <FaEuroSign /></p>
        <p>Stock disponible: {producto?.stock}</p>
        <div>
          <input 
            type="number" 
            min="1" 
            max={producto?.stock} 
            value={cantidad} 
            onChange={handleCantidadChange} 
            style={{ width: '50px' }}
          />
          <button onClick={handleAñadirACesta}>Añadir a la cesta</button>
        </div>
      </div>
      <button className="cerrar-btn" onClick={onCerrarDetalle}>Cerrar detalle</button>
    </div>
  );
};

export default function Home() {
  const [productos, setProductos] = useState(null);
  const [cesta, setCesta] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      const productosData = await getProductos();
      setProductos(productosData);
    };

    fetchProductos();
  }, []);

  const añadirACesta = (producto, cantidad) => {
    // Verificamos si el producto ya está en la cesta
    const productoExistente = cesta.find(item => item.id === producto.id);

    if (productoExistente) {
      // Si ya existe, actualizamos la cantidad
      const nuevaCesta = cesta.map(item => 
        item.id === producto.id 
          ? { ...item, cantidad: item.cantidad + cantidad }  // Sumamos la cantidad seleccionada
          : item
      );
      setCesta(nuevaCesta);
    } else {
      // Si no existe, añadimos el producto con la cantidad
      setCesta([...cesta, { ...producto, cantidad }]);
    }
  };

  const eliminarDeCesta = (productoId) => {
    const nuevaCesta = cesta.filter((producto) => producto.id !== productoId);
    setCesta(nuevaCesta);
  };

  const handleVerDetalle = (producto) => {
    setProductoSeleccionado(producto);
  };

  // Cerrar el detalle
  const handleCerrarDetalle = () => {
    setProductoSeleccionado(null);
  };

  return (
    <div className="global">
      <Navbar cesta={cesta} eliminarDeCesta={eliminarDeCesta} />
      <main>
        {productoSeleccionado && (
          <section>
            <ProductoDetalle producto={productoSeleccionado} añadirACesta={añadirACesta} onCerrarDetalle={handleCerrarDetalle} />
          </section>
        )}
        <section>
          <div className="divC">
            <Carrusel />
          </div>
          <div className="products-container">
            {productos ? (
              productos.map((producto) => (
                <Producto key={producto.id} producto={producto} onVerDetalle={handleVerDetalle} />
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
