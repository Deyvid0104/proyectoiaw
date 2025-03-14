'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoPersonCircle } from 'react-icons/io5';
import { Navbar, Nav, Dropdown, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Componente Navbar reutilizable que se adapta según el tipo de usuario
export default function NavbarComponent({ userType = 'guest' }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener las categorías de la API
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://143.47.56.237:3000/categorias');
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const data = await response.json();
        setCategorias(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  // Determinar la ruta base según el tipo de usuario
  const getBasePath = () => {
    switch (userType) {
      case 'admin':
        return '/categoria_admin';
      case 'user':
        return '/categoria_usuario';
      default:
        return '/categoria';
    }
  };

  // Determinar los enlaces de inicio de sesión/registro o cierre de sesión
  const renderAuthLinks = () => {
    if (userType === 'guest') {
      return (
        <>
          <Link href="/login" className="text-white me-3 text-decoration-none">
            <IoPersonCircle className="me-1" />Login
          </Link>
          <Link href="/regis" className="text-white text-decoration-none">
            <IoPersonCircle className="me-1" />Registrar
          </Link>
        </>
      );
    } else {
      return (
        <Link href="/" className="text-white text-decoration-none">
          <IoPersonCircle className="me-1" />Cerrar sesión
        </Link>
      );
    }
  };

  // Determinar si mostrar el carrito
  const renderCart = () => {
    if (userType !== 'guest') {
      const cartPath = userType === 'admin' ? '/cesta/admin' : '/cesta/usuario';
      return (
        <Dropdown className="ms-3">
          <Dropdown.Toggle variant="success" id="cesta-basic">
            Mi cesta
          </Dropdown.Toggle>
          <Dropdown.Menu id="cesta-menu">
            <Dropdown.Item as={Link} href={cartPath}>
              Ver carrito
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    }
    return null;
  };

  return (
    <header className="bg-dark text-white">
      <Container>
        <div className="head py-3">
          <Link href={userType === 'guest' ? '/' : userType === 'admin' ? '/cesta/admin' : '/cesta/usuario'} className="inicio">
            <h1>TechStore</h1>
          </Link>
          <input type="text" id="texto" name="texto" placeholder="Busca aquí..." aria-label="Buscar productos" />
          <div className="d-flex align-items-center">
            {renderAuthLinks()}
            {renderCart()}
          </div>
        </div>
        <hr className="hr_global" />
        <Nav className="mb-3">
          <Dropdown className="me-3">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Categorías
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {loading ? (
                <Dropdown.Item>Cargando categorías...</Dropdown.Item>
              ) : error ? (
                <Dropdown.Item>Error al cargar categorías</Dropdown.Item>
              ) : (
                categorias.map((categoria) => (
                  <Dropdown.Item 
                    key={categoria.id_categoria} 
                    as={Link} 
                    href={`${getBasePath()}/${categoria.id_categoria}`}
                  >
                    {categoria.nombre}
                  </Dropdown.Item>
                ))
              )}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Nuestro equipo
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} href="/about/Fabio">Fabio</Dropdown.Item>
              <Dropdown.Item as={Link} href="/about/Deyvid">Deyvid</Dropdown.Item>
              <Dropdown.Item as={Link} href="/about/Kevin">Kevin</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </header>
  );
}
