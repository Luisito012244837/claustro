import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/Home.css';
import '../../assets/styles/Authentication.css';
import { useTheme } from './ThemeContext';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [username, setUsername] = useState('');
  const authMenuRef = useRef(null);
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  // Obtener el nombre de usuario al cargar el componente
  useEffect(() => {
    try {
      const storedUsername = localStorage.getItem('username');
      console.log('Usuario almacenado:', storedUsername); // Depuración
      if (storedUsername) {
        setUsername(storedUsername);
      }
    } catch (error) {
      console.error('Error al acceder a localStorage:', error);
    }
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Evita que el evento cierre el menú inmediatamente
    setIsMenuOpen(!isMenuOpen);
    console.log('Estado del menú:', !isMenuOpen); // Depuración
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
    setUsername('');
    navigate('/login');
  };

  const useClickOutside = (ref, callback) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref, callback]);
  };

  useClickOutside(authMenuRef, () => setIsMenuOpen(false));

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
        <span
          className="notification-icon"
          onClick={() => showNotification('¡Tienes nuevas notificaciones!')}
        >
          🔔
        </span>
        {notification && <div className="notification-message">{notification}</div>}

        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

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