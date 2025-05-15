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

        const username = event.target.username.value.trim();
        const password = event.target.password.value;

        const data = {
            username: username,
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
                console.log('Respuesta de la API:', result);

                if (result.token) {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('username', username);
                    console.log('Token guardado en localStorage:', result.token);
                    console.log('Usuario guardado en localStorage:', username); // Verifica el valor
                }

                await Swal.fire({
                    icon: 'success',
                    title: '¡Inicio de sesión exitoso!',
                    text: 'Bienvenido a nuestra web.',
                });
                
                navigate('/welcome');
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error en la API:', errorData);
                
                // Limpiar token en caso de error
                if (!response.ok) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorData.message || 'Hubo un problema al iniciar sesión.',
                });
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            
            // Limpiar token en caso de error
            localStorage.removeItem('token');
            localStorage.removeItem('username');

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