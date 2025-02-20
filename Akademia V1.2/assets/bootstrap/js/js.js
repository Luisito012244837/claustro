// Función para validar solo letras (incluyendo acentos y ñ)
function validarSoloLetras(input) {
    const pattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;
    if (!pattern.test(input.value)) {
        input.setCustomValidity('Solo se permiten letras (incluyendo acentos y ñ)');
        input.classList.add('is-invalid');
        return false; // Retorna false si no es válido
    } else {
        input.setCustomValidity('');
        input.classList.remove('is-invalid');
        return true; // Retorna true si es válido
    }
}
    // Validacion de carreras
const careerInput = document.getElementById('career');

        function validarCarrera(event) {
            const valor = careerInput.value;
            const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/;

            if (!regex.test(valor)) {
                careerInput.setCustomValidity('Solo se permiten letras y espacios.');
                careerInput.classList.add('is-invalid');
                event.preventDefault();
            } else {
                careerInput.setCustomValidity('');
                careerInput.classList.remove('is-invalid');
            }
        }

        careerInput.addEventListener('input', validarCarrera);
        document.querySelector('#formulario').addEventListener('submit', validarCarrera);

// Función para validar solo números y menores que 10
function validarNumeroMenorQue10(input, errorMessageId) {
    const value = input.value.trim();
    const onlyNumbers = /^\d*$/;
    const errorMessage = document.getElementById(errorMessageId);

    if (!onlyNumbers.test(value)) {
        errorMessage.textContent = "Solo se permiten números.";
        errorMessage.style.display = "block";
        input.value = value.replace(/[^0-9]/g, '');
        return false; // Retorna false si no es válido
    } else if (value !== "" && parseInt(value) >= 10) {
        errorMessage.textContent = "El número debe ser menor que 10.";
        errorMessage.style.display = "block";
        return false; // Retorna false si no es válido
    } else {
        errorMessage.style.display = "none";
        return true; // Retorna true si es válido
    }
}

// Función para validar años de experiencia
function validarExperiencia(input) {
    const valor = parseFloat(input.value);
    if (isNaN(valor) || valor < 1 || valor > 100) {
        input.setCustomValidity('Por favor, ingresa un valor entre 1 y 100');
        input.classList.add('is-invalid');
        return false; // Retorna false si no es válido
    } else {
        input.setCustomValidity('');
        input.classList.remove('is-invalid');
        return true; // Retorna true si es válido
    }
}

// Función para seleccionar/deseleccionar todas las asignaturas
function toggleAllAsignaturas(checkbox) {
    const checkboxes = document.querySelectorAll('.asignatura');
    checkboxes.forEach((cb) => {
        cb.checked = checkbox.checked;
    });
}


// Función para validar año de graduación
function validarAñoGraduacion(input) {
    const valor = parseInt(input.value);
    const añoActual = new Date().getFullYear();
    if (isNaN(valor) || valor < 1900 || valor > añoActual) {
        input.setCustomValidity(`Por favor, ingresa un año válido entre 1900 y ${añoActual}`);
        input.classList.add('is-invalid');
        return false; // Retorna false si no es válido
    } else {
        input.setCustomValidity('');
        input.classList.remove('is-invalid');
        return true; // Retorna true si es válido
    }
}

// Función para mostrar/ocultar la lista de asignaturas
function toggleAsignaturas() {
    const asignaturaList = document.getElementById('asignaturaList');
    const toggleIcon = document.querySelector('.toggle-icon');
    if (asignaturaList.style.display === 'none' || !asignaturaList.style.display) {
        asignaturaList.style.display = 'block';
        toggleIcon.textContent = '▲';
    } else {
        asignaturaList.style.display = 'none';
        toggleIcon.textContent = '▼';
    }
}



// Función para mostrar/ocultar la lista de áreas
function toggleAreas() {
    const areaList = document.getElementById('areaList');
    const toggleIcon = document.querySelector('.toggle-icon-areas');
    if (areaList.style.display === 'none' || !areaList.style.display) {
        areaList.style.display = 'block'; // Mostrar la lista
        toggleIcon.textContent = '▲'; // Cambiar el ícono a una flecha hacia arriba
    } else {
        areaList.style.display = 'none'; // Ocultar la lista
        toggleIcon.textContent = '▼'; // Cambiar el ícono a una flecha hacia abajo
    }
}

