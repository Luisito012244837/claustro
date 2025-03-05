
// Función para manejar el logout
async function handleLogout() {
    try {
        // Mostrar indicador de carga
        const logoutButton = document.querySelector('.logout-button');
        logoutButton.innerHTML = '<i class="fas fa-spinner fa-spin fa-sm fa-fw me-2 text-gray-400"></i>&nbsp;Cerrando sesión...';
        
        // Llamar a la API de logout
        const response = await fetch('http://192.168.138.176:8000/apiv1/logout/', {
            method: 'POST',
            credentials: 'include' // Importante para mantener las cookies de sesión
        });
        
        if (!response.ok) {
            throw new Error('Error al cerrar sesión');
        }
        
        // Redireccionar a la página de login
        window.location.href = 'login.html';
        
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Hubo un error al cerrar sesión. Por favor, intenta nuevamente.');
        
        // Restaurar el botón
        const logoutButton = document.querySelector('.logout-button');
        logoutButton.innerHTML = '<i class="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400"></i>&nbsp;Logout';
    }
}

// Agregar el event listener al documento
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
});