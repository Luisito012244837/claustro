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
// Función para validar que el valor sea menor que 10
function validateInput(input) {
    if (input.value > 9) {
        input.setCustomValidity('El valor debe ser menor que 10.');
    } else {
        input.setCustomValidity('');
    }
}

// Validar el campo "Cant_Grup_Conferencia"
document.getElementById('group_count').addEventListener('input', function() {
    validateInput(this);
});

// Validar el campo "Cant_Grup_Clase_Práctica"
document.getElementById('group_count_practica').addEventListener('input', function() {
    validateInput(this);
});

// Función para validar años de experiencia
function validarExperiencia(input) {
    const value = input.value.trim();
    const onlyNumbers = /^\d*$/;

    if (!onlyNumbers.test(value)) {
        input.setCustomValidity('Solo se permiten números.');
        input.value = value.replace(/[^0-9]/g, '');
        input.classList.add('is-invalid');
        return false; // Retorna false si no es válido
    } else if (value !== "" && (parseFloat(value) < 0 || parseFloat(value) > 100)) {
        input.setCustomValidity('Por favor, ingresa un valor entre 0 y 100 años');
        input.classList.add('is-invalid');
        return false; // Retorna false si no es válido
    } else {
        input.setCustomValidity('');
        input.classList.remove('is-invalid');
        return true; // Retorna true si es válido
    }
}

// Función para validar año de graduación
function validarAñoGraduacion(input) {
    const value = input.value.trim();
    const onlyNumbers = /^\d*$/;
    const añoActual = new Date().getFullYear();

    if (!onlyNumbers.test(value)) {
        input.setCustomValidity('Solo se permiten números.');
        input.value = value.replace(/[^0-9]/g, '');
        input.classList.add('is-invalid');
        return false; // Retorna false si no es válido
    } else if (value !== "" && (parseInt(value) < 1900 || parseInt(value) > añoActual)) {
        input.setCustomValidity(`Por favor, ingresa un año válido entre 1900 y ${añoActual}`);
        input.classList.add('is-invalid');
        return false; // Retorna false si no es válido
    } else {
        input.setCustomValidity('');
        input.classList.remove('is-invalid');
        return true; // Retorna true si es válido
    }
}

// Función para validar el sexo
document.querySelector('form').addEventListener('submit', function (e) {
    const selectSexo = document.getElementById('sexo');
    if (selectSexo.value === "") {
        e.preventDefault(); // Evita que el formulario se envíe
        selectSexo.classList.add('is-invalid'); // Marca el campo como inválido
        alert('Por favor, selecciona una opción válida para el campo "Sexo".');
    } else {
        selectSexo.classList.remove('is-invalid'); // Remueve la marca de inválido
    }
});

// Función para validar asignaturas al enviar el formulario
function validarAsignaturas(event) {
    const asignaturas = document.querySelectorAll('input.asignatura');
    const seleccionadas = Array.from(asignaturas).filter(asignatura => asignatura.checked).length;

    if (seleccionadas === 0) {
        asignaturas.forEach(asignatura => asignatura.classList.add('is-invalid'));
        event.preventDefault();
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
        return false;
    } else {
        asignaturas.forEach(asignatura => asignatura.classList.remove('is-invalid'));
        return true;
    }
}

// Función para validar el sexo
document.getElementById('sexo').addEventListener('change', function () {
    const select = this;
    const placeholderOption = select.querySelector('option[value=""]');
    if (placeholderOption && select.value !== "") {
        placeholderOption.remove(); // Elimina el placeholder después de seleccionar una opción válida
    }
});

// validar tipo de curso

document.getElementById('course').addEventListener('change', function () {
    const select = this;
    const placeholderOption = select.querySelector('option[value=""]');
    if (placeholderOption && select.value !== "") {
        placeholderOption.remove(); // Elimina el placeholder después de seleccionar una opción válida
    }
});


// Función para validar áreas
function validarAreas() {
    const areas = document.querySelectorAll('input.area');
    const seleccionadas = Array.from(areas).filter(area => area.checked).length;

    if (seleccionadas === 0) {
        areas.forEach(area => area.classList.add('is-invalid'));
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
        areas.forEach(area => area.classList.remove('is-invalid'));
        return true;
    }
}

// Función para validar campos de selección (sexo, curso que imparte, categoría docente, carrera, responsabilidad)
function validarSeleccion(input) {
    if (input.value === "") {
        input.classList.add('is-invalid');
        return false; // Retorna false si no es válido
    } else {
        input.classList.remove('is-invalid');
        return true; // Retorna true si es válido
    }
}

// Validación al enviar el formulario
document.querySelector('form').addEventListener('submit', function (e) {
    const isUsernameValid = validarSoloLetras(document.getElementById('username'));
    const isPrimerApellidoValid = validarSoloLetras(document.getElementById('primerApellido'));
    const isSegundoApellidoValid = validarSoloLetras(document.getElementById('segundoApellido'));
    

    if (!isUsernameValid || !isPrimerApellidoValid || !isSegundoApellidoValid ) {
        e.preventDefault();
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



