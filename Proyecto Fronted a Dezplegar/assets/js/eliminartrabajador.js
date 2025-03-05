
document.querySelector('.btnEliminar').addEventListener('click', function() {
    const idTrabajador = this.getAttribute('data-id');
    const url = `http://192.168.138.6:8000/apiv2/trabajador/${idTrabajador}/`; // Reemplaza con tu URL

    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire(
                        '¡Eliminado!',
                        'El trabajador ha sido eliminado.',
                        'success'
                    );
                } else {
                    Swal.fire(
                        'Error',
                        'Hubo un problema al eliminar el trabajador.',
                        'error'
                    );
                }
            })
            .catch(error => {
                Swal.fire(
                    'Error',
                    'Hubo un problema con la solicitud.',
                    'error'
                );
            });
        }
    });
});
