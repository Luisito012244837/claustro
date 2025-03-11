// Función para obtener datos de la API
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al obtener los datos');
    }
    return response.json();
}

// Función para poblar el select de cursos
async function populateCourseSelect() {
    try {
        const select = document.getElementById('course');
        
        // Limpiar opciones existentes
        select.innerHTML = '';
        
        // Obtener datos de la API
        const data = await fetchData('http://10.10.1.1:8000/apiv2/tipo-curso/');
         
        // Agregar opciones desde la API
        data.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item.nombre_curso;
            select.appendChild(option);
        });
        
        // Inicializar Select2
        if (typeof $ !== 'undefined') {
            $(select).select2();
        }
    } catch (error) {
        console.error('Error al poblar el select de cursos:', error);
        alert('Hubo un error al cargar los cursos. Por favor, intenta nuevamente.');
    }
}

// Función para poblar el select de categorías docentes
async function populateCategoriaDocenteSelect() {
    try {
        const select = document.getElementById('categoriaDocente');
        // Limpiar opciones existentes
        select.innerHTML = '';
        // Obtener datos de la API
        const data = await fetchData('http://10.10.1.1:8000/apiv2/categoria-docente/');
        
        // Agregar opciones desde la API
        data.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item.nombre_categoria_docente;
            select.appendChild(option);
        });
        // Inicializar Select2
        if (typeof $ !== 'undefined') {
            $(select).select2();
        }
    } catch (error) {
        console.error('Error al poblar el select de categorías docentes:', error);
        alert('Hubo un error al cargar las categorías. Por favor, intenta nuevamente.');
    }
}

// Función para poblar el select de años académicos
async function populateAnnoAcademicoSelect() {
    try {
        const select = document.getElementById('anioAcademico');
        // Limpiar opciones existentes
        select.innerHTML = '';
        // Obtener datos de la API
        const data = await fetchData('http://10.10.1.1:8000/apiv2/anno-academico/');
        
        // Agregar opciones desde la API
        data.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item.anno;
            select.appendChild(option);
        });
        // Inicializar Select2
        if (typeof $ !== 'undefined') {
            $(select).select2();
        }
    } catch (error) {
        console.error('Error al poblar el select de años académicos:', error);
        alert('Hubo un error al cargar los años académicos. Por favor, intenta nuevamente.');
    }
}

// Función para poblar el select de carreras
async function populateCareerSelect() {
    try {
        const select = document.getElementById('career');
        // Limpiar opciones existentes
        select.innerHTML = '';
        // Obtener datos de la API
        const data = await fetchData('http://10.10.1.1:8000/apiv2/carrera/');
        
        // Agregar opciones desde la API
        data.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item.nombre_carrera;
            select.appendChild(option);
        });
        // Inicializar Select2
        if (typeof $ !== 'undefined') {
            $(select).select2();
        }
    } catch (error) {
        console.error('Error al poblar el select de carreras:', error);
        alert('Hubo un error al cargar las carreras. Por favor, intenta nuevamente.');
    }
}

// Función para poblar el select de responsabilidades
async function populateResponsabilidadSelect() {
    try {
        const select = document.getElementById('responsabilidad');
        // Limpiar opciones existentes
        select.innerHTML = '';
        // Obtener datos de la API
        const data = await fetchData('http://10.10.1.1:8000/apiv2/responsabilidad/');
        
        // Agregar opciones desde la API
        data.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item.nombre_responsabilidad;
            select.appendChild(option);
        });
        // Inicializar Select2
        if (typeof $ !== 'undefined') {
            $(select).select2();
        }
    } catch (error) {
        console.error('Error al poblar el select de responsabilidades:', error);
        alert('Hubo un error al cargar las responsabilidades. Por favor, intenta nuevamente.');
    }
}

// Función para poblar el select de cargos
async function populateCargoSelect() {
    try {
        const select = document.getElementById('cargo');
        // Limpiar opciones existentes
        select.innerHTML = '';
        // Obtener datos de la API
        const data = await fetchData('http://10.10.1.1:8000/apiv2/cargo/');
        
        // Agregar opciones desde la API
        data.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item.nombre_cargo;
            select.appendChild(option);
        });
        // Inicializar Select2
        if (typeof $ !== 'undefined') {
            $(select).select2();
        }
    } catch (error) {
        console.error('Error al poblar el select de cargos:', error);
        alert('Hubo un error al cargar los cargos. Por favor, intenta nuevamente.');
    }
}

// Función para poblar el select de categorías científicas
async function populateCategoriaCientificaSelect() {
    try {
        const select = document.getElementById('categoriaCientifica');
        // Limpiar opciones existentes
        select.innerHTML = '';
        // Obtener datos de la API
        const data = await fetchData('http://10.10.1.1:8000/apiv2/categoria-cientifica/');
        
        // Agregar opciones desde la API
        data.forEach(item => {
            const option = document.createElement('option');
           
            option.textContent = item.nombre_categoria_cientifica;
            select.appendChild(option);
        });
        // No inicializar Select2 ya que este select no tiene la clase select2
    } catch (error) {
        console.error('Error al poblar el select de categorías científicas:', error);
        alert('Hubo un error al cargar las categorías científicas. Por favor, intenta nuevamente.');
    }
}

// Función para poblar el select de asignaturas
async function populateAsignaturaSelect() {
    try {
        const select = document.getElementById('asignaturaList');
        // Limpiar opciones existentes
        select.innerHTML = '';
        // Obtener datos de la API
        const data = await fetchData('http://10.10.1.1:8000/apiv2/asignatura/');
       
        // Agregar opciones desde la API
        data.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item.nombre_asignatura;
            select.appendChild(option);
        });
        // Inicializar Select2
        if (typeof $ !== 'undefined') {
            $(select).select2();
        }
    } catch (error) {
        console.error('Error al poblar el select de asignaturas:', error);
        alert('Hubo un error al cargar las asignaturas. Por favor, intenta nuevamente.');
    }
}

// Función para poblar el select de áreas
async function populateAreaSelect() {
    try {
        const select = document.getElementById('areaList');
        // Limpiar opciones existentes
        select.innerHTML = '';
        // Obtener datos de la API
        const data = await fetchData('http://10.10.1.1:8000/apiv2/area/');
        
        // Agregar opciones desde la API
        data.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item.nombre_area;
            select.appendChild(option);
        });
        // Inicializar Select2
        if (typeof $ !== 'undefined') {
            $(select).select2();
        }
    } catch (error) {
        console.error('Error al poblar el select de áreas:', error);
        alert('Hubo un error al cargar las áreas. Por favor, intenta nuevamente.');
    }
}

// Llamar las funciones cuando se cargue el documento
document.addEventListener('DOMContentLoaded', () => {
    populateCourseSelect();
    populateCategoriaDocenteSelect();
    populateAnnoAcademicoSelect();
    populateCareerSelect();
    populateResponsabilidadSelect();
    populateCargoSelect();
    populateCategoriaCientificaSelect();
    populateAsignaturaSelect();
    populateAreaSelect();
});