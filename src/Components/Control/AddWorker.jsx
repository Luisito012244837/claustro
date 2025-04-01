import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2';
import Swal from 'sweetalert2';
import '../../assets/styles/AddWorker.css';
import { useTheme } from '../Home/ThemeContext';

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar-container">
      {progress === 0 ? (
        <div className="wrapper">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="shadow"></div>
          <div className="shadow"></div>
          <div className="shadow"></div>
        </div>
      ) : (
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      )}
    </div>
  );
};

const AddWorker = () => {
  const { darkMode } = useTheme();
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
    cargo: [],
    categoriaCientifica: '',
    asignatura: [],
    area: [],
    responsabilidadesPorFacultad: {}
  });

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // Estado para el progreso
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

  const loadOptions = useCallback(async () => {
    setLoading(true);
    setProgress(0); // Reinicia el progreso al comenzar la carga

    try {
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
        fetchData('http://10.10.1.1:8000/apiv2/tipo-curso/').then(() => setProgress(11)),
        fetchData('http://10.10.1.1:8000/apiv2/categoria-docente/').then(() => setProgress(22)),
        fetchData('http://10.10.1.1:8000/apiv2/anno-academico/').then(() => setProgress(33)),
        fetchData('http://10.10.1.1:8000/apiv2/carrera/').then(() => setProgress(44)),
        fetchData('http://10.10.1.1:8000/apiv2/responsabilidad/').then(() => setProgress(55)),
        fetchData('http://10.10.1.1:8000/apiv2/cargo/').then(() => setProgress(66)),
        fetchData('http://10.10.1.1:8000/apiv2/categoria-cientifica/').then(() => setProgress(77)),
        fetchData('http://10.10.1.1:8000/apiv2/asignatura/').then(() => setProgress(88)),
        fetchData('http://10.10.1.1:8000/apiv2/area/').then(() => setProgress(100))
      ]);

      const areasConTipo = areas.map(area => ({
        ...area,
        esFacultad: area.nombre_area.toLowerCase().includes('facultad')
      }));

      setOptions({
        cursos,
        categoriasDocente,
        aniosAcademicos,
        carreras,
        responsabilidades,
        cargos,
        categoriasCientificas,
        asignaturas,
        areas: areasConTipo
      });
    } catch (error) {
      console.error('Error loading options:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al cargar los datos. Por favor, recarga la página.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOptions();
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
    };

    const timer = setTimeout(initializeSelect2, 100);
    return () => {
      clearTimeout(timer);
      $('.select2-multiple').select2('destroy');
      $('#categoriaCientifica').select2('destroy');
    };
  }, [loadOptions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Expresión regular para permitir solo letras y la letra "ñ"
    const regex = /^[a-zA-ZñÑ\s]*$/;
  
    // Verificar si el valor es válido
    if (regex.test(value) || value === '') { // Permitir vacío para facilitar la edición
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      nombre: !formData.nombre,
      primerApellido: !formData.primerApellido,
      segundoApellido: !formData.segundoApellido,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleCancel = () => {
    Swal.fire({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      ...formData,
      nombre_categoria_cientifica: formData.categoriaCientifica,
      nombre_responsabilidad: Object.values(formData.responsabilidadesPorFacultad).flat(),
    };

    try {
      const response = await fetch('http://10.10.1.1:8000/apiv2/insertTrabajador/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await Swal.fire({
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
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Ocurrió un error al guardar los datos',
        icon: 'error'
      });
    }
  };

  const generateYearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (
      <option key={i + 1950} value={i + 1950}>{i + 1950}</option>
    ));
  }, []);

  const generateExperienceOptions = useMemo(() => {
    return Array.from({ length: 101 }, (_, i) => (
      <option key={i} value={i}>{i}</option>
    ));
  }, []);

  const generateNumberOptions = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => (
      <option key={i} value={i}>{i}</option>
    ));
  }, []);

  if (loading) {
    return (
      <div className={`add-worker-container ${darkMode ? 'dark-theme' : ''}`}>
        <ProgressBar progress={progress} />
      </div>
    );
  }

  return (
    <div className={`add-worker-container ${darkMode ? 'dark-theme' : ''}`}>
      <div className="form-scroll-container"> 
        <h2>Agregar nuevo trabajador</h2>
        <form onSubmit={handleSubmit}>
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
                onChange={handleInputChange}
              >
                {generateNumberOptions}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cantGrupoClasePractica"><strong>Cant Grupo Clase Práctica</strong></label>
              <select
                id="cantGrupoClasePractica"
                name="cantGrupoClasePractica"
                value={formData.cantGrupoClasePractica}
                onChange={handleInputChange}
              >
                {generateNumberOptions}
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
                {generateYearOptions}
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
                {generateExperienceOptions}
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

          <div className="form-row">
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
    </div>
  );
};

export default AddWorker;
