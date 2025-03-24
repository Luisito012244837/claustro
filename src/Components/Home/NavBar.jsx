import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/Home.css'; // Ruta corregida
import '../../assets/styles/Authentication.css'; // Estilos del menú desplegable

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar el menú
  const [notification, setNotification] = useState(''); // Estado para la notificación
  const authMenuRef = useRef(null); // Referencia para el menú de autenticación

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Alternar entre abrir y cerrar el menú
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(''); // Ocultar la notificación después de 3 segundos
    }, 3000);
  };

  // Cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      <h1>AKADEMIA</h1>
      <div className="auth-container">
        <span className="notification-icon" onClick={() => showNotification('¡Tienes nuevas notificaciones!')}>🔔</span> {/* Ícono de notificación */}
        {notification && <div className="notification-message">{notification}</div>} {/* Mensaje de notificación */}
        <button onClick={toggleMenu}>Autenticarse</button> {/* Botón de autenticación */}
        {isMenuOpen && (
          <div className="auth-menu" ref={authMenuRef}>
            <Link to="/login" className="auth-menu-item" onClick={toggleMenu}>Iniciar Sesión</Link>
            <button className="auth-menu-item">Cerrar Sesión</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;