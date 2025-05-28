import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHome, FaCogs, FaChartLine, FaFilter, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../../assets/styles/Home.css';

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  // Obtener datos del usuario desde Redux
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Usar 'rol' como viene de la API, con fallback a 'role'
  const userRole = user?.rol || user?.role || '';

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const openGrafana = (e) => {
    e.preventDefault();
    const enlace = "https://isvanipioto0.grafana.net/login";
    const nombreVentana = "GrafanaNow";
    const ventanaGrafana = window.open(enlace, nombreVentana);
    if (ventanaGrafana && !ventanaGrafana.closed) {
      ventanaGrafana.focus();
    }
  };

  // Función para verificar si el usuario es supervisor
  const isSupervisor = () => {
    return userRole === 'supervisor' || userRole === 'admin';
  };

  // Función para obtener el nombre a mostrar
  const getDisplayName = () => {
    if (user?.first_name) {
      return `${user.first_name} ${user.last_name || ''}`.trim();
    }
    return user?.username || '';
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="collapse-button" onClick={toggleCollapse}>
        {collapsed ? <FaArrowRight /> : <FaArrowLeft />}
      </button>
      <ul>
        <li>
          <Link to="/">
            <FaHome className="icon" />
            {!collapsed && <span>Bienvenido</span>}
          </Link>
        </li>
        <li>
          <Link to="/control">
            <FaCogs className="icon" />
            {!collapsed && <span>Control</span>}
          </Link>
        </li>
        
        {/* Mostrar Gestión solo para supervisores */}
        {isAuthenticated && isSupervisor() && (
          <li>
            <Link to="/gestion">
              <FaChartLine className="icon" />
              {!collapsed && <span>Gestión</span>}
            </Link>
          </li>
        )}
        
        <li>
          <a
            href="https://isvanipioto0.grafana.net/login"
            onClick={openGrafana}
            className="nav-link"
          >
            <FaFilter className="icon" />
            {!collapsed && <span>Filtrar</span>}
          </a>
        </li>
      </ul>
      
      {/* Opcional: Mostrar información del usuario en la parte inferior */}
      {!collapsed && isAuthenticated && (
        <div className="user-info">
          <small>{getDisplayName()}</small>
          <small className="user-role">({userRole})</small>
        </div>
      )}
    </div>
  );
};

export default SideBar;
