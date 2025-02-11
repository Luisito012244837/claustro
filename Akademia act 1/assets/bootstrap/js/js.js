document.getElementById('searchInput').addEventListener('keyup', filterData);
const checkboxes = document.querySelectorAll('.filter-checkbox');
const facultySelect = document.getElementById('facultySelect');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterData);
});

facultySelect.addEventListener('change', filterData);

function filterData() {
    const filterText = document.getElementById('searchInput').value.toLowerCase();
    const selectedCategories = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    const selectedFaculty = facultySelect.value;

    const listItems = document.querySelectorAll('#dataList li');
    let hasVisibleItems = false; // Variable para verificar si hay elementos visibles

    listItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        const category = item.getAttribute('data-category');
        const faculty = item.getAttribute('data-faculty');

        const matchesText = text.includes(filterText);
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(category);
        const matchesFaculty = selectedFaculty === '' || faculty === selectedFaculty;

        if (matchesText && matchesCategory && matchesFaculty) {
            item.style.display = '';
            hasVisibleItems = true; // Hay al menos un elemento visible
        } else {
            item.style.display = 'none';
        }
    });

    // Mostrar u ocultar la lista según si hay elementos visibles
    document.getElementById('dataList').style.display = hasVisibleItems ? 'block' : 'none';
}




function updateLabel() {

    const input = document.getElementById('yearsInput');

    const label = document.getElementById('experienceLabel');

    const value = input.value;


    // Validar que el valor sea un número y menor que 100

    if (value && value < 100) {

        label.textContent = `Años de experiencia: ${value}`;

    } else {

        label.textContent = ''; // Limpia el label si no hay valor válido

    }

}

// ciclo repetitivo para crear el option

const totalYears = 55; // Total de años desde 1970 hasta 2025
const yearsPerPage = 10; // Número de años a mostrar por página
let currentPage = 0; // Página actual
const select = document.getElementById('yearSelect');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

// Generar opciones desde 1970 hasta 2025

for (let year = 1970; year <= 2026; year++) {

    const option = document.createElement('option');

    option.value = year; // El valor del option será el año

    option.textContent = year; // El texto visible será el año

    select.appendChild(option); // Añadir la opción al select

}


function updateSelect() {
// Limpiar las opciones actuales
select.innerHTML = '';
// Calcular el rango de años a mostrar
const startYear = 1970 + (currentPage * yearsPerPage);
const endYear = Math.min(startYear + yearsPerPage, 2026); // 2025 es el límite superior

 // Agregar las opciones del rango calculado
for (let year = startYear; year < endYear; year++) {

        const option = document.createElement('option');

        option.value = year;

        option.textContent = year;

        select.appendChild(option);

    }


    // Habilitar o deshabilitar los botones de navegación

    prevButton.disabled = currentPage === 0;

    nextButton.disabled = endYear >= 2026; // Deshabilitar si se alcanzó el último año

}


function changePage(direction) {

    currentPage += direction;

    updateSelect();

}


// Inicializar el select con la primera página

updateSelect();



// Cambiar el ícono

function toggleAsignaturas() {

    const asignaturaList = document.getElementById('asignaturaList');

    const toggleIcon = document.querySelector('.toggle-icon');

    asignaturaList.style.display = asignaturaList.style.display === 'none' ? 'block' : 'none';

    toggleIcon.textContent = asignaturaList.style.display === 'block' ? '▲' : '▼'; 

}

// js para seleccionar o deseleccionar todos los checkbox

function toggleAll(selectAllCheckbox) {

    const checkboxes = document.querySelectorAll('.asignatura');

    checkboxes.forEach(checkbox => {

        checkbox.checked = selectAllCheckbox.checked; // Seleccionar o deseleccionar

    });

}

// js para salir del selector de asiganturas

document.addEventListener('click', function(event) {

    const asignaturaList = document.getElementById('asignaturaList');

    const toggleButton = document.querySelector('.toggle-button');


    // Verificar si el clic fue fuera del dropdown y del botón de toggle

    if (!asignaturaList.contains(event.target) && !toggleButton.contains(event.target)) {

        asignaturaList.style.display = 'none'; // Ocultar el dropdown

        document.querySelector('.toggle-icon').textContent = '▼'; // Restablecer el ícono

    }

});