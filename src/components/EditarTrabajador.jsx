import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import "select2";
import "../assets/css/bootstrap.min.css";
import "../assets/fonts/fontawesome-all.min.css";
import "../assets/css/EditarTrabajador.css";

const EditarTrabajador = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trabajador, setTrabajador] = useState(null);

    // Función para obtener el token desde el localStorage
    const getToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: 'No se encontró el token. Por favor, inicie sesión nuevamente.',
            });
            navigate('/login');
        }
        return token;
    };

    // Función para validar solo letras (incluyendo acentos y ñ)
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

    // Función para validar que el valor sea menor que 10
    const validateInput = (input) => {
        if (input.value > 9) {
            input.setCustomValidity('El valor debe ser menor que 10.');
        } else {
            input.setCustomValidity('');
        }
    };

    // Función para validar años de experiencia
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

    // Función para validar año de graduación
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

    // Función para obtener los datos del trabajador
    const obtenerDatosTrabajador = async (id_trabajador) => {
        try {
            const response = await fetch(`http://10.10.1.1:8000/apiv2/getTrabajador/${id_trabajador}/`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('No se pudo obtener la información del trabajador.');
            }

            const data = await response.json();
            setTrabajador(data);
            return data;
        } catch (error) {
            console.error('Error al cargar los datos del trabajador:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al cargar los datos del trabajador.',
            });
        }
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        if (!token) return;

        try {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            const response = await fetch(`http://10.10.1.1:8000/apiv2/trabajador/${id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el trabajador.');
            }

            Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'El trabajador ha sido actualizado correctamente.',
            }).then(() => {
                navigate('/control');
            });
        } catch (error) {
            console.error('Error al actualizar el trabajador:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al actualizar el trabajador.',
            });
        }
    };

    // Cargar datos del trabajador al montar el componente
    useEffect(() => {
        obtenerDatosTrabajador(id);
        $('.select2').select2();
    }, [id]);

    return (
        <div className="form-container">
            <h2>Editar Trabajador</h2>
            <form id="formEditarTrabajador" onSubmit={handleSubmit}>
                {/* Primera fila de 4 campos */}
                <div className="row">
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="username"><strong>Nombre</strong></label>
                            <input className="form-control" type="text" id="username" placeholder="Nombre" name="username" required />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="primerApellido"><strong>Primer Apellido</strong></label>
                            <input className="form-control" type="text" id="primerApellido" placeholder="Primer Apellido" name="primerApellido" required />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="segundoApellido"><strong>Segundo Apellido</strong></label>
                            <input className="form-control" type="text" id="segundoApellido" placeholder="Segundo Apellido" name="segundoApellido" required />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="group_count"><strong>Cant_Grup_Conferencia</strong></label>
                            <input className="form-control" type="number" id="group_count" placeholder="Cantidad de grupos" name="group_count" />
                        </div>
                    </div>
                </div>

                {/* Segunda fila de 4 campos */}
                <div className="row">
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="group_count_practica"><strong>Cant_Grup_Clase_Práctica</strong></label>
                            <input className="form-control" type="number" id="group_count_practica" placeholder="Cantidad de grupos" name="group_count_practica" />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="year_graduated"><strong>Año Graduado</strong></label>
                            <input className="form-control" type="number" id="year_graduated" placeholder="Ingrese año" name="year_graduated" />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="experience_years"><strong>Años de experiencia</strong></label>
                            <input className="form-control" type="number" id="experience_years" placeholder="Años de experiencia" name="experience_years" />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="sexo"><strong>Sexo</strong></label>
                            <select className="form-control" id="sexo" name="sexo" required>
                                <option value="" disabled>Género</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tercera fila de 4 campos */}
                <div className="row">
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="course"><strong>Curso que imparte</strong></label>
                            <select className="form-control select2" id="course" name="course" multiple="multiple"></select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="categoriaDocente"><strong>Categoría Docente</strong></label>
                            <select className="form-control select2" id="categoriaDocente" name="categoriaDocente" multiple="multiple"></select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="anioAcademico"><strong>Año Académico</strong></label>
                            <select className="form-control select2" id="anioAcademico" name="anioAcademico" multiple="multiple"></select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="career"><strong>Carrera</strong></label>
                            <select className="form-control select2" id="career" name="career" multiple="multiple"></select>
                        </div>
                    </div>
                </div>

                {/* Cuarta fila de 4 campos */}
                <div className="row">
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="responsabilidad"><strong>Responsabilidad</strong></label>
                            <select className="form-control select2" id="responsabilidad" name="responsabilidad" multiple="multiple"></select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="cargo"><strong>Cargo</strong></label>
                            <select className="form-control select2" id="cargo" name="cargo" multiple="multiple"></select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="categoriaCientifica"><strong>Categoría Científica</strong></label>
                            <select className="form-control select2" id="categoriaCientifica" name="categoriaCientifica">
                                <option value="" disabled>Seleccione una categoría</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Áreas y asignaturas */}
                <div className="row">
                    <div className="col-md-6">
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-light py-3">
                                <h6 className="mb-0"><strong>Asignatura</strong></h6>
                            </div>
                            <div className="card-body p-3">
                                <select className="form-control select2" id="asignaturaList" name="asignaturaList" multiple="multiple"></select>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-light py-3">
                                <h6 className="mb-0"><strong>Área</strong></h6>
                            </div>
                            <div className="card-body p-3">
                                <select className="form-control select2" id="areaList" name="areaList" multiple="multiple"></select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="text-center mb-3">
                    <button className="btn btn-primary btn-sm" type="submit">Guardar cambios</button>
                    <button className="btn btn-danger btn-sm" type="button" onClick={() => navigate('/control')}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default EditarTrabajador;