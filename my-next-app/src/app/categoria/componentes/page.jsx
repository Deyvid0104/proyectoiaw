'use client'
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
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

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  return (
    <div className="global">
      <NavbarComponent />
      <main>
        <Container className="mt-4">
          <h1 className="mb-4">Categorías</h1>
          
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
                      <a href={`/categoria/${categoria.id_categoria}`} className="btn btn-primary">
                        Ver productos
                      </a>
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
