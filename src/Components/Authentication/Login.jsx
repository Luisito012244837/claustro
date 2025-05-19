import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../assets/styles/Authentication.css';
import '../../assets/styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const usernameInput = event.target.username.value.trim();
        const password = event.target.password.value;

        if (!usernameInput) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El nombre de usuario no puede estar vacío.',
            });
            return;
        }


       
        if (!password) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La contraseña no puede estar vacía.',
            });
            return;
        }

        const data = {
            username: usernameInput,
            password: password
        };

        try {
            const response = await fetch('http://10.10.1.1:8000/api/v1/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();

                const token = result.token || result.Token;


                              
                let username = usernameInput;

                // Si hay un objeto user en la respuesta, intentar obtener el username de allí
                if (result.user && result.user.username) {
                    username = result.user.username;
                }

                // Obtener el rol del usuario de la respuesta
                let userRole = 'user'; // Valor predeterminado
                if (result.user && result.user.role) {
                    userRole = result.user.role;
                }

                if (token) {
                    try {
                        // Limpiar valores anteriores
                        localStorage.clear();

                               
                        // Guardar nuevos valores
                        localStorage.setItem('token', token);
                        localStorage.setItem('username', username);

                        localStorage.setItem('userRole', userRole); // Guardar el rol del usuario
                               
                        // Verificación inmediata
                        const storedUsername = localStorage.getItem('username');

                               
                        // Si localStorage falla, usar sessionStorage
                        if (!storedUsername) {
                            console.log('localStorage falló, usando sessionStorage');
                            sessionStorage.setItem('token', token);
                            sessionStorage.setItem('username', username);
                            sessionStorage.setItem('userRole', userRole); // Guardar el rol en sessionStorage también
                        }
                    } catch (storageError) {
                        try {
                            sessionStorage.setItem('token', token);
                            sessionStorage.setItem('username', username);

                            sessionStorage.setItem('userRole', userRole); // Guardar el rol en sessionStorage
                        } catch (e) {

                            // Error al guardar en sessionStorage
                        }
                    }
                }

                await Swal.fire({
                    icon: 'success',
                    title: '¡Inicio de sesión exitoso!',
                    text: 'Bienvenido a nuestra web.',
                });

               
                // Crear un evento personalizado para notificar al NavBar


                const loginEvent = new CustomEvent('userLoggedIn', {
                    detail: { username: username, role: userRole }
                });
                window.dispatchEvent(loginEvent);

               
                // Navegar a welcome
                navigate('/welcome');
            } else {
                const errorData = await response.json().catch(() => ({}));

               
                try {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    localStorage.removeItem('userRole'); // Eliminar también el rol
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('username');
                    sessionStorage.removeItem('userRole'); // Eliminar también el rol
                } catch (e) {
                    console.error('Error al limpiar storage:', e);
                }

               
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorData.message || 'Hubo un problema al iniciar sesión.',
                });
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);

           
            try {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('userRole'); // Eliminar también el rol
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('username');
                sessionStorage.removeItem('userRole'); // Eliminar también el rol
            } catch (e) {
                console.error('Error al limpiar storage:', e);
            }

            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar al servidor. Inténtalo de nuevo más tarde.',
            });
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Usuario</label>





                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                        />
                    </div>
                    <div className="form-group password-group">
                        <label htmlFor="password">Contraseña</label>





                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            required
                        />
                        <button
                            type="button"
                            className="show-password-icon"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    <button type="submit">Iniciar Sesión</button>
                    <div className="register-link">
                        <a href="/change-password">Cambiar Contraseña</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
