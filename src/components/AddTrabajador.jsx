import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../assets/css/bootstrap.min.css"; // Importa Bootstrap
import "../assets/fonts/fontawesome-all.min.css"; // Importa FontAwesome
import "../assets/css/AddTrabajador.css"; // Asegúrate de crear este archivo CSS
import $ from 'jquery';
import 'select2';
import 'select2/dist/css/select2.min.css'; // Importa el CSS de Select2
import LlenarDatos from './LlenarDatos'; // Importamos el nuevo componente
import styled from "styled-components";

// Define un componente con la fuente Nunito
const Container = styled.div`
  font-family: 'Nunito', sans-serif;
`;

const AddTrabajador = () => {
    const [formData, setFormData] = useState({
        username: '',
        primerApellido: '',
        segundoApellido: '',
        groupCount: 'Ninguna',
        groupCountPractica: 'Ninguna',
        yearGraduated: '',
        experienceYears: '',
        sexo: '',
        curso: [],
        categoriaDocente: [],
        anioAcademico: [],
        carrera: [],
        responsabilidad: [],
        cargo: [],
        categoriaCientifica: '',
        asignaturas: [],
        areas: []
    });

    useEffect(() => {
        populateYearGraduated();
        populateExperienceYears();
        initializeSelect2();
    }, []);

    const populateYearGraduated = () => {
        const yearSelect = document.getElementById('year_graduated');
        const currentYear = new Date().getFullYear();

        // Agregar la opción "Ninguna"
        const noneOption = document.createElement('option');
        noneOption.value = "Ninguna";
        noneOption.textContent = "Ninguna";
        yearSelect.appendChild(noneOption);

        // Generar opciones desde 1910 hasta el año actual
        for (let year = 1910; year <= currentYear; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    };

    const populateExperienceYears = () => {
        const experienceSelect = document.getElementById('experience_years');

        // Agregar la opción "Ninguna"
        const noneOption = document.createElement('option');
        noneOption.value = "Ninguna";
        noneOption.textContent = "Ninguna";
        experienceSelect.appendChild(noneOption);

        // Generar opciones desde 0 hasta 100 años
        for (let i = 0; i <= 100; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            experienceSelect.appendChild(option);
        }
    };

    const initializeSelect2 = () => {
        // Inicializar Select2 con jQuery
        $('.select2').select2({
            placeholder: "Seleccionar",
            closeOnSelect: false,
            allowClear: true,
        });

        $('#categoriaCientifica').select2({
            placeholder: "Seleccione una categoría",
            allowClear: true,
            maximumSelectionLength: 1,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleMultiSelectChange = (e) => {
        const { name } = e.target;
        const values = $(e.target).val();
        setFormData({
            ...formData,
            [name]: values || []
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validaciones
        if (!validarFormulario()) {
            return;
        }

        const data = {
            nombre: formData.username,
            primer_apellido: formData.primerApellido,
            segundo_apellido: formData.segundoApellido,
            cantidad_grupo_c: formData.groupCount,
            cantidad_grupo_cp: formData.groupCountPractica,
            ano_graduado: formData.yearGraduated,
            anos_experiencia: formData.experienceYears,
            sexo: formData.sexo,
            nombre_categoria_cientifica: formData.categoriaCientifica,
            nombre_categoria_docente: formData.categoriaDocente,
            nombre_curso: formData.curso,
            anno_academico: formData.anioAcademico,
            nombre_carrera: formData.carrera,
            nombre_responsabilidad: formData.responsabilidad,
            nombre_cargo: formData.cargo,
            nombre_asignatura: formData.asignaturas,
            nombre_area: formData.areas,
        };

        try {
            const response = await fetch('http://10.10.1.1:8000/apiv2/insertTrabajador/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                Swal.fire({
                    icon: 'success',
                    title: '¡Trabajador registrado!',
                    text: 'El trabajador ha sido registrado correctamente.',
                }).then(() => {
                    window.location.href = '/control.html';
                });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorData.message || 'Hubo un problema al registrar el trabajador.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar al servidor. Inténtalo de nuevo más tarde.',
            });
        }
    };

    const validarFormulario = () => {
        const isUsernameValid = validarSoloLetras(document.getElementById('username'));
        const isPrimerApellidoValid = validarSoloLetras(document.getElementById('primerApellido'));
        const isSegundoApellidoValid = validarSoloLetras(document.getElementById('segundoApellido'));
        const isSexoValid = validarSeleccion(document.getElementById('sexo'));
        const isYearGraduatedValid = validarAñoGraduacion(document.getElementById('year_graduated'));
        const isExperienceYearsValid = validarExperiencia(document.getElementById('experience_years'));
        
        if (!isUsernameValid || !isPrimerApellidoValid || !isSegundoApellidoValid || !isSexoValid || !isYearGraduatedValid || !isExperienceYearsValid) {
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
            return false;
        }
        return true;
    };

    const validarSoloLetras = (input) => {
        const pattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;
        if (!pattern.test(input.value)) {
            input.setCustomValidity('Solo se permiten letras (incluyendo acentos y ñ)');
            input.classList.add('is-invalid');
            return false;
        } else {
            input.setCustomValidity('');
            input.classList.remove('is-invalid');
            return true;
        }
    };

    const validarExperiencia = (input) => {
        const value = input.value.trim();
        const onlyNumbers = /^\d*$/;

        if (!onlyNumbers.test(value)) {
            input.setCustomValidity('Solo se permiten números.');
            input.value = value.replace(/[^0-9]/g, '');
            input.classList.add('is-invalid');
            return false;
        } else if (value !== "" && (parseFloat(value) < 0 || parseFloat(value) > 100)) {
            input.setCustomValidity('Por favor, ingresa un valor entre 0 y 100 años');
            input.classList.add('is-invalid');
            return false;
        } else {
            input.setCustomValidity('');
            input.classList.remove('is-invalid');
            return true;
        }
    };

    const validarAñoGraduacion = (input) => {
        const value = input.value.trim();
        const onlyNumbers = /^\d*$/;
        const añoActual = new Date().getFullYear();

        if (!onlyNumbers.test(value)) {
            input.setCustomValidity('Solo se permiten números.');
            input.value = value.replace(/[^0-9]/g, '');
            input.classList.add('is-invalid');
            return false;
        } else if (value !== "" && (parseInt(value) < 1900 || parseInt(value) > añoActual)) {
            input.setCustomValidity(`Por favor, ingresa un año válido entre 1900 y ${añoActual}`);
            input.classList.add('is-invalid');
            return false;
        } else {
            input.setCustomValidity('');
            input.classList.remove('is-invalid');
            return true;
        }
    };

    const validarSeleccion = (input) => {
        if (input.value === "") {
            input.classList.add('is-invalid');
            return false;
        } else {
            input.classList.remove('is-invalid');
            return true;
        }
    };

    return (
        <Container>
            <div className="container-fluid">
                <LlenarDatos /> {/* Llamamos al componente para llenar los datos */}
                <h1>Añadir nuevo trabajador</h1>
                <form id="trabajadorForm" onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label htmlFor="username"><strong>Nombre</strong></label>
                            <input className="form-control" type="text" id="username" placeholder="Nombre" name="username" value={formData.username} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="primerApellido"><strong>Primer Apellido</strong></label>
                            <input className="form-control" type="text" id="primerApellido" placeholder="Primer Apellido" name="primerApellido" value={formData.primerApellido} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="segundoApellido"><strong>Segundo Apellido</strong></label>
                            <input className="form-control" type="text" id="segundoApellido" placeholder="Segundo Apellido" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="group_count_select"><strong>Cant_Grup_Conferencia</strong></label>
                            <select className="form-control" id="group_count_select" name="groupCount" value={formData.groupCount} onChange={handleChange}>
                                <option value="Ninguna">Ninguna</option>
                                {[...Array(10).keys()].map(i => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label htmlFor="group_count_practica_select"><strong>Cant_Grup_Clase_Práctica</strong></label>
                            <select className="form-control" id="group_count_practica_select" name="groupCountPractica" value={formData.groupCountPractica} onChange={handleChange}>
                                <option value="Ninguna">Ninguna</option>
                                {[...Array(10).keys()].map(i => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="year_graduated"><strong>Año Graduado</strong></label>
                            <select className="form-control" id="year_graduated" name="yearGraduated" value={formData.yearGraduated} onChange={handleChange} required>
                                {/* Las opciones se llenarán dinámicamente */}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="experience_years"><strong>Años de experiencia</strong></label>
                            <select className="form-control" id="experience_years" name="experienceYears" value={formData.experienceYears} onChange={handleChange} required>
                                {/* Las opciones se llenarán dinámicamente */}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="sexo"><strong>Sexo</strong></label>
                            <select className="form-control" id="sexo" name="sexo" value={formData.sexo} onChange={handleChange} required>
                                <option value="" disabled hidden>Género</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label htmlFor="curso"><strong>Curso que imparte</strong></label>
                            <select className="form-control select2" id="curso" name="curso" multiple onChange={handleMultiSelectChange}>
                                {/* Las opciones se llenarán dinámicamente */}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="categoriaDocente"><strong>Categoría Docente</strong></label>
                            <select className="form-control select2" id="categoriaDocente" name="categoriaDocente" multiple onChange={handleMultiSelectChange}>
                                {/* Las opciones se llenarán dinámicamente */}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="anioAcademico"><strong>Año Académico</strong></label>
                            <select className="form-control select2" id="anioAcademico" name="anioAcademico" multiple onChange={handleMultiSelectChange}>
                                {/* Las opciones se llenarán dinámicamente */}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="carrera"><strong>Carrera</strong></label>
                            <select className="form-control select2" id="carrera" name="carrera" multiple onChange={handleMultiSelectChange}>
                                {/* Las opciones se llenarán dinámicamente */}
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label htmlFor="responsabilidad"><strong>Responsabilidad</strong></label>
                            <select className="form-control select2" id="responsabilidad" name="responsabilidad" multiple onChange={handleMultiSelectChange}>
                                {/* Las opciones se llenarán dinámicamente */}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="cargo"><strong>Cargo</strong></label>
                            <select className="form-control select2" id="cargo" name="cargo" multiple onChange={handleMultiSelectChange}>
                                {/* Las opciones se llenarán dinámicamente */}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="categoriaCientifica"><strong>Categoría Científica</strong></label>
                            <select className="form-control select2" id="categoriaCientifica" name="categoriaCientifica" value={formData.categoriaCientifica} onChange={handleChange} required>
                                <option value="" disabled hidden>Seleccione una categoría</option>
                                {/* Las opciones se cargarán dinámicamente */}
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-5">
                            <label htmlFor="asignaturaList"><strong>Asignatura:</strong></label>
                            <select className="form-control select2" id="asignaturaList" name="asignaturas" multiple onChange={handleMultiSelectChange}>
                                {/* Las opciones se llenarán dinámicamente */}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="areaList"><strong>Área:</strong></label>
                            <select className="form-control select2" id="areaList" name="areas" multiple onChange={handleMultiSelectChange}>
                                {/* Las opciones se llenarán dinámicamente */}
                            </select>
                        </div>
                    </div>

                    <div className="text-center mb-3">
                        <button className="btn btn-primary btn-sm" type="submit">Guardar cambios</button>
                        <button className="btn btn-danger btn-sm" type="button" onClick={() => window.location.href = '/control'}>Cancelar</button>
                    </div>
                </form>
            </div>
        </Container>
    );
};

export default AddTrabajador;
