import React from 'react';
import { useNavigate  } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../assets/styles/Authentication.css'; // Importa los estilos CSS
import '../../assets/styles/Login.css'; // Importa los estilos CSS

const Login = () => {
    const navigate  = useNavigate ();

    const handleSubmit = async (event) => {
        event.preventDefault(); // Evitar el envío tradicional

        // Obtener los valores del formulario
        const username = event.target.username.value;
        const password = event.target.password.value;

        // Datos para enviar a la API
        const data = {
            username: username,
            password: password
        };

        try {
            // Hacer la solicitud POST a la API
            const response = await fetch('http://10.10.1.1:8000/apiv1/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Verificar si la respuesta es exitosa
            if (response.ok) {
                const result = await response.json();
                console.log('Respuesta de la API:', result);

                // Guardar el token en localStorage
                if (result.token) {
                    localStorage.setItem('token', result.token); // Guardar el token
                    console.log('Token guardado en localStorage:', result.token);
                }

                // Mostrar mensaje de éxito con SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: '¡Inicio de sesión exitoso!',
                    text: 'Bienvenido a nuestra web.',
                }).then(() => {
                    // Guardar el nombre de usuario en localStorage
                    localStorage.setItem('username', username); // Guardar el nombre de usuario

                    // Redirigir al usuario después del login
                    navigate.push('/index'); // Cambia la ruta según tu aplicación
                });
            } else {
                // Manejar errores de la API
                const errorData = await response.json();
                console.error('Error en la API:', errorData);

                // Mostrar mensaje de error con SweetAlert2
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorData.message || 'Hubo un problema al iniciar sesión.',
                });
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);

            // Mostrar mensaje de error en caso de fallo en la conexión
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
                </form>
            </div>
        </div>
    );
};

export default Login;