import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice'; // Ajusta la ruta según tu estructura
import '../../assets/styles/Home.css';
import '../../assets/styles/Authentication.css';
import { useTheme } from './ThemeContext';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [showWelcomeTooltip, setShowWelcomeTooltip] = useState(false);
  const [initialLoginDone, setInitialLoginDone] = useState(false);
  const authMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  
  // Redux
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const username = user?.username || user?.name || '';

  // Función para obtener el nombre de usuario del almacenamiento (mantener como fallback)
  const getUsernameFromStorage = () => {
    try {
      const storedUsername = localStorage.getItem('username') || sessionStorage.getItem('username');
      return storedUsername || '';
    } catch (error) {
      console.error('Error al acceder al storage:', error);
      return '';
    }
  };

  // Obtener el nombre de usuario al cargar el componente y cuando cambia la ruta
  useEffect(() => {
    // Priorizar el estado de Redux, usar storage como fallback
    const currentUsername = username || getUsernameFromStorage();

    if (currentUsername && !initialLoginDone && isAuthenticated) {
      showWelcomeMessage(currentUsername);
      setInitialLoginDone(true);
    }
  }, [location.pathname, initialLoginDone, username, isAuthenticated]);

  // Escuchar el evento personalizado de inicio de sesión
  useEffect(() => {
    const handleUserLogin = (event) => {
      console.log('Evento de login detectado:', event.detail);
      if (event.detail && event.detail.username) {
        showWelcomeMessage(event.detail.username);
        setInitialLoginDone(true);
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
    // Solo mostrar notificaciones, no el mensaje de bienvenida
    if (message && !message.includes('Bienvenido')) {
      setNotification(message);
      setTimeout(() => {
        setNotification('');
      }, 5000);
    }
  };

  const showWelcomeMessage = (user) => {
    setShowWelcomeTooltip(true);
    setTimeout(() => {
      setShowWelcomeTooltip(false);
    }, 5000);
  };

  // Nueva lógica de logout usando Redux
  const handleLogout = () => {
    try {
      // Limpiar sessionStorage también si lo usas
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('username');
      
      // Dispatch de la acción logout de Redux (que ya limpia localStorage)
      dispatch(logout());
      
      // Limpiar estados locales
      setIsMenuOpen(false);
      setInitialLoginDone(false);
      
      // Navegar a login
      navigate('/login');
    } catch (e) {
      console.error('Error durante logout:', e);
    }
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

  const handleNotificationClick = () => {
    showNotification("No hay nuevas notificaciones");
  };

  return (
        <div className="navbar">
      <h1>AKADEMIA</h1>
      <div className="auth-container">
        <div className="notification-wrapper">
          <span
            className="notification-icon"
            onClick={handleNotificationClick}
          >
            🔔
          </span>
          {notification && <div className="notification-message">{notification}</div>}
          
          {/* Tooltip de bienvenida */}
          {showWelcomeTooltip && (
            <div className="welcome-tooltip">
              <div className="welcome-tooltip-content">
                <div className="welcome-header">¡Bienvenido!</div>
                <div className="welcome-message">
                  Hola <strong>{username}</strong>
                </div>
              </div>
              <div className="welcome-tooltip-arrow"></div>
            </div>
          )}
        </div>
        
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button onClick={toggleMenu}>
          {username ? username : 'Autenticarse'}
        </button>
        {isMenuOpen && (
          <div className="auth-menu" ref={authMenuRef}>
            {!isAuthenticated && (
              <Link to="/login" className="auth-menu-item" onClick={toggleMenu}>
                Iniciar Sesión
              </Link>
            )}
            {isAuthenticated && (
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