// Función para validar asignaturas al enviar el formulario
function validarAsignaturas(event) {
    // Selecciona todos los checkboxes con la clase 'asignatura'
    const asignaturas = document.querySelectorAll('input.asignatura');
    // Filtra los checkboxes que están marcados
    const seleccionadas = Array.from(asignaturas).filter(asignatura => asignatura.checked).length;

    // Si no hay ninguna asignatura seleccionada
    if (seleccionadas === 0) {
        // Evita que el formulario se envíe
        event.preventDefault();

        // Muestra un mensaje de error con SweetAlert2
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debes seleccionar al menos una asignatura.',
            width: '300px',
            padding: '10px',
            background: '#f8f9fa',
            confirmButtonColor: '#20c997',
            customClass: {
                popup: 'small-swal',
            },
        });

        return false; // Retorna false para indicar que la validación falló
    }

    // Si al menos una asignatura está seleccionada, el formulario se envía
    return true;
}

// Asignar la función al evento 'submit' del formulario
document.querySelector('form').addEventListener('submit', validarAsignaturas);

// Función para validar áreas
function validarAreas() {
    const areas = document.querySelectorAll('input.area');
    const seleccionadas = Array.from(areas).filter(area => area.checked).length;

    if (seleccionadas === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debes seleccionar al menos un área.',
            width: '300px',
            padding: '10px',
            background: '#f8f9fa',
            confirmButtonColor: '#20c997',
            customClass: {
                popup: 'small-swal',
            },
        });
        return false;
    } else {
        return true;
    }
}



// Función para seleccionar/deseleccionar todas las áreas
function toggleAllAreas(checkbox) {
    const checkboxes = document.querySelectorAll('.area'); // Selecciona todos los checkboxes de áreas
    checkboxes.forEach((cb) => {
        cb.checked = checkbox.checked; // Marca o desmarca cada checkbox según el estado del checkbox "Todos"
    });
}


// Validación al enviar el formulario
document.querySelector('form').addEventListener('submit', function (e) {
    // Validar que al menos un área esté seleccionada
    const isAreasValid = validarAreas();

    // Si no se selecciona ninguna área, prevenir el envío del formulario
    if (!isAreasValid) {
        e.preventDefault(); // Evita que el formulario se envíe
    }
});


// Event listeners para los campos de texto
document.getElementById('username').addEventListener('input', function (e) {
    validarSoloLetras(this);
});

document.getElementById('primerApellido').addEventListener('input', function (e) {
    validarSoloLetras(this);
});

document.getElementById('segundoApellido').addEventListener('input', function (e) {
    validarSoloLetras(this);
});

document.getElementById('experience_years').addEventListener('input', function (e) {
    validarExperiencia(this);
});

document.getElementById('year_graduated').addEventListener('input', function (e) {
    validarAñoGraduacion(this);
});

document.getElementById('group_count').addEventListener('input', function (e) {
    validarNumeroMenorQue10(this, 'error-message');
});

document.getElementById('group_count_practica').addEventListener('input', function (e) {
    validarNumeroMenorQue10(this, 'error-message-practica');
});

// Event listeners para los checkboxes de asignaturas
document.querySelectorAll('input.asignatura').forEach(asignatura => {
    asignatura.addEventListener('change', validarAsignaturas);
});

// Validación al enviar el formulario
document.querySelector('form').addEventListener('submit', function (e) {
    // Validar todos los campos
    const isUsernameValid = validarSoloLetras(document.getElementById('username'));
    const isPrimerApellidoValid = validarSoloLetras(document.getElementById('primerApellido'));
    const isSegundoApellidoValid = validarSoloLetras(document.getElementById('segundoApellido'));
    const isExperienceValid = validarExperiencia(document.getElementById('experience_years'));
    const isYearGraduatedValid = validarAñoGraduacion(document.getElementById('year_graduated'));
    const isGroupCountValid = validarNumeroMenorQue10(document.getElementById('group_count'), 'error-message');
    const isGroupCountPracticaValid = validarNumeroMenorQue10(document.getElementById('group_count_practica'), 'error-message-practica');
    

    // Verificar si todos los campos son válidos
if (!isUsernameValid || !isPrimerApellidoValid || !isSegundoApellidoValid || !isExperienceValid || !isYearGraduatedValid || !isGroupCountValid || !isGroupCountPracticaValid) {
    e.preventDefault(); // Prevenir el envío del formulario
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, revisa los campos marcados en rojo.',
        width: '300px',
        padding: '10px',
        background: '#f8f9fa',
        confirmButtonColor: '#20c997',
        customClass: {
            popup: 'small-swal',
        },
    });
}
})