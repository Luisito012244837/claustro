import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { loginSuccess, setLoading } from '../../redux/authSlice';
import '../../assets/styles/Authentication.css';
import '../../assets/styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (isSubmitting) return;
        
        const usernameInput = event.target.username.value.trim();
        const password = event.target.password.value;

        // Validaciones
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

        setIsSubmitting(true);
        dispatch(setLoading(true));

        try {
            console.log('Enviando solicitud de login...');
            
            const response = await fetch('http://10.10.1.1:8000/api/v1/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log('Respuesta recibida:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('Datos de respuesta:', result);

                const accessToken = result.access;
                const refreshToken = result.refresh;
                
                if (!accessToken) {
                    console.error('No se recibió access token');
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error en la respuesta del servidor.',
                    });
                    return;
                }

                // Crear objeto de usuario con la estructura que devuelve tu API
                const userData = {
                    id: result.user?.id || result.user_id || Date.now(),
                    username: result.user?.username || usernameInput,
                    email: result.user?.email || '',
                    first_name: result.user?.first_name || '',
                    last_name: result.user?.last_name || '',
                    rol: result.user?.rol || 'user', // Usar 'rol' como viene de la API
                    // También mantener 'role' para compatibilidad
                    role: result.user?.rol || 'user'
                };

                console.log('Datos del usuario procesados:', userData);

                try {
                    // Limpiar valores anteriores
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('username');
                    localStorage.removeItem('userRole');

                    // Guardar nuevos valores
                    localStorage.setItem('token', accessToken);
                    localStorage.setItem('user', JSON.stringify(userData));
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('username', userData.username);
                    localStorage.setItem('userRole', userData.rol);

                    console.log('Datos guardados correctamente');
                } catch (storageError) {
                    console.error('Error con localStorage:', storageError);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al guardar los datos de sesión.',
                    });
                    return;
                }

                // Actualizar Redux store
                dispatch(loginSuccess({
                    user: userData,
                    token: accessToken
                }));

                console.log('Mostrando mensaje de éxito...');
                
                // Mostrar mensaje de éxito con nombre completo
                const displayName = userData.first_name ? 
                    `${userData.first_name} ${userData.last_name}`.trim() : 
                    userData.username;

                await Swal.fire({
                    icon: 'success',
                    title: '¡Inicio de sesión exitoso!',
                    text: `Bienvenido ${displayName}.`,
                    timer: 2000,
                    showConfirmButton: false
                });

                // Evento personalizado para notificar al NavBar
                const loginEvent = new CustomEvent('userLoggedIn', {
                    detail: { 
                        username: userData.username, 
                        role: userData.rol,
                        fullName: displayName
                    }
                });
                window.dispatchEvent(loginEvent);

                console.log('Login exitoso, redirigiendo...');
                
            } else {
                console.error('Error en respuesta:', response.status);
                const errorData = await response.json().catch(() => ({}));
                
                localStorage.clear();
                sessionStorage.clear();
                
                let errorMessage = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
                
                if (response.status === 401) {
                    errorMessage = 'Usuario o contraseña incorrectos.';
                } else if (response.status === 403) {
                    errorMessage = 'Acceso denegado. Contacta al administrador.';
                } else if (response.status >= 500) {
                    errorMessage = 'Error del servidor. Inténtalo más tarde.';
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Error de autenticación',
                    text: errorData.detail || errorMessage,
                });
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            
            localStorage.clear();
            sessionStorage.clear();
            
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar al servidor. Verifica tu conexión e inténtalo de nuevo.',
            });
        } finally {
            setIsSubmitting(false);
            dispatch(setLoading(false));
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
                            disabled={isSubmitting || isLoading}
                            autoComplete="username"
                        />
                    </div>
                    <div className="form-group password-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            required
                            disabled={isSubmitting || isLoading}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="show-password-icon"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            disabled={isSubmitting || isLoading}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={isSubmitting || isLoading ? 'loading' : ''}
                    >
                        {isSubmitting || isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                    <div className="register-link">
                        <a href="/change-password">Cambiar Contraseña</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
