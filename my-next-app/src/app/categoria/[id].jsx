'use client'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Categoria() {
  const router = useRouter();
  const { id } = router.query;
  const [categoria, setCategoria] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`http://143.47.56.237:3000/categorias/${id}`)
        .then(response => response.json())
        .then(data => setCategoria(data));
    }
  }, [id]);

  if (!categoria) return <div>Cargando...</div>;

  return (
    <div>
      <h1>{categoria.nombre}</h1>
      {/* Renderiza más información sobre la categoría aquí */}
    </div>
  );
}