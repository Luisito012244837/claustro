import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../assets/styles/Authentication.css';
import '../../assets/styles/Login.css';

const Login = () => {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const username = event.target.username.value;
        const password = event.target.password.value;

        const data = {
            username: username,
            password: password
        };

        try {
            const response = await fetch('http://10.10.1.1:8000/apiv1/login/', {
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
                    console.log('Token guardado en localStorage:', result.token);
                }

                Swal.fire({
                    icon: 'success',
                    title: '¡Inicio de sesión exitoso!',
                    text: 'Bienvenido a nuestra web.',
                }).then(() => {
                    localStorage.setItem('username', username);
                    navigate('/index');
                });
            } else {
                const errorData = await response.json();
                console.error('Error en la API:', errorData);

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorData.message || 'Hubo un problema al iniciar sesión.',
                });
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);

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
                        <input type="text" id="username" name="username" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" name="password" required />
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