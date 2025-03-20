import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/Home.css'; // Ruta corregida
import '../../assets/styles/Authentication.css'; // Estilos del menú desplegable

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar el menú

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Alternar entre abrir y cerrar el menú
  };

  return (
    <div className="navbar">
      <div>
        <span className="notification-icon">🔔</span> {/* Ícono de notificación */}
      </div>
      <h1>AKADEMIA</h1>
      <div className="auth-container">
        <button onClick={toggleMenu}>Autenticarse</button> {/* Botón de autenticación */}
        {isMenuOpen && (
          <div className="auth-menu">
            <Link to="/login" className="auth-menu-item" onClick={toggleMenu}>Iniciar Sesión</Link>
            <button className="auth-menu-item">Cerrar Sesión</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;