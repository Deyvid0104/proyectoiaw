'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Container, Row, Col, Card, Spinner, Alert, Button, Badge } from 'react-bootstrap';
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

export default function CategoriaUsuarioPage() {
  const params = useParams();
  const categoriaId = params.id;
  
  const [categoria, setCategoria] = useState(null);
  const [todosProductos, setTodosProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
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

    // Cargar carrito desde localStorage si existe
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, [categoriaId]);

  // Función para añadir productos al carrito
  const añadirAlCarrito = (producto) => {
    const nuevoCarrito = [...carrito];
    const productoExistente = nuevoCarrito.find(item => item.id_producto === producto.id_producto);
    
    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      nuevoCarrito.push({
        ...producto,
        cantidad: 1
      });
    }
    
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    alert(`${producto.nombre} añadido al carrito`);
  };

  if (loading) {
    return (
      <div>
        <NavbarComponent userType="user" />
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
        <NavbarComponent userType="user" />
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
      <NavbarComponent userType="user" />
      <Container className="mt-4">
        <div className="mb-4">
          <h1>{categoria.nombre}</h1>
          <p className="lead">{categoria.descripcion}</p>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Productos</h2>
          <div>
            <Badge bg="primary" className="me-2">
              Productos en carrito: {carrito.reduce((total, item) => total + item.cantidad, 0)}
            </Badge>
            <Badge bg="success">
              Total: {carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2)}€
            </Badge>
          </div>
        </div>
        
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
                        variant="primary"
                        onClick={() => añadirAlCarrito(producto)}
                      >
                        Añadir al carrito
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}
