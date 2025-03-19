import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../assets/css/bootstrap.min.css";
import "../assets/fonts/fontawesome-all.min.css";
import "../assets/css/Control.css";
import styled from "styled-components";

// Define un componente con la fuente Nunito
const Container = styled.div`
  font-family: 'Nunito', sans-serif;
`;

const Control = () => {
    const navigate = useNavigate(); // Inicializa useNavigate
    const [searchTerm, setSearchTerm] = useState("");
    const [workers, setWorkers] = useState([]); // Estado para almacenar los trabajadores

    // Función para obtener el token desde el localStorage
    const getToken = () => {
        const token = localStorage.getItem('token');
        return token; // Simplemente devuelve el token sin validar
    };

    // Función para cargar los datos de los trabajadores desde la API
    const cargarDatosTrabajadores = async () => {
        const token = getToken();

        try {
            const response = await fetch('http://10.10.1.1:8000/apiv2/trabajador/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Respuesta del servidor:', response);

            if (!response.ok) {
                if (response.status === 401) {
                    // Token inválido o expirado
                    localStorage.removeItem('token');
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de autenticación',
                        text: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
                    });
                    navigate('/login');
                    return;
                }
                throw new Error('Error al obtener los datos de la API');
            }

            const data = await response.json();
            setWorkers(data);
        } catch (error) {
            console.error('Error al cargar los datos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al cargar los datos. Por favor, intenta nuevamente.',
            });
        }
    };

    // Función para ver los detalles de un trabajador
    const verTrabajador = async (id_trabajador) => {
        const token = getToken();

        try {
            const response = await fetch(`http://10.10.1.1:8000/apiv2/getTrabajador/${id_trabajador}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token inválido o expirado
                    localStorage.removeItem('token');
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de autenticación',
                        text: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
                    });
                    navigate('/login');
                    return;
                }
                throw new Error('No se pudo obtener la información del trabajador.');
            }

            const trabajador = await response.json();

            Swal.fire({
                title: 'Detalles del Trabajador',
                html: `
                    <div class="card">
                        <div class="card-header">
                            <h3>Información Personal</h3>
                        </div>
                        <div class="card-body">
                            <p><strong>Nombre:</strong> ${trabajador.nombre}</p>
                            <p><strong>Primer Apellido:</strong> ${trabajador.primer_apellido}</p>
                            <p><strong>Segundo Apellido:</strong> ${trabajador.segundo_apellido || 'No disponible'}</p>
                            <p><strong>Sexo:</strong> ${trabajador.sexo}</p>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3>Categorías y Cursos</h3>
                        </div>
                        <div class="card-body">
                            <p><strong>Categoría docente:</strong> ${trabajador.categorias_docentes.map(cat => cat.nombre_categoria_docente).join(', ') || 'No disponible'}</p>
                            <p><strong>Categoría cientifica:</strong> ${trabajador.nombre_categoria_cientifica}</p>
                            <p><strong>Cursos:</strong> ${trabajador.tipos_curso.map(cat => cat.nombre_curso).join(', ') || 'No disponible'}</p>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3>Carreras y Asignaturas</h3>
                        </div>
                        <div class="card-body">
                            <p><strong>Carreras:</strong> ${trabajador.carreras.map(cat => cat.nombre_carrera).join(', ') || 'No disponible'}</p>
                            <p><strong>Asignaturas:</strong> ${trabajador.asignaturas.map(cat => cat.nombre_asignatura).join(', ') || 'No disponible'}</p>
                            <p><strong>Año de graduado:</strong> ${trabajador.ano_graduado}</p>
                            <p><strong>Años de experiencia:</strong> ${trabajador.anos_experiencia}</p>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3>Cargos y Responsabilidades</h3>
                        </div>
                        <div class="card-body">
                            <p><strong>Cargo:</strong> ${trabajador.cargos.map(cat => cat.nombre_cargo).join(', ') || 'No disponible'}</p>
                            <p><strong>Responsabilidad:</strong> ${trabajador.responsabilidades.map(cat => cat.nombre_responsabilidad).join(', ') || 'No disponible'}</p>
                            <p><strong>Cantidad de grupos C:</strong> ${trabajador.cantidad_grupo_c || 'No disponible'}</p>
                            <p><strong>Cantidad de grupos CP:</strong> ${trabajador.cantidad_grupo_cp || 'No disponible'}</p>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3>Áreas y Años Académicos</h3>
                        </div>
                        <div class="card-body">
                            <p><strong>Áreas:</strong> ${trabajador.areas.map(cat => cat.nombre_area).join(', ') || 'No disponible'}</p>
                            <p><strong>Año Académico:</strong> ${trabajador.annos_academicos.map(cat => cat.anno).join(', ') || 'No disponible'}</p>
                        </div>
                    </div>
                `,
                icon: 'info',
                confirmButtonText: 'Cerrar',
                width: '500px',
                customClass: {
                    popup: 'custom-modal',
                    confirmButton: 'custom-confirm-button',
                },
            });
        } catch (error) {
            console.error('Error al obtener detalles del trabajador:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los detalles del trabajador.',
            });
        }
    };

    // Función para eliminar un trabajador
    const eliminarTrabajador = async (id_trabajador) => {
        const token = getToken();

        try {
            const confirmacion = await Swal.fire({
                title: '¿Estás seguro?',
                text: '¡No podrás revertir esto!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
            });

            if (confirmacion.isConfirmed) {
                const response = await fetch(`http://10.10.1.1:8000/apiv2/trabajador/${id_trabajador}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Eliminado!',
                        text: 'Se ha eliminado un trabajador del sistema.',
                    });

                    await cargarDatosTrabajadores();
                } else {
                    if (response.status === 401) {
                        // Token inválido o expirado
                        localStorage.removeItem('token');
                        Swal.fire({
                            icon: 'error',
                            title: 'Error de autenticación',
                            text: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
                        });
                        navigate('/login');
                        return;
                    }
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al eliminar el trabajador');
                }
            }
        } catch (error) {
            console.error('Error al eliminar el trabajador:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Hubo un problema al eliminar el trabajador.',
            });
        }
    };

    // Función para manejar el logout
    const handleLogout = () => {
        localStorage.removeItem('token'); // Eliminar el token
        localStorage.removeItem('username'); // Eliminar el nombre de usuario
        navigate('/login'); // Redirigir a la página de login
    };

    // Cargar los datos de los trabajadores al montar el componente
    useEffect(() => {
        cargarDatosTrabajadores();

        // Recuperar el nombre de usuario al cargar la página
        const username = localStorage.getItem('username');
        if (username) {
            const usernameDisplay = document.getElementById('usernameDisplay');
            if (usernameDisplay) {
                usernameDisplay.textContent = username; // Mostrar el nombre de usuario
            }
        }

        // Asignar la función de logout al botón
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', handleLogout);
        }

        // Limpiar el event listener al desmontar el componente
        return () => {
            if (logoutButton) {
                logoutButton.removeEventListener('click', handleLogout);
            }
        };
    }, [navigate]);

    // Filtrado de trabajadores
    const filteredWorkers = workers.filter((worker) => {
        const fullName = `${worker.nombre} ${worker.primer_apellido} ${worker.segundo_apellido}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase().trim());
    });

    return (
        <Container>
            <div id="page-top">
                <div id="wrapper">
                    {/* Contenido principal */}
                    <div className="d-flex flex-column" id="content-wrapper">
                        <div id="content">
                            {/* Barra de navegación superior */}
                            <nav className="navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top">
                                <div className="container-fluid">
                                    <button className="btn btn-link d-md-none rounded-circle me-3" id="sidebarToggleTop" type="button">
                                        <i className="fas fa-bars"></i>
                                    </button>
                                    <form className="d-none d-sm-inline-block me-auto ms-md-3 my-2 my-md-0 mw-100 navbar-search">
                                        <div className="input-group">
                                            <input
                                                id="searchInput"
                                                className="bg-light form-control border-0 small"
                                                type="text"
                                                placeholder="Buscar por nombre o apellido..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </form>
                                    <ul className="navbar-nav flex-nowrap ms-auto">
                                        <li className="nav-item dropdown no-arrow mx-1">
                                            <div className="nav-item dropdown no-arrow">
                                                <a className="dropdown-toggle nav-link" aria-expanded="false" data-bs-toggle="dropdown" href="#">
                                                    <span className="badge bg-danger badge-counter">3+</span>
                                                    <i className="fas fa-bell fa-fw"></i>
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-end dropdown-list animated--grow-in">
                                                    <h6 className="dropdown-header">Alertas</h6>
                                                    <a className="dropdown-item d-flex align-items-center" href="#">
                                                        <div className="me-3">
                                                            <div className="bg-primary icon-circle">
                                                                <i className="fas fa-file-alt text-white"></i>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="small text-gray-500">12 de Diciembre, 2023</span>
                                                            <p>¡Un nuevo informe mensual está listo para descargar!</p>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </li>
                                        <div className="d-none d-sm-block topbar-divider"></div>
                                        <li className="nav-item dropdown no-arrow">
                                            <div className="nav-item dropdown no-arrow">
                                                <a className="dropdown-toggle nav-link" aria-expanded="false" data-bs-toggle="dropdown" href="">
                                                    <span id="usernameDisplay" className="d-none d-lg-inline me-2 text-gray-600 small">
                                                        Autenticarse
                                                    </span>
                                                </a>
                                                <div className="dropdown-menu shadow dropdown-menu-end animated--grow-in">
                                                    <a className="dropdown-item" href="#">
                                                        <i className="fas fa-user fa-sm fa-fw me-2 text-gray-400"></i>&nbsp;Perfil
                                                    </a>
                                                    <div className="dropdown-divider"></div>
                                                    <a className="dropdown-item logout-button" href="/login">
                                                        <i className="fas fa-sign-in-alt fa-sm fa-fw me-2 text-gray-400"></i>
                                                        <span> Login</span>
                                                    </a>
                                                    <div className="dropdown-divider"></div>
                                                    <a className="dropdown-item logout-button" href="/login" id="logoutButton">
                                                        <i className="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400"></i>&nbsp;Cerrar Sesión
                                                    </a>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </nav>

                            {/* Tabla de trabajadores */}
                            <div className="container-fluid">
                                <div className="card shadow">
                                    <div className="card-header py-3 d-flex justify-content-between align-items-center">
                                        <h1 className="m-0">Control de trabajadores</h1>
                                        <div className="d-flex align-items-center">
                                            <a onClick={() => navigate('/add-trabajador')} className="text-primary ms-3" title="Nuevo Trabajador">
                                                <i className="fas fa-plus-circle fa-2x"></i>
                                            </a>
                                            <button id="exportExcel" className="btn btn-success ms-3">
                                                Exportar Excel
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Nombre</th>
                                                        <th>Primer Apellido</th>
                                                        <th>Segundo Apellido</th>
                                                        <th>Conferencias</th>
                                                        <th>Clases Prácticas</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredWorkers.map((worker, index) => (
                                                        <tr key={index}>
                                                            <td>{worker.nombre}</td>
                                                            <td>{worker.primer_apellido}</td>
                                                            <td>{worker.segundo_apellido}</td>
                                                            <td>{worker.cantidad_grupo_c}</td>
                                                            <td>{worker.cantidad_grupo_cp}</td>
                                                            <td>
                                                                <button className="btn btn-primary btn-sm" onClick={() => verTrabajador(worker.id_trabajador)}>
                                                                    <i className="fas fa-eye"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-warning btn-sm ms-2"
                                                                    onClick={() => navigate(`/editar-trabajador/${worker.id_trabajador}`)}
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <button className="btn btn-danger btn-sm ms-2" onClick={() => eliminarTrabajador(worker.id_trabajador)}>
                                                                    <i className="fas fa-trash-alt"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <footer className="bg-white">
                            <div className="text-center my-auto copyright">
                                <span>Copyright © UCI 2025</span>
                            </div>
                        </footer>
                    </div>
                    <a className="border rounded d-inline scroll-to-top" href="#page-top">
                        <i className="fas fa-angle-up"></i>
                    </a>
                </div>
            </div>
        </Container>
    );
};

export default Control;