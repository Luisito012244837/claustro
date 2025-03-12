document.getElementById('registerForm').addEventListener('submit', function(event) {
    var firstName = document.getElementById('exampleFirstName').value;
    var lastName = document.getElementById('exampleLastName').value;
    var email = document.getElementById('exampleInputEmail').value;
    var password = document.getElementById('examplePasswordInput').value;
    var repeatPassword = document.getElementById('exampleRepeatPasswordInput').value;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName || !lastName || !email || !password || !repeatPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, complete todos los campos.',
            width: '300px', // Ancho más pequeño
            padding: '10px', // Menos padding
            background: '#f8f9fa', // Fondo claro
            confirmButtonColor: '#20c997', // Botón verde azulado
            customClass: {
                popup: 'small-swal', // Clase personalizada
            },
        });
        event.preventDefault();
    } else if (!emailPattern.test(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, introduzca una dirección de correo electrónico válida.',
            width: '300px',
            padding: '10px',
            background: '#f8f9fa',
            confirmButtonColor: '#20c997', // Botón verde azulado
            customClass: {
                popup: 'small-swal',
            },
        });
        event.preventDefault();
    } else if (password !== repeatPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las contraseñas no coinciden.',
            width: '300px',
            padding: '10px',
            background: '#f8f9fa',
            confirmButtonColor: '#20c997', // Botón verde azulado
            customClass: {
                popup: 'small-swal',
            },
        });
        event.preventDefault();
    }
});