'use client'; // Esto convierte el componente en un cliente
import { useEffect, useState } from "react";
import { FaEuroSign } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
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

// Función para modificar producto
async function modificarProducto(producto) {
  try {
    const res = await fetch(`http://143.47.56.237:3000/productos/${producto.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });
    if (!res.ok) {
      throw new Error("Error al modificar el producto");
    }
    return await res.json();
  } catch (error) {
    console.error("Error al modificar el producto:", error);
    return null;
  }
}

const Navbar = () => (
  <header>
    <div className="head">
      <Link href="" className="inicio"><h1>TechStore</h1></Link>
      <input type="text" id="texto" name="texto" placeholder="Busca aquí..." aria-label="Buscar productos" />
      <h3><Link href="/"><IoPersonCircle />Cerrar sesión</Link></h3>
    </div>
    <hr className="hr_global" />
  </header>
);

// Producto (vista previa)
const Producto = ({ producto, onVerDetalle, onEliminarProducto }) => (
  <div className="div_producto" key={producto.id}>
    <img className="producto-imagen" src={producto?.imagen} alt={producto?.nombre || "Imagen del producto"} />
    <h2 className="producto-nombre">{producto?.nombre}</h2>
    <p className="producto-descripcion">{producto?.descripcion}</p>
    <p className="producto-precio">{producto?.precio} <FaEuroSign /></p>
    <button className="mod_but" onClick={() => onVerDetalle(producto)}>Modificar</button>
    <button onClick={() => onEliminarProducto(producto.id)} className="cerrar-btn">
      Eliminar
    </button>
  </div>
);

const ProductoDetalle = ({ producto, onCerrarDetalle, onModificarProducto }) => {
  const [nombre, setNombre] = useState(producto.nombre);
  const [descripcion, setDescripcion] = useState(producto.descripcion);
  const [precio, setPrecio] = useState(producto.precio);
  const [stock, setStock] = useState(producto.stock);
  const [imagen, setImagen] = useState(null); // Estado para manejar la imagen cargada
  const [marca, setMarca] = useState(producto.marca || ""); // Estado para manejar la marca
  const [modelo, setModelo] = useState(producto.modelo || ""); // Estado para manejar el modelo

  const handleNombreChange = (event) => setNombre(event.target.value);
  const handleDescripcionChange = (event) => setDescripcion(event.target.value);
  const handlePrecioChange = (event) => setPrecio(event.target.value);
  const handleStockChange = (event) => setStock(event.target.value);
  const handleMarcaChange = (event) => setMarca(event.target.value); // Función para actualizar la marca
  const handleModeloChange = (event) => setModelo(event.target.value); // Función para actualizar el modelo

  const handleImagenChange = (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagen(reader.result); // Guardar la imagen en base64 para previsualización
      };
      reader.readAsDataURL(archivo); // Leer el archivo como base64
    }
  };

  const handleModificarProducto = async () => {
    const productoModificado = { ...producto, nombre, descripcion, precio, stock, imagen, marca, modelo };
    const productoActualizado = await onModificarProducto(productoModificado);

    if (productoActualizado) {
      // Si la actualización fue exitosa, cerramos el detalle
      onCerrarDetalle();
    }
  };

  return (
    <div className="producto-detalles">
      <h2>Detalles del producto</h2>
      <img className="img_detalle" src={imagen || producto?.imagen || "/file.svg"} alt={producto?.nombre || "Imagen del producto"} />
      <div className="producto-info">
        <h1>{producto?.nombre}</h1>
        <div className="producto_mod">
          <div>
            <label>Nombre del producto:</label>
            <input
              type="text"
              value={nombre}
              onChange={handleNombreChange}
            />
          </div>
          <div>
            <label>Descripción:</label>
            <textarea
              value={descripcion}
              onChange={handleDescripcionChange}
            />
          </div>
          <div>
            <label>Precio:</label>
            <input
              type="number"
              value={precio}
              onChange={handlePrecioChange}
            />
          </div>
          <div>
            <label>Stock:</label>
            <input
              type="number"
              value={stock}
              onChange={handleStockChange}
            />
          </div>
          <div>
            <label>Marca:</label>
            <input
              type="text"
              value={marca}
              onChange={handleMarcaChange}
            />
          </div>
          <div>
            <label>Modelo:</label>
            <input
              type="text"
              value={modelo}
              onChange={handleModeloChange}
            />
          </div>
          <div>
            <label>Imagen del producto:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
            />
            {imagen && <img src={imagen} alt="Previsualización de la imagen" style={{ marginTop: '10px', width: '100px' }} />}
          </div>
        </div>
        <button onClick={handleModificarProducto}>Guardar cambios</button>
      </div>
      <button className="cerrar-btn" onClick={onCerrarDetalle}>Cancelar</button>
    </div>
  );
};

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

  const eliminarProducto = async (productoId) => {
    const res = await fetch(`http://143.47.56.237:3000/productos/${productoId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setProductos(productos.filter((producto) => producto.id !== productoId));
    }
  };

  const modificarProducto = async (productoModificado) => {
    const productoActualizado = await modificarProducto(productoModificado);

    if (productoActualizado) {
      // Si la actualización fue exitosa, actualizamos el estado
      setProductos(productos.map((producto) =>
        producto.id === productoModificado.id ? productoModificado : producto
      ));
    }
    return productoModificado; // Retornar el producto actualizado
  };

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
            <ProductoDetalle
              producto={productoSeleccionado}
              onCerrarDetalle={handleCerrarDetalle}
              onModificarProducto={modificarProducto}
            />
          </section>
        )}
        <section>
          <div className="divC">
            <Carrusel />
          </div>
          <div className="products-container">
            {productos ? (
              productos.map((producto) => (
                <Producto key={producto.id} producto={producto} onVerDetalle={handleVerDetalle} onEliminarProducto={eliminarProducto} />
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
