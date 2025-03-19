import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../assets/css/Bienvenido.css";
import "../assets/fonts/fontawesome-all.min.css";

const Bienvenido = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar el nombre de usuario al cargar la página
    const username = localStorage.getItem("username");
    if (username) {
      const usernameDisplay = document.getElementById("usernameDisplay");
      if (usernameDisplay) {
        usernameDisplay.textContent = username; // Mostrar el nombre de usuario
      }
    }

    // Funcionalidad para el botón de logout
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        navigate("/login"); // Redirigir al login
      });
    }

    // Funcionalidad para el botón de filtrar
    const btnFiltrar = document.getElementById("btnFiltrar");
    if (btnFiltrar) {
      btnFiltrar.addEventListener("click", () => {
        const enlace = "https://isvanipioto0.grafana.net/login";
        const nombreVentana = "GrafanaNow";
        const ventanaGrafana = window.open(enlace, nombreVentana);
        if (ventanaGrafana && !ventanaGrafana.closed) {
          ventanaGrafana.focus();
        }
      });
    }

    // Verificar el rol del usuario y mostrar/ocultar el enlace de Gestión
    const gestionLink = document.querySelector('a[href="gestion.html"]');
    const role = localStorage.getItem("role");
    if (gestionLink) {
      if (username === "niurvisdfp" || role === "supervisor") {
        gestionLink.style.display = "block";
      } else {
        gestionLink.style.display = "none";
      }
    }
  }, [navigate]);

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div id="page-top">
      <div id="wrapper">
        {/* Se eliminó el menú lateral (sidebar) */}
        <div className="d-flex flex-column" id="content-wrapper">
          <div id="content">
            <nav className="navbar navbar-light navbar-expand bg-white shadow mb-2 topbar static-top">
              <div className="container-fluid">
                <button className="btn btn-link d-md-none rounded-circle me-3" id="sidebarToggleTop" type="button">
                  <i className="fas fa-bars"></i>
                </button>
                <ul className="navbar-nav flex-nowrap ms-auto">
                  <li className="nav-item dropdown d-sm-none no-arrow">
                    <a className="dropdown-toggle nav-link" aria-expanded="false" data-bs-toggle="dropdown" href="#">
                      <i className="fas fa-search"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end p-3 animated--grow-in" aria-labelledby="searchDropdown">
                      <form className="me-auto navbar-search w-100">
                        <div className="input-group">
                          <input className="bg-light form-control border-0 small" type="text" placeholder="Search for ..." />
                          <div className="input-group-append">
                            <button className="btn btn-primary py-0" type="button">
                              <i className="fas fa-search"></i>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </li>
                  <li className="nav-item dropdown no-arrow mx-1">
                    <div className="nav-item dropdown no-arrow">
                      <a className="dropdown-toggle nav-link" aria-expanded="false" data-bs-toggle="dropdown" href="#">
                        <span className="badge bg-danger badge-counter">3</span>
                        <i className="fas fa-bell fa-fw"></i>
                      </a>
                      <div className="dropdown-menu dropdown-menu-end dropdown-list animated--grow-in">
                        <h6 className="dropdown-header">Centro de Alertas</h6>
                        <div className="dropdown-list">
                          <a className="dropdown-item text-gray-800" href="#">
                            <div className="text-truncate">Se ha añadido un nuevo trabajador al sistema.</div>
                            <div className="small text-gray-500">Hace 2 minutos</div>
                          </a>
                          <a className="dropdown-item text-gray-800" href="#">
                            <div className="text-truncate">Se ha modificado la información de un trabajador.</div>
                            <div className="small text-gray-500">Hace 10 minutos</div>
                          </a>
                          <a className="dropdown-item text-gray-800" href="#">
                            <div className="text-truncate">Se ha eliminado un trabajador del sistema.</div>
                            <div className="small text-gray-500">Hace 30 minutos</div>
                          </a>
                        </div>
                        <a className="dropdown-item text-center small text-gray-500" href="#">
                          Ver todas las notificaciones
                        </a>
                      </div>
                    </div>
                  </li>
                  <div className="d-none d-sm-block topbar-divider"></div>
                  <li className="nav-item dropdown no-arrow">
                    <div className="nav-item dropdown no-arrow">
                      <a className="dropdown-toggle nav-link" aria-expanded="false" data-bs-toggle="dropdown" href="/src/components/Login.jsx">
                        <span id="usernameDisplay" className="d-none d-lg-inline me-2 text-gray-600 small">
                          Autenticarse
                        </span>
                      </a>
                      <div className="dropdown-menu shadow dropdown-menu-end animated--grow-in">
                        <a className="dropdown-item" href="perfil.html">
                          <i className="fas fa-user fa-sm fa-fw me-2 text-gray-400"></i>&nbsp;Perfil
                        </a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item login" href="" onClick={handleLogin}>
                          <i className="fas fa-sign-in-alt fa-sm fa-fw me-2 text-gray-400"></i>
                          <span> Login</span>
                        </a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item logout-button" href="index.html" id="logoutButton">
                          <i className="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400"></i>&nbsp;Cerrar Sesión
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </nav>
            <div className="container-fluid">
              <h1 className="h3 mb-2 text-gray-800">Bienvenidos a AKADEMIA</h1>
              <div className="card shadow mb-3">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Mensaje de Bienvenida</h6>
                </div>
                <div className="card-body">
                  <p>Hola bienvenido a AKADEMIA, donde podrá consultar los datos de todos los trabajadores, además de ver la información de cada uno.</p>
                  <p>Explora las diferentes secciones del menú para comenzar.</p>
                </div>
              </div>
              <div className="row" style={{ marginBottom: "10px", marginLeft: "95px" }}>
                <div className="col-xl-5 col-md-6 mb-7 d-flex" style={{ marginBottom: "20px" }}>
                  <div className="card border-left-primary shadow h-100 py-2 flex-fill">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total de Trabajadores</div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800 total-trabajadores">0</div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-chalkboard-teacher fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-5 col-md-6 mb-7 d-flex" style={{ minHeight: "150px", marginBottom: "20px" }}>
                  <div className="card border-left-success shadow h-100 py-2 flex-fill">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Total de Estudiantes</div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">0</div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-user-graduate fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-5 col-md-6 mb-7 d-flex" style={{ minHeight: "150px", marginBottom: "20px" }}>
                  <div className="card border-left-info shadow h-100 py-2 flex-fill">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Cursos Vigentes</div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">12</div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-book fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-5 col-md-6 mb-7 d-flex" style={{ minHeight: "150px", marginBottom: "20px" }}>
                  <div className="card border-left-warning shadow h-100 py-2 flex-fill">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Nuevos Registros</div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">5</div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-user-plus fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a className="border rounded d-inline scroll-to-top" href="#page-top">
          <i className="fas fa-angle-up"></i>
        </a>
      </div>
    </div>
  );
};

export default Bienvenido;