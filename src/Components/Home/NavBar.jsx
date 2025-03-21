import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/Home.css'; // Ruta corregida
import '../../assets/styles/Authentication.css'; // Estilos del menú desplegable

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar el menú
  const [notification, setNotification] = useState(''); // Estado para la notificación

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Alternar entre abrir y cerrar el menú
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(''); // Ocultar la notificación después de 3 segundos
    }, 3000);
  };

  // Funciones para manejar cambios en trabajadores
  const handleAddWorker = () => {
    // Lógica para agregar trabajador
    showNotification('Se ha agregado un trabajador');
  };

  const handleModifyWorker = () => {
    // Lógica para modificar trabajador
    showNotification('Se ha modificado un trabajador');
  };

  const handleRemoveWorker = () => {
    // Lógica para eliminar trabajador
    showNotification('Se ha eliminado un trabajador');
  };

  return (
    <div className="navbar">
      <h1>AKADEMIA</h1>
      <div className="auth-container">
        <span className="notification-icon" onClick={() => showNotification('¡Tienes nuevas notificaciones!')}>🔔</span> {/* Ícono de notificación */}
        {notification && <div className="notification-message">{notification}</div>} {/* Mensaje de notificación */}
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
