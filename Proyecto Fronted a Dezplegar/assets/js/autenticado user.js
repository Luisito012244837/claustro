
    // Recuperar el nombre de usuario al cargar la página
        window.onload = function() {
        const username = localStorage.getItem('username'); // Obtener el nombre de usuario de localStorage
         if (username) {
        document.getElementById('usernameDisplay').textContent = username; // Mostrar el nombre de usuario
        }
    };

// Funcionalidad para el botón de logout
document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('token'); // Eliminar el token
    localStorage.removeItem('username'); // Eliminar el nombre de usuario
    window.location.href = 'login.html'; // Redirigir a la página de login
});
   