
    let trabajadorId; // Declaración global

    $(document).ready(function () {
        // Obtener el id_trabajador de la URL
        const urlParams = new URLSearchParams(window.location.search);
        trabajadorId = urlParams.get('id_trabajador'); // No usar const aquí

        // Verificar si se obtuvo el id_trabajador
        if (!trabajadorId) {
            console.error('No se encontró el id_trabajador en la URL');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo obtener el ID del trabajador.',
            });
            return; // Detener la ejecución si no se encuentra el id
        }

        // Inicializar Select2 con checkboxes
        $('.select2').select2({
            placeholder: "Seleccionar",
            closeOnSelect: false,
            allowClear: true,
        });

        // Configurar Select2 para el campo de Categoría Científica (solo una selección)
        $('#categoriaCientifica').select2({
            placeholder: "Seleccione una categoría",
            allowClear: true,
            maximumSelectionLength: 1,
        });

        // Obtener los datos del trabajador al cargar la página
        obtenerDatosTrabajador(trabajadorId);
    });

    // Función para obtener los datos del trabajador
    async function obtenerDatosTrabajador(id_trabajador) {
        try {
            const response = await fetch(`http://10.10.1.1:8000/apiv2/getTrabajador/${id_trabajador}/`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error al obtener los datos del trabajador: ${errorData.message}`);
            }
            const data = await response.json();
            
            // Rellenar el formulario con los datos actuales
            document.getElementById('username').value = data.nombre;
            document.getElementById('primerApellido').value = data.primer_apellido;
            document.getElementById('segundoApellido').value = data.segundo_apellido;
            document.getElementById('group_count').value = data.cantidad_grupo_c;
            document.getElementById('group_count_practica').value = data.cantidad_grupo_cp;
            document.getElementById('year_graduated').value = data.ano_graduado;
            document.getElementById('experience_years').value = data.anos_experiencia;
            document.getElementById('sexo').value = data.sexo;
            $('#course').val(data.nombre_curso).trigger('change');
            $('#categoriaDocente').val(data.nombre_categoria_docente).trigger('change');
            $('#anioAcademico').val(data.anno_academico).trigger('change');
            $('#career').val(data.nombre_carrera).trigger('change');
            $('#responsabilidad').val(data.nombre_responsabilidad).trigger('change');
            $('#cargo').val(data.nombre_cargo).trigger('change');
            $('#categoriaCientifica').val(data.nombre_categoria_cientifica).trigger('change');
            $('#asignaturaList').val(data.nombre_asignatura).trigger('change');
            $('#areaList').val(data.nombre_area).trigger('change');

            return data; // Devolver los datos para usarlos más tarde
        } catch (error) {
            console.error('Error en la solicitud GET:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo obtener los datos del trabajador.',
            });
        }
    }

    // Capturar el formulario
    const trabajadorEditForm = document.getElementById('formEditarTrabajador');

    // Escuchar el evento submit del formulario
    trabajadorEditForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evitar el envío tradicional

        // Obtener los valores del formulario
        const nombre = document.getElementById('username').value;
        const primerApellido = document.getElementById('primerApellido').value;
        const segundoApellido = document.getElementById('segundoApellido').value;
        const cantidadGruposConferencia = document.getElementById('group_count').value;
        const cantidadGruposPractica = document.getElementById('group_count_practica').value;
        const añoGraduado = document.getElementById('year_graduated').value;
        const añosExperiencia = document.getElementById('experience_years').value;
        const sexo = document.getElementById('sexo').value;
        const curso = $('#course').val(); // Usar Select2
        const categoriaDocente = $('#categoriaDocente').val(); // Usar Select2
        const anioAcademico = $('#anioAcademico').val(); // Usar Select2
        const carrera = $('#career').val(); // Usar Select2
        const responsabilidad = $('#responsabilidad').val(); // Usar Select2
        const cargo = $('#cargo').val(); // Usar Select2
        const categoriaCientifica = $('#categoriaCientifica').val(); // Obtener la categoría científica seleccionada
        const asignaturas = $('#asignaturaList').val(); // Usar Select2
        const areas = $('#areaList').val(); // Usar Select2

        // Obtener los datos actuales del trabajador
        const datosActuales = await obtenerDatosTrabajador(trabajadorId); // Asegúrate de esperar aquí

        // Comparar los datos actuales con los nuevos datos
        const cambiosRealizados = (
            datosActuales.nombre !== nombre ||
            datosActuales.primer_apellido !== primerApellido ||
            datosActuales.segundo_apellido !== segundoApellido ||
            datosActuales.cantidad_grupo_c !== cantidadGruposConferencia ||
            datosActuales.cantidad_grupo_cp !== cantidadGruposPractica ||
            datosActuales.ano_graduado !== añoGraduado ||
            datosActuales.anos_experiencia !== añosExperiencia ||
            datosActuales.sexo !== sexo ||
            JSON.stringify(datosActuales.nombre_categoria_cientifica) !== JSON.stringify(categoriaCientifica) ||
            JSON.stringify(datosActuales.nombre_categoria_docente) !== JSON.stringify(categoriaDocente) ||
            JSON.stringify(datosActuales.nombre_curso) !== JSON.stringify(curso) ||
            JSON.stringify(datosActuales.anno_academico) !== JSON.stringify(anioAcademico) ||
            JSON.stringify(datosActuales.nombre_carrera) !== JSON.stringify(carrera) ||
            JSON.stringify(datosActuales.nombre_responsabilidad) !== JSON.stringify(responsabilidad) ||
            JSON.stringify(datosActuales.nombre_cargo) !== JSON.stringify(cargo) ||
            JSON.stringify(datosActuales.nombre_asignatura) !== JSON.stringify(asignaturas) ||
            JSON.stringify(datosActuales.nombre_area) !== JSON.stringify(areas)
        );

        // Si se realizaron cambios, mostrar un mensaje
        if (cambiosRealizados) {
            Swal.fire({
                icon: 'info',
                title: 'Cambios detectados',
                text: 'Se han realizado cambios en los datos del trabajador.',
            });
        }

        // Validar campos obligatorios
        if (!nombre || !primerApellido || !segundoApellido) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa todos los campos obligatorios.',
            });
            return; // Detener el envío si hay errores
        }

        // Datos para enviar a la API
        const data = {
            nombre: nombre,
            primer_apellido: primerApellido,
            segundo_apellido: segundoApellido,
            cantidad_grupo_c: cantidadGruposConferencia,
            cantidad_grupo_cp: cantidadGruposPractica,
            ano_graduado: añoGraduado,
            anos_experiencia: añosExperiencia,
            sexo: sexo,
            nombre_categoria_cientifica: categoriaCientifica,
            nombre_categoria_docente: Array.isArray(categoriaDocente) ? categoriaDocente : [categoriaDocente],
            nombre_curso: Array.isArray(curso) ? curso : [curso],
            anno_academico: Array.isArray(anioAcademico) ? anioAcademico : [anioAcademico],
            nombre_carrera: Array.isArray(carrera) ? carrera : [carrera],
            nombre_responsabilidad: Array.isArray(responsabilidad) ? responsabilidad : [responsabilidad],
            nombre_cargo: Array.isArray(cargo) ? cargo : [cargo],
            nombre_asignatura: Array.isArray(asignaturas) ? asignaturas : [asignaturas],
            nombre_area: Array.isArray(areas) ? areas : [areas],
        };

        try {
            // Hacer la solicitud POST a la API
            const response = await fetch('http://10.10.1.1:8000/apiv2/modifyTrabajador/', {
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
                    title: '¡Trabajador registrado!',
                    text: 'El trabajador ha sido registrado correctamente.',
                }).then(() => {
                    // Redirigir al usuario después del registro
                    window.location.href = '/control.html'; // Cambia la URL según tu aplicación
                });
            } else {
                // Manejar errores de la API
                const errorData = await response.json();
                console.error('Error en la API:', errorData);

                // Mostrar mensaje de error con SweetAlert2
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorData.message || 'Hubo un problema al registrar el trabajador.',
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
    });
