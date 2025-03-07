'use client'
import Link from 'next/link';

function Productos() {
  const productosData = [
    {
      id: 1,
      nombre: "PC Gaming Pro",
      precio: 1499.99,
      imagenUrl: "https://thumb.pccomponentes.com/w-300-300/articles/1066/10667957/1359-hp-victus-16-s0053ns-amd-ryzen-7-7840hs-16gb-512gb-ssd-rtx-4060-161.jpg",
      descripcion: "Intel i9, 32GB RAM, RTX 4080"
    },
    {
      id: 2,
      nombre: "SSD 1TB Samsung",
      precio: 89.99,
      imagenUrl: "https://thumb.pccomponentes.com/w-300-300/articles/6/67945/samsung-970-evo-plus-1tb-ssd-nvme-m2.jpg",
      descripcion: "NVMe M.2, Velocidad 3500MB/s"
    },
    {
      id: 3,
      nombre: "Ratón Gaming Logitech",
      precio: 79.99,
      imagenUrl: "https://thumb.pccomponentes.com/w-300-300/articles/28/289561/1.jpg",
      descripcion: "16000 DPI, RGB, Inalámbrico"
    },
    {
      id: 4,
      nombre: "Auriculares Gaming",
      precio: 129.99,
      imagenUrl: "https://thumb.pccomponentes.com/w-300-300/articles/1042/10427935/1571-corsair-hs55-wireless-core-auriculares-gaming-inalambricos-negros.jpg",
      descripcion: "7.1 Surround, RGB, Micrófono"
    }
  ];

  return (
    <div className="productos-container">
      {productosData.map((producto) => (
        <div className="producto-card" key={producto.id}>
          <Link href={`/productos/${producto.id}`}>
            <img 
              className="product-img" 
              src={producto.imagenUrl} 
              alt={producto.nombre} 
            />
            <h4>{producto.nombre}</h4>
            <p className="precio">{producto.precio}€</p>
            <p className="descripcion">{producto.descripcion}</p>
          </Link>
        </div>
      ))}
      <style jsx>{`
        .productos-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .producto-card {
          background: white;
          border-radius: 10px;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .producto-card:hover {
          transform: translateY(-5px);
        }

        .product-img {
          width: 100%;
          height: 200px;
          object-fit: contain;
          margin-bottom: 1rem;
        }

        .precio {
          color: #0070f3;
          font-weight: bold;
          font-size: 1.1rem;
          margin: 0.5rem 0;
        }

        .descripcion {
          color: #666;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}

export default Productos;
