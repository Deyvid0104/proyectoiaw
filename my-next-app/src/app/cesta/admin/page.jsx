'use client'; // Esto convierte el componente en un cliente
import { useEffect, useState } from "react";
import { FaEuroSign } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from "next/link";
import "../../globals.css";
import axios from 'axios';

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

// Función para crear un producto
async function createProducto(productoData, token) {
  try {
    const res = await axios.post("http://143.47.56.237:3000/productos", productoData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
}

// Función para eliminar un producto
async function deleteProducto(id, token) {
  try {
    await axios.delete(`http://143.47.56.237:3000/productos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
}

// Función para actualizar un producto
async function updateProducto(id, productoData, token) {
  try {
    const res = await axios.put(`http://143.47.56.237:3000/productos/${id}`, productoData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
}

const Navbar = () => (
  <header>
    <div className="head">
      <Link href="/" className="inicio"><h1>TechStore</h1></Link>
      <input type="text" id="texto" name="texto" placeholder="Busca aquí..." aria-label="Buscar productos" />
      <h3><Link href="/"><IoPersonCircle />Cerrar sesión</Link></h3>
    </div>
    <hr className="hr_global" />
  </header>
);

const Producto = ({ producto, onEliminar, onEditar }) => (
  <div className="div_producto">
    <img className="producto-imagen" src={producto?.imagen || "/file.svg"} alt={producto?.nombre || "Imagen del producto"} />
    <h2 className="producto-nombre">{producto?.nombre}</h2>
    <p className="producto-descripcion">{producto?.descripcion}</p>
    <p className="producto-precio">{producto?.precio} <FaEuroSign /></p>
    <button className="btn-editar" onClick={() => onEditar(producto)}>Editar Producto</button>
    <button className="btn-eliminar" onClick={() => onEliminar(producto.id_producto)}>Eliminar</button>
  </div>
);

const AñadirProductoForm = ({ onProductoCreado, onCerrarFormulario }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');
  const [marca, setMarca] = useState(''); // Nuevo campo Marca
  const [modelo, setModelo] = useState(''); // Nuevo campo Modelo
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se encontró el token de autenticación');
      return;
    }

    const productoData = { nombre, precio, id_categoria: idCategoria, descripcion, imagen, marca, modelo }; // Incluimos los nuevos campos
    try {
      const producto = await createProducto(productoData, token);
      onProductoCreado(producto);
      setError(null);
      onCerrarFormulario();
    } catch (error) {
      setError('Error al crear producto');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Añadir Producto</h2>
      <div>
        <label>Nombre:</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div>
        <label>Precio:</label>
        <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
      </div>
      <div>
        <label>ID Categoría:</label>
        <input type="text" value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)} required />
      </div>
      <div>
        <label>Descripción:</label>
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
      </div>
      <div>
        <label>Imagen URL:</label>
        <input type="text" value={imagen} onChange={(e) => setImagen(e.target.value)} />
      </div>
      <div>
        <label>Marca:</label>
        <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} required />
      </div>
      <div>
        <label>Modelo:</label>
        <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} required />
      </div>

      <button className="btn-crear" type="submit">Crear Producto</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

const EditarProductoForm = ({ producto, onProductoEditado, onCerrarFormulario }) => {
  const [nombre, setNombre] = useState(producto?.nombre || '');
  const [precio, setPrecio] = useState(producto?.precio || '');
  const [idCategoria, setIdCategoria] = useState(producto?.id_categoria || '');
  const [descripcion, setDescripcion] = useState(producto?.descripcion || '');
  const [imagen, setImagen] = useState(producto?.imagen || '');
  const [marca, setMarca] = useState(producto?.marca || '');
  const [modelo, setModelo] = useState(producto?.modelo || '');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se encontró el token de autenticación');
      return;
    }

    const productoData = { nombre, precio, id_categoria: idCategoria, descripcion, imagen, marca, modelo }; // Incluimos los nuevos campos
    try {
      const productoEditado = await updateProducto(producto.id_producto, productoData, token);
      onProductoEditado(productoEditado);
      setError(null);
      onCerrarFormulario();
    } catch (error) {
      setError('Error al actualizar producto');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editar Producto</h2>
      <div>
        <label>Nombre:</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div>
        <label>Precio:</label>
        <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
      </div>
      <div>
        <label>ID Categoría:</label>
        <input type="text" value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)} required />
      </div>
      <div>
        <label>Descripción:</label>
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
      </div>
      <div>
        <label>Imagen URL:</label>
        <input type="text" value={imagen} onChange={(e) => setImagen(e.target.value)} />
      </div>
      <div>
        <label>Marca:</label>
        <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} required />
      </div>
      <div>
        <label>Modelo:</label>
        <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} required />
      </div>
      <div className="form-buttons">
        <button className="btn-crear" type="submit">Guardar Cambios</button>
        <button className="btn-cancelar" type="button" onClick={onCerrarFormulario}>Cancelar</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default function Home() {
  const [productos, setProductos] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarFormularioAñadir, setMostrarFormularioAñadir] = useState(false); // Estado para mostrar el formulario de añadir
  const [mostrarFormularioEditar, setMostrarFormularioEditar] = useState(false); // Estado para mostrar el formulario de editar

  useEffect(() => {
    const fetchProductos = async () => {
      const productosData = await getProductos();
      setProductos(productosData);
    };

    fetchProductos();
  }, []);

  const handleEditarProducto = (producto) => {
    setProductoSeleccionado(producto);  // Establece el producto a editar
    setMostrarFormularioEditar(true); // Muestra el formulario de edición
  };

  const handleCerrarFormularioAñadir = () => {
    setMostrarFormularioAñadir(false); // Cerrar el formulario de añadir
  };

  const handleCerrarFormularioEditar = () => {
    setMostrarFormularioEditar(false); // Cerrar el formulario de editar
    setProductoSeleccionado(null); // Limpiar producto seleccionado
  };

  const handleEliminar = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado');
      return;
    }

    try {
      await deleteProducto(id, token);
      setProductos(productos.filter((producto) => producto.id_producto !== id));
    } catch (error) {
      alert('Error al eliminar el producto');
    }
  };

  const handleProductoCreado = (producto) => {
    setProductos([producto, ...productos]);
    setMostrarFormularioAñadir(false); // Ocultar formulario después de la creación
  };

  const handleProductoEditado = (productoEditado) => {
    setProductos(productos.map((producto) => producto.id_producto === productoEditado.id_producto ? productoEditado : producto));
    setMostrarFormularioEditar(false); // Ocultar formulario después de la edición
  };

  return (
    <div className="global">
      <Navbar />
      <main>
        <section>
          <div className="divC">
            <button className="btn-crear" onClick={() => setMostrarFormularioAñadir(!mostrarFormularioAñadir)}>
              {mostrarFormularioAñadir ? 'Cancelar' : 'Añadir Producto'}
            </button>
            <section className="producto_mod">
              {mostrarFormularioAñadir && <AñadirProductoForm onProductoCreado={handleProductoCreado} onCerrarFormulario={handleCerrarFormularioAñadir} />}
            </section>
          </div>

          <div className="divC">
            {productoSeleccionado && (
              <button className="btn-crear" onClick={() => setMostrarFormularioEditar(!mostrarFormularioEditar)}>
                {mostrarFormularioEditar ? 'Cancelar' : 'Editar Producto'}
              </button>
            )}
            <section className="producto_mod">
              {mostrarFormularioEditar && (
                <EditarProductoForm
                  producto={productoSeleccionado}
                  onProductoEditado={handleProductoEditado}
                  onCerrarFormulario={handleCerrarFormularioEditar}
                />
              )}
            </section>
          </div>

          <div className="products-container">
            {productos ? (
              productos.map((producto) => (
                <Producto
                  key={producto.id_producto}
                  producto={producto}
                  onEditar={handleEditarProducto} // Llama a editar cuando se hace click en editar
                  onEliminar={handleEliminar}
                />
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
