import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../assets/styles/Home.css';
import '../../assets/styles/Authentication.css';
import { useTheme } from './ThemeContext';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [username, setUsername] = useState('');
  const authMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();

  // Función para obtener el nombre de usuario del almacenamiento
  const getUsernameFromStorage = () => {
    try {
      // Intentar primero localStorage, luego sessionStorage
      const storedUsername = localStorage.getItem('username') || sessionStorage.getItem('username');
      return storedUsername || '';
    } catch (error) {
      console.error('Error al acceder al storage:', error);
      return '';
    }
  };

  // Obtener el nombre de usuario al cargar el componente y cuando cambia la ruta
  useEffect(() => {
    const storedUsername = getUsernameFromStorage();
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [location.pathname]);

  // Escuchar el evento personalizado de inicio de sesión
  useEffect(() => {
    const handleUserLogin = (event) => {
      console.log('Evento de login detectado:', event.detail);
      if (event.detail && event.detail.username) {
        setUsername(event.detail.username);
      }
    };

    window.addEventListener('userLoggedIn', handleUserLogin);
    
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLogin);
    };
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('username');
    } catch (e) {
      console.error('Error al limpiar storage durante logout:', e);
    }
    
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
        {username ? (
          <div className="username-display">
            <span>Bienvenido, </span>
            <span className="username-text">{username}</span>
          </div>
        ) : (
          <div className="username-display">
            <span>No has iniciado sesión</span>
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
