
    // Función para obtener y mostrar los datos de la API
    async function cargarDatosTrabajadores() {
        try {
            // Realizar la solicitud a la API
            const response = await fetch('http://192.168.138.176:8000/apiv2/trabajador/');
            
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

               // Botón "Ver"
                const btnVer = document.createElement('button');
                btnVer.className = 'btn btn-info btn-sm btnVer';
                btnVer.textContent = 'Ver';
                btnVer.setAttribute('data-id', trabajador.id_trabajador); // Usar id_trabajador
                btnVer.addEventListener('click', () => verTrabajador(trabajador.id_trabajador)); // Usar id_trabajador
                celdaOpciones.appendChild(btnVer);

                // Botón "Editar"
                const btnEditar = document.createElement('a');
                btnEditar.className = 'btn btn-warning btn-sm btnEditar';
                btnEditar.textContent = 'Editar';
                btnEditar.href = `editar.html?id_trabajador=${trabajador.id_trabajador}`; // Usar id_trabajador
                celdaOpciones.appendChild(btnEditar);

                // Botón "Eliminar"
                const btnEliminar = document.createElement('button');
                btnEliminar.className = 'btn btn-danger btn-sm btnEliminar';
                btnEliminar.textContent = 'Eliminar';
                btnEliminar.setAttribute('data-id', trabajador.id_trabajador); // Usar id_trabajador
                btnEliminar.addEventListener('click', () => eliminarTrabajador(trabajador.id_trabajador)); // Usar id_trabajador
                celdaOpciones.appendChild(btnEliminar);
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
            const response = await fetch(`http://192.168.138.176:8000/apiv2/getTrabajador/${id_trabajador}/`);
            if (!response.ok) {
                throw new Error('No se pudo obtener la información del trabajador.');
            }
    
            const trabajador = await response.json();
    
            // Mostrar un modal con los detalles del trabajador
            Swal.fire({
                title: 'Detalles del Trabajador',
                html: `
                    <div class="modal-content">
                        <style>
                            .modal-content {
                                text-align: left;
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                color: #333;
                            }
                            .modal-content p {
                                margin: 10px 0;
                                font-size: 14px;
                                line-height: 1.6;
                                padding: 8px;
                                background-color: #f9f9f9;
                                border-radius: 5px;
                                border-left: 4px solid #3498db;
                            }
                            .modal-content strong {
                                color: #2c3e50;
                                font-weight: 600;
                                display: inline-block;
                                width: 160px;
                            }
                            .modal-content .section-title {
                                font-size: 16px;
                                font-weight: 600;
                                color: #34495e;
                                margin-top: 20px;
                                margin-bottom: 10px;
                                padding-bottom: 5px;
                                border-bottom: 2px solid #3498db;
                            }
                            .modal-content .section-title:not(:first-child) {
                                margin-top: 25px;
                            }
                            .modal-content .highlight {
                                background-color: #e8f4f8;
                                padding: 10px;
                                border-radius: 5px;
                                margin: 10px 0;
                            }
                        </style>
            
                        <div class="section-title">Información Personal</div>
                        <div class="highlight">
                            <p><strong>Nombre:</strong> ${trabajador.nombre}</p>
                            <p><strong>Primer Apellido:</strong> ${trabajador.primer_apellido}</p>
                            <p><strong>Segundo Apellido:</strong> ${trabajador.segundo_apellido || 'No disponible'}</p>
                            <p><strong>Sexo:</strong> ${trabajador.sexo}</p>
                        </div>
            
                        <div class="section-title">Experiencia y Formación</div>
                        <div class="highlight">
                            <p><strong>Año de graduado:</strong> ${trabajador.ano_graduado}</p>
                            <p><strong>Años de experiencia:</strong> ${trabajador.anos_experiencia}</p>
                            <p><strong>Cantidad de grupos C:</strong> ${trabajador.cantidad_grupo_c || 'No disponible'}</p>
                            <p><strong>Cantidad de grupos CP:</strong> ${trabajador.cantidad_grupo_cp || 'No disponible'}</p>
                        </div>
            
                        <div class="section-title">Categorías y Cursos</div>
                        <div class="highlight">
                            <p><strong>Categoría docente:</strong> ${trabajador.categorias_docentes.map(cat => cat.nombre_categoria_docente).join(', ') || 'No disponible'}</p>
                            <p><strong>Cursos:</strong> ${trabajador.tipos_curso.map(cat => cat.nombre_curso).join(', ') || 'No disponible'}</p>
                        </div>
            
                        <div class="section-title">Carreras y Asignaturas</div>
                        <div class="highlight">
                            <p><strong>Carreras:</strong> ${trabajador.carreras.map(cat => cat.nombre_carrera).join(', ') || 'No disponible'}</p>
                            <p><strong>Asignaturas:</strong> ${trabajador.asignaturas.map(cat => cat.nombre_asignatura).join(', ') || 'No disponible'}</p>
                        </div>
            
                        <div class="section-title">Cargos y Responsabilidades</div>
                        <div class="highlight">
                            <p><strong>Cargo:</strong> ${trabajador.cargos.map(cat => cat.nombre_cargo).join(', ') || 'No disponible'}</p>
                            <p><strong>Responsabilidad:</strong> ${trabajador.responsabilidades.map(cat => cat.nombre_responsabilidad).join(', ') || 'No disponible'}</p>
                        </div>
            
                        <div class="section-title">Áreas y Años Académicos</div>
                        <div class="highlight">
                            <p><strong>Áreas:</strong> ${trabajador.areas.map(cat => cat.nombre_area).join(', ') || 'No disponible'}</p>
                            <p><strong>Año Académico:</strong> ${trabajador.annos_academicos.map(cat => cat.anno).join(', ') || 'No disponible'}</p>
                        </div>
                    </div>
                `,
                icon: 'info',
                confirmButtonText: 'Cerrar',
                width: '800px',
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
                const response = await fetch(`http://192.168.138.176:8000/apiv2/trabajador/${id_trabajador}/`, {
                    method: 'DELETE',
                });
    
                if (response.ok) {
                    // Mostrar mensaje de éxito
                    Swal.fire({
                        icon: 'success',
                        title: '¡Eliminado!',
                        text: 'El trabajador ha sido eliminado correctamente.',
                    });
    
                    // Recargar los datos de la tabla
                    cargarDatosTrabajadores();
                } else {
                    // Manejar errores de la API
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al eliminar el trabajador');
                }
            }
        } catch (error) {
            console.error('Error al eliminar el trabajador:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Hubo un problema al eliminar el trabajador.',
            });
        }
    }

    // Llamar a la función para cargar los datos cuando la página se cargue
    document.addEventListener('DOMContentLoaded', cargarDatosTrabajadores);
