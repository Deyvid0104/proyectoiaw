import "./estilo.css"
import Link from "next/link"

async function getLibros() {
    const res = await fetch("http://localhost:4000/libro")
    if (!res.ok) throw new Error("Failed to fetch libros")
    return res.json()
  }
  
  export default async function Home() {
    const libros = await getLibros()
    return (
      <div>
        <div className="nav"><h1>Tienda en desarrollo</h1>
          <div className="div2"><input type="text" id="texto" name="texto" placeholder="Busca aqui..."></input></div></div>
          {libros.map((libro) => (
            <Link href={`/bibliotecatic/libros/${libro.id}`} key={libro.id}>
              <div>
                <img src={libro.portadaUrl || "/file.svg"} alt={libro.titulo} />
                <h2>{libro.titulo}</h2>
                <p>por {libro.autor?.nombre && `Autor: ${libro.autor.nombre}`}</p>
              </div>
            </Link>
          ))}
        </div>
        )}