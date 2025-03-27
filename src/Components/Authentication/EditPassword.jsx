import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../assets/styles/Authentication.css';
import '../../assets/styles/Login.css';

const EditPassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.username) newErrors.username = 'El nombre de usuario es requerido';
        if (!formData.currentPassword) newErrors.currentPassword = 'La contraseña actual es requerida';
        if (!formData.newPassword) newErrors.newPassword = 'La nueva contraseña es requerida';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Debes confirmar la nueva contraseña';
        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) return;

        try {
            const response = await fetch('http://10.10.1.1:8000/apiv1/change-password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.Password,
                    new_password: formData.newPassword
                })
            });

            if (response.ok) {
                const result = await response.json();
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Se ha cambiado la contraseña satisfactoriamente',
                    icon: 'success',
                    confirmButtonColor: '#ff7b00',
                    background: '#ffffff',
                    backdrop: `
                        rgba(255, 123, 0, 0.4)
                        url("/images/nyan-cat.gif")
                        left top
                        no-repeat
                    `,
                    customClass: {
                        title: 'swal-title',
                        content: 'swal-text',
                        confirmButton: 'swal-button'
                    },
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                }).then(() => {
                    navigate('/login');
                });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorData.message || 'Hubo un problema al cambiar la contraseña.',
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
                <h2>Cambiar Contraseña</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Nombre de Usuario</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            value={formData.username}
                            onChange={handleChange}
                            required 
                        />
                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>
                    
                    <div className="form-group password-group">
                        <label htmlFor="currentPassword">Contraseña Actual</label>
                        <input 
                            type={showCurrentPassword ? "text" : "password"} 
                            id="currentPassword" 
                            name="currentPassword" 
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required 
                        />
                        <button
                            type="button"
                            className="show-password-icon"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            aria-label={showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                        {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                    </div>
                    
                    <div className="form-group password-group">
                        <label htmlFor="newPassword">Nueva Contraseña</label>
                        <input 
                            type={showNewPassword ? "text" : "password"} 
                            id="newPassword" 
                            name="newPassword" 
                            value={formData.newPassword}
                            onChange={handleChange}
                            required 
                        />
                        <button
                            type="button"
                            className="show-password-icon"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showNewPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                        {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                    </div>
                    
                    <div className="form-group password-group">
                        <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required 
                        />
                        <button
                            type="button"
                            className="show-password-icon"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>
                    
                    <button type="submit">Cambiar Contraseña</button>
                </form>
            </div>
        </div>
    );
};

export default EditPassword;