import React from 'react';
import '../../assets/styles/Welcome.css'; // Ruta corregida

const Welcome = () => {
  return (
    <div className="welcome-container">
      <h1>Bienvenidos</h1>
      <div className="welcome-message">
        <p>Hola bienvenido a AKADEMIA, donde podrá consultar los datos de todos los trabajadores, además de ver la información de cada uno.</p>
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
    </div>
  );
};

export default Welcome;