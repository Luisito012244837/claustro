import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2';
import Swal from 'sweetalert2';
import '../../assets/styles/AddWorker.css';

const AddWorker = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    cantGrupoConferencia: '0',
    cantGrupoClasePractica: '0',
    anioGraduado: '',
    aniosExperiencia: '',
    sexo: '',
    cursoImparte: [],
    categoriaDocente: [],
    anioAcademico: [],
    carrera: [],
    responsabilidad: [],
    cargo: [],
    categoriaCientifica: '',
    asignatura: [],
    area: []
  });

  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({
    cursos: [],
    categoriasDocente: [],
    aniosAcademicos: [],
    carreras: [],
    responsabilidades: [],
    cargos: [],
    categoriasCientificas: [],
    asignaturas: [],
    areas: []
  });

  const [errors, setErrors] = useState({
    nombre: false,
    primerApellido: false,
    segundoApellido: false,
    categoriaCientifica: false
  });

  // Función para obtener datos de la API
  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      throw error;
    }
  };

  // Cargar todas las opciones desde la API
  const loadOptions = useCallback(async () => {
    try {
      setLoading(true);
      
      const [
        cursos,
        categoriasDocente,
        aniosAcademicos,
        carreras,
        responsabilidades,
        cargos,
        categoriasCientificas,
        asignaturas,
        areas
      ] = await Promise.all([
        fetchData('http://10.10.1.1:8000/apiv2/tipo-curso/'),
        fetchData('http://10.10.1.1:8000/apiv2/categoria-docente/'),
        fetchData('http://10.10.1.1:8000/apiv2/anno-academico/'),
        fetchData('http://10.10.1.1:8000/apiv2/carrera/'),
        fetchData('http://10.10.1.1:8000/apiv2/responsabilidad/'),
        fetchData('http://10.10.1.1:8000/apiv2/cargo/'),
        fetchData('http://10.10.1.1:8000/apiv2/categoria-cientifica/'),
        fetchData('http://10.10.1.1:8000/apiv2/asignatura/'),
        fetchData('http://10.10.1.1:8000/apiv2/area/')
      ]);

      setOptions({
        cursos,
        categoriasDocente,
        aniosAcademicos,
        carreras,
        responsabilidades,
        cargos,
        categoriasCientificas,
        asignaturas,
        areas
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading options:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al cargar los datos. Por favor, recarga la página.',
      });
      setLoading(false);
    }
  }, []);

  // Inicializar Select2 y cargar datos
  useEffect(() => {
    loadOptions();

    // Inicializar Select2 después de que se hayan cargado las opciones
    const initializeSelect2 = () => {
      $('.select2-multiple').select2({
        placeholder: "Seleccionar",
        closeOnSelect: false,
        allowClear: true,
      });

      $('#categoriaCientifica').select2({
        placeholder: "Seleccione una categoría",
        allowClear: true,
        width: '100%',
        dropdownParent: $('#categoriaCientifica').parent()
      });

      // Manejar cambios en Select2
      $('.select2-multiple').on('change', function(e) {
        const { name } = e.target;
        const values = $(this).val() || [];
        setFormData(prev => ({
          ...prev,
          [name]: values
        }));
      });

      $('#categoriaCientifica').on('change', function(e) {
        const value = $(this).val();
        setFormData(prev => ({
          ...prev,
          categoriaCientifica: value || ''
        }));
      });
    };

    const timer = setTimeout(initializeSelect2, 100);
    
    return () => {
      clearTimeout(timer);
      $('.select2-multiple').off('change');
      $('#categoriaCientifica').off('change');
      $('.select2-multiple').select2('destroy');
      $('#categoriaCientifica').select2('destroy');
    };
  }, [loadOptions, options]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showSmallAlert = (options) => {
    return Swal.fire({
      width: 350,
      padding: '1em',
      customClass: {
        container: 'small-swal-container',
        popup: 'small-swal-popup',
        title: 'small-swal-title',
        content: 'small-swal-content',
        confirmButton: 'small-swal-confirm-button',
        cancelButton: 'small-swal-cancel-button'
      },
      buttonsStyling: false,
      ...options
    });
  };

  const handleCancel = () => {
    showSmallAlert({
      title: '¿Cancelar cambios?',
      text: '¿Estás seguro que deseas salir sin guardar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'No, quedarme',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/control');
      }
    });
  };

  const validateForm = () => {
    const newErrors = {
      nombre: !formData.nombre,
      primerApellido: !formData.primerApellido,
      segundoApellido: !formData.segundoApellido,
      categoriaCientifica: !formData.categoriaCientifica
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const data = {
        nombre: formData.nombre,
        primer_apellido: formData.primerApellido,
        segundo_apellido: formData.segundoApellido,
        cantidad_grupo_c: formData.cantGrupoConferencia,
        cantidad_grupo_cp: formData.cantGrupoClasePractica,
        ano_graduado: formData.anioGraduado || "",
        anos_experiencia: formData.aniosExperiencia || "",
        sexo: formData.sexo,
        nombre_categoria_cientifica: formData.categoriaCientifica,
        nombre_categoria_docente: formData.categoriaDocente,
        nombre_curso: formData.cursoImparte,
        anno_academico: formData.anioAcademico,
        nombre_carrera: formData.carrera,
        nombre_responsabilidad: formData.responsabilidad,
        nombre_cargo: formData.cargo,
        nombre_asignatura: formData.asignatura,
        nombre_area: formData.area
      };

      const response = await fetch('http://10.10.1.1:8000/apiv2/insertTrabajador/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await showSmallAlert({
          title: '¡Éxito!',
          text: 'Trabajador agregado correctamente',
          icon: 'success'
        });
        navigate('/control');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar');
      }
    } catch (error) {
      await showSmallAlert({
        title: 'Error',
        text: error.message || 'Ocurrió un error al guardar los datos',
        icon: 'error'
      });
    }
  };

  // Generar opciones para años
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1950; year <= currentYear; year++) {
      years.push(<option key={year} value={year}>{year}</option>);
    }
    return years;
  };

  // Generar opciones para años de experiencia
  const generateExperienceOptions = () => {
    const options = [];
    for (let i = 0; i <= 100; i++) {
      options.push(<option key={i} value={i}>{i}</option>);
    }
    return options;
  };

  // Generar opciones numéricas para grupos
  const generateNumberOptions = () => {
    const options = [];
    for (let i = 0; i <= 10; i++) {
      options.push(<option key={i} value={i}>{i}</option>);
    }
    return options;
  };

  if (loading) {
    return (
      <div className="add-worker-container">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden"></span>
          </div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-worker-container">
      <h2>Agregar nuevo trabajador</h2>
      <form onSubmit={handleSubmit}>
        {/* Primera fila de campos */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre"><strong>Nombre</strong></label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              className={errors.nombre ? 'is-invalid' : ''}
            />
            {errors.nombre && <div className="error-message">Por favor, ingresa un nombre válido.</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="primerApellido"><strong>Primer Apellido</strong></label>
            <input
              type="text"
              id="primerApellido"
              name="primerApellido"
              value={formData.primerApellido}
              onChange={handleInputChange}
              required
              className={errors.primerApellido ? 'is-invalid' : ''}
            />
            {errors.primerApellido && <div className="error-message">Por favor, ingresa un apellido válido.</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="segundoApellido"><strong>Segundo Apellido</strong></label>
            <input
              type="text"
              id="segundoApellido"
              name="segundoApellido"
              value={formData.segundoApellido}
              onChange={handleInputChange}
              required
              className={errors.segundoApellido ? 'is-invalid' : ''}
            />
            {errors.segundoApellido && <div className="error-message">Por favor, ingresa un apellido válido.</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="cantGrupoConferencia"><strong>Cant Grupo Conferencia</strong></label>
            <select
              id="cantGrupoConferencia"
              name="cantGrupoConferencia"
              value={formData.cantGrupoConferencia}
              onChange={handleNumberSelectChange}
            >
              {generateNumberOptions()}
            </select>
          </div>
        </div>

        {/* Segunda fila de campos */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cantGrupoClasePractica"><strong>Cant Grupo Clase Práctica</strong></label>
            <select
              id="cantGrupoClasePractica"
              name="cantGrupoClasePractica"
              value={formData.cantGrupoClasePractica}
              onChange={handleNumberSelectChange}
            >
              {generateNumberOptions()}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="anioGraduado"><strong>Año Graduado</strong></label>
            <select
              id="anioGraduado"
              name="anioGraduado"
              value={formData.anioGraduado}
              onChange={handleInputChange}
            >
              <option value="">Seleccionar</option>
              {generateYearOptions()}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="aniosExperiencia"><strong>Años de experiencia</strong></label>
            <select
              id="aniosExperiencia"
              name="aniosExperiencia"
              value={formData.aniosExperiencia}
              onChange={handleInputChange}
            >
              <option value="">Seleccionar</option>
              {generateExperienceOptions()}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="sexo"><strong>Sexo</strong></label>
            <select
              id="sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
        </div>

        {/* Tercera fila de campos */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cursoImparte"><strong>Curso que imparte</strong></label>
            <select
              className="select2-multiple"
              id="cursoImparte"
              name="cursoImparte"
              multiple="multiple"
            >
              {options.cursos.map(curso => (
                <option key={curso.id} value={curso.nombre_curso}>
                  {curso.nombre_curso}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="categoriaDocente"><strong>Categoría Docente</strong></label>
            <select
              className="select2-multiple"
              id="categoriaDocente"
              name="categoriaDocente"
              multiple="multiple"
            >
              {options.categoriasDocente.map(categoria => (
                <option key={categoria.id} value={categoria.nombre_categoria_docente}>
                  {categoria.nombre_categoria_docente}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="anioAcademico"><strong>Año Académico</strong></label>
            <select
              className="select2-multiple"
              id="anioAcademico"
              name="anioAcademico"
              multiple="multiple"
            >
              {options.aniosAcademicos.map(anio => (
                <option key={anio.id} value={anio.anno}>
                  {anio.anno}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="carrera"><strong>Carrera</strong></label>
            <select
              className="select2-multiple"
              id="carrera"
              name="carrera"
              multiple="multiple"
            >
              {options.carreras.map(carrera => (
                <option key={carrera.id} value={carrera.nombre_carrera}>
                  {carrera.nombre_carrera}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cuarta fila de campos */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="responsabilidad"><strong>Responsabilidad</strong></label>
            <select
              className="select2-multiple"
              id="responsabilidad"
              name="responsabilidad"
              multiple="multiple"
            >
              {options.responsabilidades.map(responsabilidad => (
                <option key={responsabilidad.id} value={responsabilidad.nombre_responsabilidad}>
                  {responsabilidad.nombre_responsabilidad}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="cargo"><strong>Cargo</strong></label>
            <select
              className="select2-multiple"
              id="cargo"
              name="cargo"
              multiple="multiple"
            >
              {options.cargos.map(cargo => (
                <option key={cargo.id} value={cargo.nombre_cargo}>
                  {cargo.nombre_cargo}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="categoriaCientifica"><strong>Categoría Científica</strong></label>
            <select
              className="select2"
              id="categoriaCientifica"
              name="categoriaCientifica"
            >
              <option value="">Seleccionar</option>
              {options.categoriasCientificas.map(categoria => (
                <option key={categoria.id} value={categoria.nombre_categoria_cientifica}>
                  {categoria.nombre_categoria_cientifica}
                </option>
              ))}
            </select>
            {errors.categoriaCientifica && (
              <div className="error-message"><strong>Por favor, selecciona una categoría científica.</strong></div>
            )}
          </div>
        </div>

        {/* Asignatura y área */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="asignatura"><strong>Asignatura</strong></label>
            <select
              className="select2-multiple"
              id="asignatura"
              name="asignatura"
              multiple="multiple"
            >
              {options.asignaturas.map(asignatura => (
                <option key={asignatura.id} value={asignatura.nombre_asignatura}>
                  {asignatura.nombre_asignatura}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="area"><strong>Área</strong></label>
            <select
              className="select2-multiple"
              id="area"
              name="area"
              multiple="multiple"
            >
              {options.areas.map(area => (
                <option key={area.id} value={area.nombre_area}>
                  {area.nombre_area}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button type="button" onClick={handleCancel} className="cancel-button" disabled={loading}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWorker;