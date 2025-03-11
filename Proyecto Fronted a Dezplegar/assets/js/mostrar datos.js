
   // Función para obtener y mostrar los datos de la API
async function cargarDatosTrabajadores() {
    try {
        // Realizar la solicitud a la API
        const response = await fetch('http://10.10.1.1:8000/apiv2/trabajador/');
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la API');
        }

        // Convertir la respuesta a JSON
        const data = await response.json();

        // Obtener el cuerpo de la tabla
        const tbody = document.querySelector('#dataTable tbody');

        // Limpiar el contenido actual de la tabla
        tbody.innerHTML = '';

        // Recorrer los datos y agregar filas a la tabla
        data.forEach(trabajador => {
            const fila = document.createElement('tr');

            // Crear celdas para cada columna
            const celdaNombre = document.createElement('td');
            celdaNombre.textContent = trabajador.nombre;
            fila.appendChild(celdaNombre);

            const celdaPrimerApellido = document.createElement('td');
            celdaPrimerApellido.textContent = trabajador.primer_apellido;
            fila.appendChild(celdaPrimerApellido);

            const celdaSegundoApellido = document.createElement('td');
            celdaSegundoApellido.textContent = trabajador.segundo_apellido;
            fila.appendChild(celdaSegundoApellido);

            const celdaconf = document.createElement('td');
            celdaconf.textContent = trabajador.cantidad_grupo_c; // Asegúrate de que la API devuelva este campo
            fila.appendChild(celdaconf);

            const celdapract = document.createElement('td');
            celdapract.textContent = trabajador.cantidad_grupo_cp; // Asegúrate de que la API devuelva este campo
            fila.appendChild(celdapract);

            // Crear celda para los botones de opciones
            const celdaOpciones = document.createElement('td');

            // Establecer estilo para que los botones se alineen horizontalmente
            celdaOpciones.style.whiteSpace = 'nowrap'; // Evitar que los botones se envuelvan

            // Botón "Ver"
            const btnVer = document.createElement('button');
            btnVer.className = 'btn btn-sm btnVer';
            btnVer.setAttribute('data-id', trabajador.id_trabajador); // Usar id_trabajador
            btnVer.title = 'Ver'; // Tooltip
            const iconVer = document.createElement('i');
            iconVer.className = 'fas fa-eye'; // Ícono de ojo
            btnVer.appendChild(iconVer);
            btnVer.addEventListener('click', () => verTrabajador(trabajador.id_trabajador)); // Usar id_trabajador
            celdaOpciones.appendChild(btnVer);

            // Botón "Editar"
            const btnEditar = document.createElement('a');
            btnEditar.className = 'btn btn-sm btnEditar';
            btnEditar.href = `editar.html?id_trabajador=${trabajador.id_trabajador}`; // Usar id_trabajador
            btnEditar.title = 'Editar'; // Tooltip
            const iconEditar = document.createElement('i');
            iconEditar.className = 'fas fa-edit'; // Ícono de lápiz
            btnEditar.appendChild(iconEditar);
            btnEditar.addEventListener('click', () => editarTrabajador(trabajador.id_trabajador));
            celdaOpciones.appendChild(btnEditar);

            // Botón "Eliminar"
            const btnEliminar = document.createElement('button');
            btnEliminar.className = 'btn btn-sm btnEliminar';
            btnEliminar.setAttribute('data-id', trabajador.id_trabajador); // Usar id_trabajador
            btnEliminar.title = 'Eliminar'; // Tooltip
            const iconEliminar = document.createElement('i');
            iconEliminar.className = 'fas fa-trash-alt'; // Ícono de papelera
            btnEliminar.appendChild(iconEliminar);
            btnEliminar.addEventListener('click', () => eliminarTrabajador(trabajador.id_trabajador)); // Usar id_trabajador
            celdaOpciones.appendChild(btnEliminar);

            // Agregar la celda de opciones a la fila
            fila.appendChild(celdaOpciones);

            // Agregar la fila a la tabla
            tbody.appendChild(fila);
        });

               
            } catch (error) {
                console.error('Error al cargar los datos:', error);
                alert('Hubo un error al cargar los datos. Por favor, intenta nuevamente.');
            }
        }



   // Función para ver los detalles de un trabajador
async function verTrabajador(id_trabajador) {
    try {
        // Obtener los detalles del trabajador desde la API
        const response = await fetch(`http://10.10.1.1:8000/apiv2/getTrabajador/${id_trabajador}/`);
        if (!response.ok) {
            throw new Error('No se pudo obtener la información del trabajador.');
        }

        const trabajador = await response.json();

       // Mostrar un modal con los detalles del trabajador
Swal.fire({
    title: 'Detalles del Trabajador',
    html: `
            <style>
            .custom-modal {
    max-height: 80vh; /* Limitar la altura máxima del modal */
    overflow-y: auto; /* Permitir el desplazamiento vertical */
}

.card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin: 5px 0; /* Reducir el margen */
    padding: 10px; /* Reducir el padding */
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card-header {
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 5px; /* Reducir el margen */
}

.card-header h3 {
    margin: 0;
    font-size: 1.1em; /* Reducir el tamaño de la fuente */
    color: #333;
}

.card-body p {
    margin: 3px 0; /* Reducir el margen */
    color: #555;
}
                
            </style>  
    
        <div class="card">
            <div class="card-header">
                <h3>Información Personal</h3>
            </div>
            <div class="card-body">
                <p><strong>Nombre:</strong> ${trabajador.nombre}</p>
                <p><strong>Primer Apellido:</strong> ${trabajador.primer_apellido}</p>
                <p><strong>Segundo Apellido:</strong> ${trabajador.segundo_apellido || 'No disponible'}</p>
                <p><strong>Sexo:</strong> ${trabajador.sexo}</p>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Categorías y Cursos</h3>
            </div>
            <div class="card-body">
                <p><strong>Categoría docente:</strong> ${trabajador.categorias_docentes.map(cat => cat.nombre_categoria_docente).join(', ') || 'No disponible'}</p>
                <p><strong>Categoría cientifica:</strong> ${trabajador.nombre_categoria_cientifica}</p>
                <p><strong>Cursos:</strong> ${trabajador.tipos_curso.map(cat => cat.nombre_curso).join(', ') || 'No disponible'}</p>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Carreras y Asignaturas</h3>
            </div>
            <div class="card-body">
                <p><strong>Carreras:</strong> ${trabajador.carreras.map(cat => cat.nombre_carrera).join(', ') || 'No disponible'}</p>
                <p><strong>Asignaturas:</strong> ${trabajador.asignaturas.map(cat => cat.nombre_asignatura).join(', ') || 'No disponible'}</p>
                <p><strong>Año de graduado:</strong> ${trabajador.ano_graduado}</p>
                <p><strong>Años de experiencia:</strong> ${trabajador.anos_experiencia}</p>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Cargos y Responsabilidades</h3>
            </div>
            <div class="card-body">
                <p><strong>Cargo:</strong> ${trabajador.cargos.map(cat => cat.nombre_cargo).join(', ') || 'No disponible'}</p>
                <p><strong>Responsabilidad:</strong> ${trabajador.responsabilidades.map(cat => cat.nombre_responsabilidad).join(', ') || 'No disponible'}</p>
                <p><strong>Cantidad de grupos C:</strong> ${trabajador.cantidad_grupo_c || 'No disponible'}</p>
                <p><strong>Cantidad de grupos CP:</strong> ${trabajador.cantidad_grupo_cp || 'No disponible'}</p>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Áreas y Años Académicos</h3>
            </div>
            <div class="card-body">
                <p><strong>Áreas:</strong> ${trabajador.areas.map(cat => cat.nombre_area).join(', ') || 'No disponible'}</p>
                <p><strong>Año Académico:</strong> ${trabajador.annos_academicos.map(cat => cat.anno).join(', ') || 'No disponible'}</p>
            </div>
        </div>
    `,
    icon: 'info',
    confirmButtonText: 'Cerrar',
    width: '500px',
    customClass: {
        popup: 'custom-modal',
        confirmButton: 'custom-confirm-button',
    },
});
    } catch (error) {
        console.error('Error al obtener detalles del trabajador:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los detalles del trabajador.',
        });
    }
}


   // Función para eliminar un trabajador
async function eliminarTrabajador(id_trabajador) {
    try {
        // Mostrar un mensaje de confirmación
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        // Si el usuario confirma, eliminar el trabajador
        if (confirmacion.isConfirmed) {
            const response = await fetch(`http://10.10.1.1:8000/apiv2/trabajador/${id_trabajador}/`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Mostrar mensaje en la tabla
                const mensajeDiv = document.querySelector('#mensajeEliminacion'); // Asegúrate de que este ID exista en tu HTML
                mensajeDiv.innerHTML = `<div class="text-truncate">Se ha eliminado un trabajador del sistema.</div>`;
                
                // Mostrar mensaje de éxito en Swal
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: 'Se ha eliminado un trabajador del sistema.',
                });

                // Recargar los datos de la tabla
                await cargarDatosTrabajadores(); // Asegúrate de que esta función sea asíncrona
            } else {
                // Manejar errores de la API
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar el trabajador');
            }
        }
    } catch (error) {
        console.error('Error al eliminar el trabajador:', error);
        
        // Mostrar mensaje de error en el div
        const mensajeDiv = document.querySelector('#mensajeEliminacion'); // Asegúrate de que este ID exista en tu HTML
        mensajeDiv.innerHTML = `<div class="text-truncate">Error: ${error.message || 'Hubo un problema al eliminar el trabajador.'}</div>`;
        
        // Mostrar mensaje de error en Swal
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Hubo un problema al eliminar el trabajador.',
        });
    }
}


    // Llamar a la función para cargar los datos cuando la página se cargue
    document.addEventListener('DOMContentLoaded', cargarDatosTrabajadores);
