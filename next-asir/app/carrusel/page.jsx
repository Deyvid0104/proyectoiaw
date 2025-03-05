'use client'
import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './estilo.css'

function Carrusel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div className='carrusel-img'><Carousel activeIndex={index} onSelect={handleSelect} style={{width:"25%"}}>
      <Carousel.Item>
        <img  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Alcazaba_de_Almer%C3%ADa.jpg/640px-Alcazaba_de_Almer%C3%ADa.jpg" alt="Alcazaba de Almería"/>
        <Carousel.Caption>
          <h3>Alcazaba de Almería</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img  src="https://turismoalmanzora.com/wp-content/uploads/imagen-de-albox.jpg" alt="Santuario del Saliente"/>
        <Carousel.Caption>
          <h3>Plaza Mayor Albox</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img  src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Dawn_Charles_V_Palace_Alhambra_Granada_Andalusia_Spain.jpg/280px-Dawn_Charles_V_Palace_Alhambra_Granada_Andalusia_Spain.jpg" alt="Alhambra" />
        <Carousel.Caption>
          <h3>Alhambra</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel></div>
  );
}

export default Carrusel;