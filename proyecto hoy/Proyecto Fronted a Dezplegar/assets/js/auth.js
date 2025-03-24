// auth.js

document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username'); // Obtener el nombre de usuario
    const role = localStorage.getItem('role'); // Obtener el rol del usuario
    const gestionLink = document.querySelector('a[href="gestion.html"]'); // Seleccionar el enlace de Gestión

    if (gestionLink) {
        // Verificar si el usuario es "niurvisdfp" o si tiene el rol de administrador
        if (username === 'niurvisdfp' || role === 'supervisor') {
            gestionLink.style.display = 'block'; // Mostrar el enlace de Gestión
        } else {
            gestionLink.style.display = 'none'; // Ocultar el enlace de Gestión
        }
    }
});

// En el botón de cerrar sesión
document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token'); // Eliminar el token
    localStorage.removeItem('username'); // Eliminar el nombre de usuario
    localStorage.removeItem('role'); // Eliminar el rol
    window.location.href = 'login.html'; // Redirigir al login
});