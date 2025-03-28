import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../assets/styles/Register.css'; // Ruta corregida
import { useTheme } from '../Home/ThemeContext';

const Register = () => {
    const history = useNavigate();
    const { darkMode } = useTheme();

    const handleSubmit = async (event) => {
        event.preventDefault(); // Evitar el envío tradicional

        // Obtener los valores del formulario
        const username = event.target.username.value;
        const firstName = event.target.firstName.value;
        const lastName = event.target.lastName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;
        const passwordRepeat = event.target.passwordRepeat.value;

        // Validar que las contraseñas coincidan
        if (password !== passwordRepeat) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden.',
            });
            return; // Detener el proceso si las contraseñas no coinciden
        }

        // Datos para enviar a la API
        const data = {
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            password_repeat: passwordRepeat
        };

        try {
            // Hacer la solicitud POST a la API
            const response = await fetch('http://10.10.180.6:8000/apiv1/register/', {
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

                // Mostrar mensaje de éxito con SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Tu cuenta ha sido creada correctamente.',
                }).then(() => {
                    // Redirigir al usuario después del registro
                    history('/login'); // Cambia la ruta según tu aplicación
                });
            } else {
                // Manejar errores de la API
                const errorData = await response.json();
                console.error('Error en la API:', errorData);

                // Mostrar mensaje de error con SweetAlert2
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorData.message || 'Hubo un problema al registrar la cuenta.',
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
       <div className={`register-container ${darkMode ? 'dark-theme' : ''}`}>
            <h1>Agregar Trabajador</h1>
            <form className="register-form" onSubmit={handleSubmit}>
                {/* Nombre y Apellido en la misma fila */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">Nombre</label>
                        <input type="text" id="firstName" name="firstName" placeholder="Ingrese el nombre" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Apellido</label>
                        <input type="text" id="lastName" name="lastName" placeholder="Ingrese el apellido" required />
                    </div>
                </div>

                {/* Nombre de usuario */}
                <div className="form-group">
                    <label htmlFor="username">Nombre de usuario</label>
                    <input type="text" id="username" name="username" placeholder="Ingrese el nombre de usuario" required />
                </div>

                {/* Correo electrónico */}
                <div className="form-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input type="email" id="email" name="email" placeholder="Ingrese el correo electrónico" required />
                </div>

                {/* Contraseña */}
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" id="password" name="password" placeholder="Ingrese la contraseña" required />
                </div>

                {/* Confirmar Contraseña */}
                <div className="form-group">
                    <label htmlFor="passwordRepeat">Confirmar Contraseña</label>
                    <input type="password" id="passwordRepeat" name="passwordRepeat" placeholder="Confirme la contraseña" required />
                </div>

                {/* Botón de registrar */}
                <button type="submit" className="register-button">Registrar</button>
            </form>
        </div>
    );
};

export default Register;