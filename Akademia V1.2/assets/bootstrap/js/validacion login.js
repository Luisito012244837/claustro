document.getElementById('loginForm').addEventListener('submit', function(event) {
    var email = document.getElementById('exampleInputEmail').value;
    var password = document.getElementById('exampleInputPassword').value;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, complete todos los campos.',
            width: '300px',
            padding: '10px',
            background: '#f8f9fa',
            confirmButtonColor: '#20c997', // Verde azulado
            customClass: {
                popup: 'small-swal',
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
            confirmButtonColor: '#20c997', // Verde azulado
            customClass: {
                popup: 'small-swal',
            },
        });
        event.preventDefault();
    }
});