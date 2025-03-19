import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import "../assets/css/DashboardLayout.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../assets/fonts/fontawesome-all.min.css";
import "../assets/css/bootstrap.min.css";

const DashboardLayout = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div id="page-top">
      <div id="wrapper">
        {/* Barra lateral */}
        <nav
          className={`navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-success p-0 ${
            sidebarCollapsed ? 'collapsed' : ''
          }`}
        >
          <div className="container-fluid d-flex flex-column p-0">
            <a className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0" href="#">
              <div className="sidebar-brand-text mx-3">
                <span>AKADEMIA</span>
              </div>
            </a>
            <hr className="sidebar-divider my-0" />
            <ul className="navbar-nav text-light" id="accordionSidebar">
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
                  <i className="fas fa-tachometer-alt"></i>
                  <span className={`sidebar-text ${sidebarCollapsed ? 'd-none' : ''}`}> Bienvenido</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/control' ? 'active' : ''}`} to="/control">
                  <i className="fas fa-user-circle"></i>
                  <span className={`sidebar-text ${sidebarCollapsed ? 'd-none' : ''}`}> Control</span>
                </Link>
              </li>
              <li className="nav-item">
                <a id="btnFiltrar" className="nav-link" href="">
                  <i className="fas fa-filter"></i>
                  <span className={`sidebar-text ${sidebarCollapsed ? 'd-none' : ''}`}> Filtrar</span>
                </a>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/gestion' ? 'active' : ''}`} to="/gestion">
                  <i className="fas fa-users-cog"></i>
                  <span className={`sidebar-text ${sidebarCollapsed ? 'd-none' : ''}`}> Gestión</span>
                </Link>
              </li>
            </ul>
            <div className="text-center d-none d-md-inline">
              <button
                className="btn rounded-circle border-0"
                id="sidebarToggle"
                type="button"
                onClick={toggleSidebar}
              >
              
              </button>
            </div>
          </div>
        </nav>

        {/* Contenido principal */}
        <div
          className="d-flex flex-column"
          id="content-wrapper"
          style={{
            marginLeft: sidebarCollapsed ? '60px' : '250px',
            transition: 'margin-left 0.3s ease',
          }}
        >
          <div id="content">
            <div className="container-fluid">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
