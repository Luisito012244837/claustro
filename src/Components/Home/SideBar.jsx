import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaCogs, FaChartLine, FaFilter, FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Íconos
import '../../assets/styles/Home.css'; // Ruta corregida

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false); // Estado para controlar si está contraído

  const toggleCollapse = () => {
    setCollapsed(!collapsed); // Cambia el estado de contraído/expandido
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="collapse-button" onClick={toggleCollapse}>
        {collapsed ? <FaArrowRight /> : <FaArrowLeft />} {/* Flecha dinámica */}
      </button>
      <ul>
        <li>
          <Link to="/">
            <FaHome className="icon" /> {/* Ícono de Bienvenido */}
            {!collapsed && <span>Bienvenido</span>} {/* Texto solo si no está contraído */}
          </Link>
        </li>
        <li>
          <Link to="/control">
            <FaCogs className="icon" /> {/* Ícono de Control */}
            {!collapsed && <span>Control</span>} {/* Texto solo si no está contraído */}
          </Link>
        </li>
        <li>
          <Link to="/gestion">
            <FaChartLine className="icon" /> {/* Ícono de Gestión */}
            {!collapsed && <span>Gestión</span>} {/* Texto solo si no está contraído */}
          </Link>
        </li>
        <li>
          <Link to="/filtrar">
            <FaFilter className="icon" /> {/* Ícono de Filtrar */}
            {!collapsed && <span>Filtrar</span>} {/* Texto solo si no está contraído */}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;