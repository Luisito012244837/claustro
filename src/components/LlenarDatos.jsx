import React, { useEffect } from 'react';
import $ from 'jquery';
import 'select2';

const LlenarDatos = () => {
    const fetchData = async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        return response.json();
    };

    const populateSelect = async (url, selectId, textKey) => {
        try {
            const select = document.getElementById(selectId);
            // Limpiar opciones existentes
            select.innerHTML = '';

            // Obtener datos de la API
            const data = await fetchData(url);

            // Agregar opciones desde la API
            data.forEach(item => {
                const option = document.createElement('option');
                option.textContent = item[textKey];
                select.appendChild(option);
            });

            // Inicializar Select2
            if (typeof $ !== 'undefined') {
                $(select).select2();
            }
        } catch (error) {
            console.error(`Error al poblar el select de ${selectId}:`, error);
            alert(`Hubo un error al cargar los datos de ${selectId}. Por favor, intenta nuevamente.`);
        }
    };

    useEffect(() => {
        populateSelect('http://10.10.1.1:8000/apiv2/tipo-curso/', 'curso', 'nombre_curso');
        populateSelect('http://10.10.1.1:8000/apiv2/categoria-docente/', 'categoriaDocente', 'nombre_categoria_docente');
        populateSelect('http://10.10.1.1:8000/apiv2/anno-academico/', 'anioAcademico', 'anno');
        populateSelect('http://10.10.1.1:8000/apiv2/carrera/', 'carrera', 'nombre_carrera');
        populateSelect('http://10.10.1.1:8000/apiv2/responsabilidad/', 'responsabilidad', 'nombre_responsabilidad');
        populateSelect('http://10.10.1.1:8000/apiv2/cargo/', 'cargo', 'nombre_cargo');
        populateSelect('http://10.10.1.1:8000/apiv2/categoria-cientifica/', 'categoriaCientifica', 'nombre_categoria_cientifica');
        populateSelect('http://10.10.1.1:8000/apiv2/asignatura/', 'asignaturaList', 'nombre_asignatura');
        populateSelect('http://10.10.1.1:8000/apiv2/area/', 'areaList', 'nombre_area');
    }, []);

    return null; // Este componente no renderiza nada por sí mismo
};

export default LlenarDatos;
