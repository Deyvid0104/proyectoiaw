'use client';
import { useEffect, useState } from "react";
import { FaEuroSign } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from "next/link";
import "../../globals.css";

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

async function modificarProductoAPI(producto) {
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

async function agregarProducto(producto) {
  try {
    const res = await fetch("http://143.47.56.237:3000/productos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });
    if (!res.ok) {
      throw new Error("Error al añadir el producto");
    }
    return await res.json();
  } catch (error) {
    console.error("Error al añadir el producto:", error);
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

const Producto = ({ producto, onVerDetalle, onEliminarProducto }) => (
  <div className="div_producto" key={producto.id}>
    <img className="producto-imagen" src={producto?.imagen} alt={producto?.nombre || "Imagen del producto"} />
    <h2 className="producto-nombre">{producto?.nombre}</h2>
    <p className="producto-descripcion">{producto?.descripcion}</p>
    <p className="producto-precio">{producto?.precio} <FaEuroSign /></p>
    <button className="mod_but" onClick={() => onVerDetalle(producto)}>Modificar</button>
    <button onClick={() => onEliminarProducto(producto.id_producto)} className="cerrar-btn">
      Eliminar
    </button>
  </div>
);


const ProductoDetalle = ({ producto, onCerrarDetalle, onModificarProducto }) => {
  const [nombre, setNombre] = useState(producto.nombre);
  const [descripcion, setDescripcion] = useState(producto.descripcion);
  const [precio, setPrecio] = useState(producto.precio);
  const [stock, setStock] = useState(producto.stock);
  const [imagen, setImagen] = useState(null); 
  const [marca, setMarca] = useState(producto.marca || ""); 
  const [modelo, setModelo] = useState(producto.modelo || "");

  const handleNombreChange = (event) => setNombre(event.target.value);
  const handleDescripcionChange = (event) => setDescripcion(event.target.value);
  const handlePrecioChange = (event) => setPrecio(event.target.value);
  const handleStockChange = (event) => setStock(event.target.value);
  const handleMarcaChange = (event) => setMarca(event.target.value);
  const handleModeloChange = (event) => setModelo(event.target.value);

  const handleImagenChange = (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagen(reader.result);
      };
      reader.readAsDataURL(archivo);
    }
  };

  const handleModificarProducto = async () => {
    const productoModificado = { ...producto, nombre, descripcion, precio, stock, imagen, marca, modelo };
    const productoActualizado = await onModificarProducto(productoModificado);

    if (productoActualizado) {
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
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: null,
    marca: '',
    modelo: ''
  });

  useEffect(() => {
    const fetchProductos = async () => {
      const productosData = await getProductos();
      setProductos(productosData);
    };

    fetchProductos();
  }, []);


  const modificarProducto = async (productoModificado) => {
    const productoActualizado = await modificarProductoAPI(productoModificado);
    if (productoActualizado) {
      setProductos(productos.map((producto) =>
        producto.id_producto === productoModificado.id_producto ? productoModificado : producto
      ));
    }
    return productoModificado;
  };

  const agregarNuevoProducto = async () => {
    const producto = { ...nuevoProducto };
    const nuevoProductoAgregado = await agregarProducto(producto);
    if (nuevoProductoAgregado) {
      setProductos([...productos, nuevoProductoAgregado]);
      setMostrarFormulario(false);
      setNuevoProducto({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        imagen: null,
        marca: '',
        modelo: ''
      });
    }
  };
  
  async function deleteproducto(id_producto) { 
    const token = localStorage.getItem("token")
    if (!token) throw new Error("No token found")
    }
  const handleVerDetalle = (producto) => {
    setProductoSeleccionado(producto);
  };

  const handleCerrarDetalle = () => {
    setProductoSeleccionado(null);
  };

  const handleMostrarFormulario = () => {
    setMostrarFormulario(true);
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto({ ...nuevoProducto, [name]: value });
  };

  const handleImagenChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevoProducto({ ...nuevoProducto, imagen: reader.result });
      };
      reader.readAsDataURL(archivo); 
    }
  };
  const handleDeleteproducto = async (id) => {
    try {
      await deleteproducto(id)
      const updatedproductos = await getProductos()
      setLibros(updatedproductos)
    } catch (error) {
      console.error("Error deleting producto:", error)
    }
  }

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
            <button onClick={handleMostrarFormulario} className="btn btn-primary">
              Añadir Producto
            </button>
            <div className="producto_create">
            {mostrarFormulario && (
              <div className="formulario-producto">
                <h2>Añadir Producto</h2>
                <div>
                  <label>Nombre:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={nuevoProducto.nombre}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Descripción:</label>
                  <textarea
                    name="descripcion"
                    value={nuevoProducto.descripcion}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Precio:</label>
                  <input type="number"
                    name="precio"
                    value={nuevoProducto.precio}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Stock:</label>
                  <input
                    type="number"
                    name="stock"
                    value={nuevoProducto.stock}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Marca:</label>
                  <input
                    type="text"
                    name="marca"
                    value={nuevoProducto.marca}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Modelo:</label>
                  <input
                    type="text"
                    name="modelo"
                    value={nuevoProducto.modelo}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Imagen del producto:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagenChange}
                  />
                  {nuevoProducto.imagen && <img src={nuevoProducto.imagen} alt="Previsualización" style={{ marginTop: '10px', width: '100px' }} />}
                </div>
                <button onClick={agregarNuevoProducto} className="btn btn-success">
                  Guardar Producto
                </button>
                <button onClick={handleCancelarFormulario} className="btn btn-secondary">
                  Cancelar
                </button>
              </div>
            )}
            </div>
          </div>
          <div className="products-container">
            {productos ? (
              productos.map((producto) => (
                <Producto key={producto.id_producto} producto={producto} 
                onVerDetalle={handleVerDetalle} onEliminarProducto={handleDeleteproducto} />
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
