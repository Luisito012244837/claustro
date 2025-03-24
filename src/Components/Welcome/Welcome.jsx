import React, { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa'; // Importa el ícono de reloj
import '../../assets/styles/Welcome.css'; // Ruta corregida

const Welcome = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
      };
      setCurrentTime(now.toLocaleString('es-ES', options));
    };

    updateTime(); // Llama a la función al cargar el componente
    const interval = setInterval(updateTime, 1000); // Actualiza cada segundo

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

  return (
    <div className="welcome-container">
      <h1>Bienvenidos</h1>
      <div className="welcome-message">
        <p>Hola, bienvenido a AKADEMIA, donde podrá consultar los datos de todos los trabajadores, además de ver la información de cada uno.</p>
        <p>Explora las diferentes secciones del menú para comenzar.</p>
      </div>
      <div className="stats-container">
        <div className="stat-card">
          <h2>TOTAL DE TRABAJADORES</h2>
          <p>Error al cargar</p>
        </div>
        <div className="stat-card">
          <h2>CURSOS VIGENTES</h2>
          <p>12</p>
        </div>
        <div className="stat-card">
          <h2>TOTAL DE ESTUDIANTES</h2>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h2>NUEVOS REGISTROS</h2>
          <p>5</p>
        </div>
      </div>
      <div className="clock-container">
        <FaClock className="clock-icon" />
        <span>{currentTime}</span>
      </div>
    </div>
  );
};

export default Welcome;
