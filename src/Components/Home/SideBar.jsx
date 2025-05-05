import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaCogs, FaChartLine, FaFilter, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../../assets/styles/Home.css';

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const openGrafana = (e) => {
    e.preventDefault(); // Prevenir el comportamiento normal del Link
    const enlace = "https://isvanipioto0.grafana.net/login";
    const nombreVentana = "GrafanaNow";

    // Intenta abrir o reutilizar la ventana
    const ventanaGrafana = window.open(enlace, nombreVentana);

    // Si la ventana ya estaba abierta, enfócala
    if (ventanaGrafana && !ventanaGrafana.closed) {
      ventanaGrafana.focus();
    }
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
        <li>
          <Link to="/gestion">
            <FaChartLine className="icon" />
            {!collapsed && <span>Gestión</span>}
          </Link>
        </li>
        <li>
          <a 
            href="https://isvanipioto0.grafana.net/login" 
            onClick={openGrafana}
            className="nav-link" // Asegúrate de que esta clase esté en tu CSS
          >
            <FaFilter className="icon" />
            {!collapsed && <span>Filtrar</span>}
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;