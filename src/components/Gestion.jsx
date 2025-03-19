import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importa useNavigate y Link
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../assets/css/bootstrap.min.css";
import "../assets/fonts/fontawesome-all.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Importa Bootstrap JS
import "../assets/css/Gestion.css"; // Importa el archivo CSS de Gestion

const Gestion = () => {
    const navigate = useNavigate(); // Inicializa useNavigate

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

        // Código para inicializar Bootstrap y agregar validaciones
        (function () {
            "use strict"; // Start of use strict

            var sidebar = document.querySelector(".sidebar");
            var sidebarToggles = document.querySelectorAll(
                "#sidebarToggle, #sidebarToggleTop"
            );

            if (sidebar) {
                var collapseEl = sidebar.querySelector(".collapse");
                var collapseElementList = [].slice.call(
                    document.querySelectorAll(".sidebar .collapse")
                );
                var sidebarCollapseList = collapseElementList.map(function (
                    collapseEl
                ) {
                    return new window.bootstrap.Collapse(collapseEl, {
                        toggle: false,
                    }); // Cambia bootstrap a window.bootstrap
                });

                for (var toggle of sidebarToggles) {
                    // Toggle the side navigation
                    toggle.addEventListener("click", function (e) {
                        document.body.classList.toggle("sidebar-toggled");
                        sidebar.classList.toggle("toggled");

                        if (sidebar.classList.contains("toggled")) {
                            for (var bsCollapse of sidebarCollapseList) {
                                bsCollapse.hide();
                            }
                        }
                    });
                }

                // Close any open menu accordions when window is resized below 768px
                window.addEventListener("resize", function () {
                    var vw = Math.max(
                        document.documentElement.clientWidth || 0,
                        window.innerWidth || 0
                    );

                    if (vw < 768) {
                        for (var bsCollapse of sidebarCollapseList) {
                            bsCollapse.hide();
                        }
                    }
                });
            }

            // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
            var fixedNaigation = document.querySelector("body.fixed-nav .sidebar");
            if (fixedNaigation) {
                fixedNaigation.on("mousewheel DOMMouseScroll wheel", function (e) {
                    var vw = Math.max(
                        document.documentElement.clientWidth || 0,
                        window.innerWidth || 0
                    );

                    if (vw > 768) {
                        var e0 = e.originalEvent,
                            delta = e0.wheelDelta || -e0.detail;
                        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
                        e.preventDefault();
                    }
                });
            }

            var scrollToTop = document.querySelector(".scroll-to-top");
            if (scrollToTop) {
                // Scroll to top button appear
                window.addEventListener("scroll", function () {
                    var scrollDistance = window.pageYOffset;

                    // Check if user is scrolling up
                    if (scrollDistance > 100) {
                        scrollToTop.style.display = "block";
                    } else {
                        scrollToTop.style.display = "none";
                    }
                });
            }
        })(); // End of use strict

        // Validaciones al enviar el formulario
        document
            .getElementById("registerForm")
            .addEventListener("submit", function (event) {
                var firstName = document.getElementById("exampleFirstName").value;
                var lastName = document.getElementById("exampleLastName").value;
                var email = document.getElementById("exampleInputEmail").value;
                var password = document.getElementById("examplePasswordInput").value;
                var repeatPassword = document.getElementById(
                    "exampleRepeatPasswordInput"
                ).value;
                var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!firstName || !lastName || !email || !password || !repeatPassword) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Por favor, complete todos los campos.",
                        width: "300px",
                        padding: "10px",
                        background: "#f8f9fa",
                        confirmButtonColor: "#20c997",
                        customClass: {
                            popup: "small-swal",
                        },
                    });
                    event.preventDefault();
                } else if (!emailPattern.test(email)) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Por favor, introduzca una dirección de correo electrónico válida.",
                        width: "300px",
                        padding: "10px",
                        background: "#f8f9fa",
                        confirmButtonColor: "#20c997",
                        customClass: {
                            popup: "small-swal",
                        },
                    });
                    event.preventDefault();
                } else if (password !== repeatPassword) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Las contraseñas no coinciden.",
                        width: "300px",
                        padding: "10px",
                        background: "#f8f9fa",
                        confirmButtonColor: "#20c997",
                        customClass: {
                            popup: "small-swal",
                        },
                    });
                    event.preventDefault();
                }
            });
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Evitar el envío tradicional

        // Obtener los valores del formulario
        const username = document.getElementById("exampleInputusername").value;
        const firstName = document.getElementById("exampleFirstName").value;
        const lastName = document.getElementById("exampleLastName").value;
        const email = document.getElementById("exampleInputEmail").value;
        const password = document.getElementById("examplePasswordInput").value;
        const passwordRepeat = document.getElementById("exampleRepeatPasswordInput").value;

        // Datos para enviar a la API
        const data = {
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            password_repeat: passwordRepeat,
        };

        try {
            // Hacer la solicitud POST a la API
            const response = await fetch("http://10.10.1.1:8000/apiv1/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            // Verificar si la respuesta es exitosa
            if (response.ok) {
                const result = await response.json();
                console.log("Respuesta de la API:", result);

                // Mostrar mensaje de éxito con SweetAlert2
                Swal.fire({
                    icon: "success",
                    title: "¡Registro exitoso!",
                    text: "Tu cuenta ha sido creada correctamente.",
                }).then(() => {
                    // Redirigir al usuario después del registro
                    window.location.href = "/login"; // Cambia la URL según tu aplicación
                });
            } else {
                // Manejar errores de la API
                const errorData = await response.json();
                console.error("Error en la API:", errorData);

                // Mostrar mensaje de error con SweetAlert2
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorData.message || "Hubo un problema al registrar la cuenta.",
                });
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);

            // Mostrar mensaje de error en caso de fallo en la conexión
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo conectar al servidor. Inténtalo de nuevo más tarde.",
            });
        }
    };

    return (
        <div id="page-top">
            <div id="wrapper">
                {/* Contenido principal */}
                <div className="d-flex flex-column" id="content-wrapper">
                    <div id="content">
                        {/* Barra de navegación superior */}
                        <nav className="navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top">
                            <div className="container-fluid">
                                <button
                                    className="btn btn-link d-md-none rounded-circle me-3"
                                    id="sidebarToggleTop"
                                    type="button"
                                >
                                    <i className="fas fa-bars"></i>
                                </button>
                                <ul className="navbar-nav flex-nowrap ms-auto">
                                    <li className="nav-item dropdown no-arrow mx-1">
                                        <div className="nav-item dropdown no-arrow">
                                            <a
                                                className="dropdown-toggle nav-link"
                                                aria-expanded="false"
                                                data-bs-toggle="dropdown"
                                                href="#"
                                            >
                                                <span className="badge bg-danger badge-counter">3</span>
                                                <i className="fas fa-bell fa-fw"></i>
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-end dropdown-list animated--grow-in">
                                                <h6 className="dropdown-header">Centro de Alertas</h6>
                                                <div className="dropdown-list">
                                                    <a className="dropdown-item text-gray-800" href="#">
                                                        <div className="text-truncate">
                                                            Se ha añadido un nuevo trabajador al sistema.
                                                        </div>
                                                        <div className="small text-gray-500">Hace 2 minutos</div>
                                                    </a>
                                                    <a className="dropdown-item text-gray-800" href="#">
                                                        <div className="text-truncate">
                                                            Se ha modificado la información de un trabajador.
                                                        </div>
                                                        <div className="small text-gray-500">Hace 10 minutos</div>
                                                    </a>
                                                    <a className="dropdown-item text-gray-800" href="#">
                                                        <div className="text-truncate">
                                                            Se ha eliminado un trabajador del sistema.
                                                        </div>
                                                        <div className="small text-gray-500">Hace 30 minutos</div>
                                                    </a>
                                                </div>
                                                <a
                                                    className="dropdown-item text-center small text-gray-500"
                                                    href="#"
                                                >
                                                    Ver todas las notificaciones
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                    <div className="d-none d-sm-block topbar-divider"></div>
                                    <li className="nav-item dropdown no-arrow">
                                        <div className="nav-item dropdown no-arrow">
                                            <a
                                                className="dropdown-toggle nav-link"
                                                aria-expanded="false"
                                                data-bs-toggle="dropdown"
                                                href="#"
                                            >
                                                <span
                                                    id="usernameDisplay"
                                                    className="d-none d-lg-inline me-2 text-gray-600 small"
                                                >
                                                    Autenticarse
                                                </span>
                                            </a>
                                            <div className="dropdown-menu shadow dropdown-menu-end animated--grow-in">
                                                <a className="dropdown-item" href="perfil.html">
                                                    <i className="fas fa-user fa-sm fa-fw me-2 text-gray-400"></i>
                                                    &nbsp;Perfil
                                                </a>
                                                <div className="dropdown-divider"></div>
                                                <a className="dropdown-item" href="/login">
                                                    <i className="fas fa-sign-in-alt fa-sm fa-fw me-2 text-gray-400"></i>
                                                    <span> Login</span>
                                                </a>
                                                <div className="dropdown-divider"></div>
                                                <a
                                                    className="dropdown-item logout-button"
                                                    href="#"
                                                    id="logoutButton"
                                                >
                                                    <i className="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400"></i>
                                                    &nbsp;Cerrar Sesión
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </nav>

                        {/* Formulario de registro */}
                        <div className="container-fluid">
                            <div className="card shadow-lg o-hidden border-0">
                                <div className="card-body p-4">
                                    <div className="text-center">
                                        <h4 className="text-dark mb-4">
                                            <b>Añadir usuario</b>
                                        </h4>
                                    </div>
                                    <form className="user" id="registerForm" onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <input
                                                className="form-control form-control-user"
                                                type="text"
                                                id="exampleInputusername"
                                                placeholder="Nombre de usuario"
                                                name="username"
                                                required
                                            />
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-sm-6 mb-3 mb-sm-0">
                                                <input
                                                    className="form-control form-control-user"
                                                    type="text"
                                                    id="exampleFirstName"
                                                    placeholder="Nombre"
                                                    name="first_name"
                                                    required
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                <input
                                                    className="form-control form-control-user"
                                                    type="text"
                                                    id="exampleLastName"
                                                    placeholder="Apellidos"
                                                    name="last_name"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <input
                                                className="form-control form-control-user"
                                                type="email"
                                                id="exampleInputEmail"
                                                placeholder="Dirección de Correo"
                                                name="email"
                                                required
                                            />
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-6 mb-3 mb-sm-0">
                                                <input
                                                    className="form-control form-control-user"
                                                    type="password"
                                                    id="examplePasswordInput"
                                                    placeholder="Contraseña"
                                                    name="password"
                                                    required
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                <input
                                                    className="form-control form-control-user"
                                                    type="password"
                                                    id="exampleRepeatPasswordInput"
                                                    placeholder="Confirmar Contraseña"
                                                    name="password_repeat"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button
                                            className="btn bg-success d-block btn-primary w-100"
                                            type="submit"
                                        >
                                            Registrar cuenta
                                        </button>
                                    </form>
                                  
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
    );
};

export default Gestion;