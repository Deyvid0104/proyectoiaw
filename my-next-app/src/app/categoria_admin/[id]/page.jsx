'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Container, Row, Col, Card, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import NavbarComponent from '../../../componentes/Navbar';

// Función para obtener todos los productos
async function getProductos() {
  try {
    const res = await fetch('http://143.47.56.237:3000/productos');
    if (!res.ok) {
      throw new Error('Error al obtener productos');
    }
    return res.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Función para obtener los detalles de una categoría
async function getCategoria(categoriaId) {
  try {
    const res = await fetch(`http://143.47.56.237:3000/categorias/${categoriaId}`);
    if (!res.ok) {
      throw new Error('Error al obtener la categoría');
    }
    return res.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Función para modificar un producto (requiere token)
async function modificarProducto(productoId, datosProducto, token) {
  try {
    const res = await fetch(`http://143.47.56.237:3000/productos/${productoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(datosProducto)
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al modificar el producto');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export default function CategoriaAdminPage() {
  const params = useParams();
  const categoriaId = params.id;
  
  const [categoria, setCategoria] = useState(null);
  const [todosProductos, setTodosProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');
  
  // Estado para el modal de edición
  const [showModal, setShowModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: ''
  });

  useEffect(() => {
    // Intentar obtener el token del localStorage
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener detalles de la categoría
        const categoriaData = await getCategoria(categoriaId);
        if (!categoriaData) {
          throw new Error('No se pudo obtener la información de la categoría');
        }
        setCategoria(categoriaData);
        
        // Obtener todos los productos
        const productosData = await getProductos();
        if (!productosData) {
          throw new Error('No se pudieron obtener los productos');
        }
        
        // Asegurarse de que productosData sea un array
        const productosArray = Array.isArray(productosData) ? productosData : [productosData];
        setTodosProductos(productosArray);
        
        // Filtrar productos por categoría
        const productosDeCategoría = productosArray.filter(
          producto => producto.id_categoria === parseInt(categoriaId)
        );
        setProductosFiltrados(productosDeCategoría);
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (categoriaId) {
      fetchData();
    }
  }, [categoriaId]);

  // Manejar el inicio de sesión del administrador
  const handleLogin = async () => {
    try {
      const email = prompt('Introduce tu email de administrador:');
      const password = prompt('Introduce tu contraseña:');
      
      if (!email || !password) {
        alert('Email y contraseña son requeridos');
        return;
      }
      
      const response = await fetch('http://143.47.56.237:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error de autenticación');
      }
      
      const data = await response.json();
      const newToken = data.token;
      
      // Guardar el token en localStorage y en el estado
      localStorage.setItem('adminToken', newToken);
      setToken(newToken);
      
      alert('Inicio de sesión exitoso');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Abrir modal para editar producto
  const handleEditarProducto = (producto) => {
    if (!token) {
      alert('Debes iniciar sesión como administrador para editar productos');
      handleLogin();
      return;
    }
    
    setProductoEditando(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      imagen: producto.imagen || ''
    });
    setShowModal(true);
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Guardar cambios del producto
  const handleGuardarCambios = async () => {
    try {
      if (!token) {
        alert('No tienes autorización. Inicia sesión como administrador.');
        return;
      }
      
      // Validar datos
      if (!formData.nombre || !formData.descripcion || !formData.precio) {
        alert('Todos los campos son obligatorios excepto la imagen');
        return;
      }
      
      // Preparar datos para enviar
      const datosActualizados = {
        ...productoEditando,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        imagen: formData.imagen
      };
      
      // Enviar petición para modificar el producto
      await modificarProducto(productoEditando.id_producto, datosActualizados, token);
      
      // Actualizar la lista de productos
      const productosActualizados = todosProductos.map(p => 
        p.id_producto === productoEditando.id_producto ? datosActualizados : p
      );
      
      setTodosProductos(productosActualizados);
      
      // Actualizar productos filtrados
      const filtradosActualizados = productosActualizados.filter(
        producto => producto.id_categoria === parseInt(categoriaId)
      );
      setProductosFiltrados(filtradosActualizados);
      
      // Cerrar modal
      setShowModal(false);
      alert('Producto actualizado correctamente');
    } catch (error) {
      alert(`Error al guardar cambios: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div>
        <NavbarComponent userType="admin" />
        <Container className="mt-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p>Cargando información de la categoría...</p>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavbarComponent userType="admin" />
        <Container className="mt-5">
          <Alert variant="danger">
            Error: {error}
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <NavbarComponent userType="admin" />
      <Container className="mt-4">
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h1>{categoria.nombre}</h1>
            <p className="lead">{categoria.descripcion}</p>
          </div>
          {!token && (
            <Button variant="warning" onClick={handleLogin}>
              Iniciar sesión como administrador
            </Button>
          )}
        </div>
        
        <h2 className="mb-3">Productos</h2>
        
        {productosFiltrados.length === 0 ? (
          <Alert variant="info">
            No hay productos disponibles en esta categoría.
          </Alert>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {productosFiltrados.map((producto) => (
              <Col key={producto.id_producto}>
                <Card className="h-100 shadow-sm">
                  <Card.Img 
                    variant="top" 
                    src={producto.imagen || "/file.svg"} 
                    alt={producto.nombre}
                    style={{ height: '200px', objectFit: 'contain', padding: '1rem' }}
                  />
                  <Card.Body>
                    <Card.Title>{producto.nombre}</Card.Title>
                    <Card.Text>{producto.descripcion}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">{producto.precio}€</span>
                      <Button 
                        variant="secondary"
                        onClick={() => handleEditarProducto(producto)}
                      >
                        Editar producto
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
        
        {/* Modal para editar producto */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Producto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control 
                  type="text" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleFormChange} 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  name="descripcion" 
                  value={formData.descripcion} 
                  onChange={handleFormChange} 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Precio (€)</Form.Label>
                <Form.Control 
                  type="number" 
                  name="precio" 
                  value={formData.precio} 
                  onChange={handleFormChange} 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>URL de la imagen</Form.Label>
                <Form.Control 
                  type="text" 
                  name="imagen" 
                  value={formData.imagen} 
                  onChange={handleFormChange} 
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleGuardarCambios}>
              Guardar cambios
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}
