'use client';
import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const {
    name,
    description,
    price,
    image,
    category,
    stock
  } = product;

  return (
    <Card className="h-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={image || '/placeholder.jpg'} 
          className="object-cover h-48"
          alt={name}
        />
        {stock <= 5 && stock > 0 && (
          <Badge 
            bg="warning" 
            className="position-absolute top-0 end-0 m-2"
          >
            ¡Últimas unidades!
          </Badge>
        )}
        {stock === 0 && (
          <Badge 
            bg="danger" 
            className="position-absolute top-0 end-0 m-2"
          >
            Agotado
          </Badge>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg="secondary" className="me-2">
            {category}
          </Badge>
        </div>
        <Card.Title className="h5 font-weight-bold">{name}</Card.Title>
        <Card.Text className="text-muted small">
          {description}
        </Card.Text>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <span className="h4 mb-0">{price ? `${price}€` : 'Precio no disponible'}</span>
            <Button 
              variant="primary" 
              disabled={stock === 0}
              className="d-flex align-items-center gap-2"
            >
              <FaShoppingCart />
              {stock === 0 ? 'Agotado' : 'Añadir'}
            </Button>
          </div>
          {stock > 0 && (
            <small className="text-success mt-2 d-block">
              {stock} unidades disponibles
            </small>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
