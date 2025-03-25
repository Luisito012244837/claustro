import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/Home.css';
import '../../assets/styles/Authentication.css';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [username, setUsername] = useState('');
  const authMenuRef = useRef(null);
  const navigate = useNavigate();

  // Obtener el nombre de usuario al cargar el componente
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setIsMenuOpen(false);
    setUsername(''); // Limpiar el nombre de usuario al cerrar sesión
    navigate('/login');
  };

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
        {username && (
          <div className="username-display">
            <span>Bienvenido, </span>
            <span className="username-text">{username}</span>
          </div>
        )}
        <span className="notification-icon" onClick={() => showNotification('¡Tienes nuevas notificaciones!')}>🔔</span>
        {notification && <div className="notification-message">{notification}</div>}
        <button onClick={toggleMenu}>
          {username ? 'Mi Cuenta' : 'Autenticarse'}
        </button>
        {isMenuOpen && (
          <div className="auth-menu" ref={authMenuRef}>
            {!username && (
              <Link to="/login" className="auth-menu-item" onClick={toggleMenu}>
                Iniciar Sesión
              </Link>
            )}
            {username && (
              <button className="auth-menu-item" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;