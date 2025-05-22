import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../assets/styles/Register.css'; // Ruta corregida
import { useTheme } from '../Home/ThemeContext';
import { FaBook, FaUserTie } from 'react-icons/fa';


const Register = () => {
    const history = useNavigate();
    const { darkMode } = useTheme();
    const navigate = useNavigate();

    const handleCreateAsignatura = () => {
    navigate('/create-asignatura'); // Redirige al componente AsignaturaCreate
     };

    const handleEspecialistasControl = () => {
    navigate('/especialistas'); // Redirige al componente Especialistas
     };

    const [roleOptions, setRoleOptions] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);
    const [roleError, setRoleError] = useState('');

    useEffect(() => {
      const fetchRoles = async () => {
        setIsLoadingRoles(true);
        setRoleError('');
        
        try {
          const response = await fetch('http://10.10.1.1:8000/api/v1/groups/');
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          
          const data = await response.json();
          setRoleOptions(data);
          
          // Seleccionar el primer rol por defecto si hay opciones
          if (data.length > 0) {
            setSelectedRole(data[0].id);
          }
        } catch (error) {
          console.error('Error al cargar roles:', error);
          setRoleError('No se pudieron cargar los roles. Por favor, inténtalo más tarde.');
        } finally {
          setIsLoadingRoles(false);
        }
      };
      
      fetchRoles();
    }, []);

    const handleRoleChange = (e) => {
      setSelectedRole(e.target.value);
    };

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
        password_repeat: passwordRepeat,
        role: selectedRole
    };

    try {
        // Hacer la solicitud POST a la API
        const response = await fetch('http://10.10.1.1:8000/api/v1/register/', {
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
            
            // Crear un mensaje de error más específico basado en el tipo de error
            let errorMessage = 'Hubo un problema al registrar la cuenta.';
            
            // Verificar si hay errores específicos en la respuesta
            if (errorData.username) {
                errorMessage = `Error de nombre de usuario: ${errorData.username.join(', ')}`;
            } else if (errorData.email) {
                errorMessage = `Error de correo electrónico: ${errorData.email.join(', ')}`;
            } else if (errorData.password) {
                errorMessage = `Error de contraseña: ${errorData.password.join(', ')}`;
            } else if (errorData.non_field_errors) {
                errorMessage = errorData.non_field_errors.join(', ');
            } else if (errorData.detail) {
                errorMessage = errorData.detail;
            } else if (errorData.message) {
                errorMessage = errorData.message;
            }
            
            // Si hay múltiples errores, mostrarlos todos
            if (Object.keys(errorData).length > 1) {
                const allErrors = [];
                for (const [field, errors] of Object.entries(errorData)) {
                    if (Array.isArray(errors)) {
                        allErrors.push(`${field}: ${errors.join(', ')}`);
                    } else if (typeof errors === 'string') {
                        allErrors.push(`${field}: ${errors}`);
                    }
                }
                
                if (allErrors.length > 0) {
                    errorMessage = allErrors.join('\n');
                }
            }

            // Mostrar mensaje de error con SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Error de registro',
                text: errorMessage,
                html: errorMessage.replace(/\n/g, '<br>'),
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
        <div className="form-scroll-container"> 
           <div className="header-container">
                <h1 className="header-title">Agregar Trabajador</h1>
            <div className="button-group">
                <button 
                    className="create-asignatura-button right-align-button" 
                    onClick={handleCreateAsignatura} 
                    title="Crear Asignatura">
                    <FaBook className="create-asignatura-icon" />
                </button>
            
                 <button
                    className="control-especialistas-button right-align-button"
                    onClick={handleEspecialistasControl}
                    title="Control de Especialistas">
                    <FaUserTie className="control-especialistas-icon" />
                </button>
                </div>
                </div><br/>
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

                {/* Nuevo campo desplegable */}
                <div className="form-group">
                    <label htmlFor="role">Rol de Usuario</label>
                    <select
                        id="role"
                        value={selectedRole}
                        onChange={handleRoleChange}
                        disabled={isLoadingRoles}
                        required
                    >
                        {isLoadingRoles ? (
                            <option value="">Cargando roles...</option>
                        ) : (
                            <>
                                <option value="">Selecciona un rol</option>
                                {roleOptions.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </>
                        )}
                    </select>
                    {roleError && <div className="error-message">{roleError}</div>}
                </div>

                {/* Botón de registrar */}
                <button type="submit" className="register-button">Registrar</button>
            </form>
        </div>
    </div>
    );
};

export default Register;