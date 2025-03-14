'use client'
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import Carrusel from "./carrusel/page";
import NavbarComponent from "../componentes/Navbar";
import "./globals.css";

// Función para obtener todos los productos
async function getProductos() {
  try {
    const res = await fetch("http://143.47.56.237:3000/productos");
    if (!res.ok) {
      throw new Error("Error al obtener productos");
    }
    return res.json();
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return null;
  }
}

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const productosData = await getProductos();
        
        if (!productosData) {
          throw new Error("No se pudieron obtener los productos");
        }
        
        // Asegurarse de que productosData sea un array
        const productosArray = Array.isArray(productosData) ? productosData : [productosData];
        setProductos(productosArray);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []); 

  return (
    <div className="global">
      <NavbarComponent />
      <main>
        <Container>
          <section>
            <div className="divC">
              <Carrusel />
            </div>
            
            <h2 className="my-4">Productos destacados</h2>
            
            {loading ? (
              <div className="text-center my-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p>Cargando productos...</p>
              </div>
            ) : error ? (
              <Alert variant="danger">
                Error: {error}
              </Alert>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {productos.slice(0, 6).map((producto) => (
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
                          <button className="btn btn-primary">Ver detalles</button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </section>
        </Container>
      </main>
    </div>
  );
}
