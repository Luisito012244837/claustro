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

        // Validaciones (manteniendo tus validaciones actuales)
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
            // Cambiamos el endpoint al de SimpleJWT
            const response = await fetch('http://10.10.1.1:8000/api/v1/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();

                // SimpleJWT devuelve access y refresh tokens
                const accessToken = result.access;
                const refreshToken = result.refresh;
                
                // Obtenemos el username del input (puedes adaptar esto si tu backend devuelve más info)
                let username = usernameInput;
                let userRole = 'user'; // Valor por defecto

                // Si necesitas más datos del usuario, puedes hacer una petición adicional
                try {
                    const userResponse = await fetch('http://10.10.1.1:8000/api/users/me/', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        username = userData.username || username;
                        userRole = userData.role || userRole;
                    }
                } catch (userInfoError) {
                    console.log('Error obteniendo info del usuario:', userInfoError);
                }

                if (accessToken) {
                    try {
                        // Limpiar valores anteriores
                        localStorage.clear();

                        // Guardar nuevos valores (adaptado para SimpleJWT)
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', refreshToken);
                        localStorage.setItem('username', username);
                        localStorage.setItem('userRole', userRole);

                        // Verificación inmediata
                        const storedUsername = localStorage.getItem('username');

                        // Si localStorage falla, usar sessionStorage
                        if (!storedUsername) {
                            console.log('localStorage falló, usando sessionStorage');
                            sessionStorage.setItem('accessToken', accessToken);
                            sessionStorage.setItem('refreshToken', refreshToken);
                            sessionStorage.setItem('username', username);
                            sessionStorage.setItem('userRole', userRole);
                        }
                    } catch (storageError) {
                        try {
                            sessionStorage.setItem('accessToken', accessToken);
                            sessionStorage.setItem('refreshToken', refreshToken);
                            sessionStorage.setItem('username', username);
                            sessionStorage.setItem('userRole', userRole);
                        } catch (e) {
                            console.error('Error al guardar en sessionStorage:', e);
                        }
                    }
                }

                await Swal.fire({
                    icon: 'success',
                    title: '¡Inicio de sesión exitoso!',
                    text: 'Bienvenido a nuestra web.',
                });

                // Evento personalizado para notificar al NavBar
                const loginEvent = new CustomEvent('userLoggedIn', {
                    detail: { username: username, role: userRole }
                });
                window.dispatchEvent(loginEvent);

                // Navegar a welcome
                navigate('/welcome');
            } else {
                const errorData = await response.json().catch(() => ({}));

                try {
                    // Limpiar todos los tokens y datos
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('username');
                    localStorage.removeItem('userRole');
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('refreshToken');
                    sessionStorage.removeItem('username');
                    sessionStorage.removeItem('userRole');
                } catch (e) {
                    console.error('Error al limpiar storage:', e);
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorData.detail || 'Credenciales inválidas. Por favor, inténtalo de nuevo.',
                });
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);

            try {
                // Limpiar todos los tokens y datos en caso de error
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('username');
                localStorage.removeItem('userRole');
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
                sessionStorage.removeItem('username');
                sessionStorage.removeItem('userRole');
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