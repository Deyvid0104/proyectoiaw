
'use client'
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import NavbarComponent from '../../../componentes/Navbar';
import "../../globals.css";

// Función para obtener todas las categorías
async function getCategorias() {
  try {
    const res = await fetch('http://143.47.56.237:3000/categorias');
    if (!res.ok) {
      throw new Error('Error al obtener categorías');
    }
    return res.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export default function CategoriasAdminPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Intentar obtener el token del localStorage
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
    }
    
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const categoriasData = await getCategorias();
        
        if (!categoriasData) {
          throw new Error('No se pudieron obtener las categorías');
        }
        
        setCategorias(Array.isArray(categoriasData) ? categoriasData : [categoriasData]);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

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

  return (
    <div className="global">
      <NavbarComponent userType="admin" />
      <main>
        <Container className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Categorías (Panel de Administrador)</h1>
            {!token && (
              <Button variant="warning" onClick={handleLogin}>
                Iniciar sesión como administrador
              </Button>
            )}
          </div>
          
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
              <p>Cargando categorías...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">
              Error: {error}
            </Alert>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {categorias.map((categoria) => (
                <Col key={categoria.id_categoria}>
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <Card.Title>{categoria.nombre}</Card.Title>
                      <Card.Text>{categoria.descripcion}</Card.Text>
                      <div className="d-flex justify-content-between">
                        <a href={`/categoria_admin/${categoria.id_categoria}`} className="btn btn-primary">
                          Gestionar productos
                        </a>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </main>
    </div>
  );
}
