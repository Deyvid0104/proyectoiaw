'use client';
import { useEffect, useState } from "react";
import { FaEuroSign } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carrusel from "../../carrusel/page";
import Link from "next/link";
import "../../globals.css";
import axios from 'axios';

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

const eliminarProductoDeCarritoEnBackend = async (idCarrito, productoId) => {
  try {
    const res = await fetch(`http://143.47.56.237:3000/carritos/${idCarrito}/productos/${productoId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error(`Error al eliminar el producto: ${errorData.message || "Unknown error"}`);
      throw new Error(`Error al eliminar el producto: ${errorData.message || "Unknown error"}`);
    }

    return await res.json(); // Esta es la respuesta con el carrito actualizado
  } catch (error) {
    console.error('Error al eliminar el producto desde el frontend:', error);
    return { success: false, message: error.message };
  }
};




const Navbar = ({ carrito, eliminarDeCarrito }) => (
  <header>
    <div className="head">
      <Link href="" className="inicio"><h1>TechStore</h1></Link>
      <input type="text" id="texto" name="texto" placeholder="Busca aquí..." aria-label="Buscar productos" />
      <h3><Link href="/"><IoPersonCircle />Cerrar sesión</Link></h3>
      <h3><Dropdown>
        <Dropdown.Toggle variant="success" id="carrito-basic">
          <h4>Mi carrito ({carrito.length})</h4>
        </Dropdown.Toggle>
        <Dropdown.Menu id="carrito-menu">
          {carrito.length > 0 ? (
            carrito.map((producto) => (
              <Dropdown.Item key={producto.id_producto}>
                {producto.nombre} - {producto.precio}
                <span> x {producto.cantidad}</span>
                <button
                  onClick={() => eliminarDeCarrito(producto.id_producto)}
                  style={{width: "80px", marginLeft: "10px", backgroundColor: "#e74c3c", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px",}}>
                  Eliminar
                </button>
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item>No hay productos en el carrito</Dropdown.Item>
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

const ProductoDetalle = ({ producto, añadirACarrito, onCerrarDetalle }) => {
  const [cantidad, setCantidad] = useState(1);

  const handleCantidadChange = (event) => {
    const nuevaCantidad = Math.min(event.target.value, producto.stock);
    setCantidad(nuevaCantidad);
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
          <button onClick={() => añadirACarrito(producto, cantidad)}>
            Agregar al carrito
          </button>
        </div>
      </div>
      <button className="cerrar-btn" onClick={onCerrarDetalle}>Cerrar detalle</button>
    </div>
  );
};

export default function Home() {
  const [productos, setProductos] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      const productosData = await getProductos();
      setProductos(productosData);
    };
    fetchProductos();
  }, []);

  const eliminarDeCarrito = async (productoId) => {
    const idCarrito = 6; // Este valor debe coincidir con el id correcto del carrito
  
    console.log(`Eliminando producto con ID ${productoId} del carrito con ID ${idCarrito}`);
  
    const response = await eliminarProductoDeCarritoEnBackend(idCarrito, productoId);
  
    if (response?.success) {
      const nuevoCarrito = carrito.filter((producto) => producto.id !== productoId);
      setCarrito(nuevoCarrito);
      alert('Producto eliminado del carrito');
    } else {
      alert('Hubo un error al eliminar el producto');
    }
  };

  const handleVerDetalle = (producto) => {
    setProductoSeleccionado(producto);
  };

  const handleCerrarDetalle = () => {
    setProductoSeleccionado(null);
  };

  const añadirACarrito = async (producto, cantidad) => {
    const idCarrito = 6;;
    const data = { cantidad: cantidad };

    try {
      const res = await fetch(`http://143.47.56.237:3000/carritos/${idCarrito}/productos/${producto.id_producto}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const dataRespuesta = await res.json();
        setCarrito((prevCarrito) => [...prevCarrito, { ...producto, cantidad }]);
        alert('Producto agregado al carrito');
      } else {
        alert('Hubo un error al agregar el producto');
      }
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      alert('Hubo un error al agregar el producto');
    }
  };





  return (
    <div className="global">
      <Navbar carrito={carrito} eliminarDeCarrito={eliminarDeCarrito} />
      <main>
        {productoSeleccionado && (
          <section>
            <ProductoDetalle producto={productoSeleccionado} añadirACarrito={añadirACarrito} onCerrarDetalle={handleCerrarDetalle} />
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
