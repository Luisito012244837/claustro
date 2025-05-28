import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Select from 'react-select';
import '../../assets/styles/EditWorker.css';
import { fetchWithAuth } from '../../assets/auth/authHelper';

const EditWorker = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const worker = location.state?.worker;
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  // Añadir estado para rastrear los datos originales
  const [originalData, setOriginalData] = useState(null);
  // Añadir estado para rastrear campos modificados
  const [modifiedFields, setModifiedFields] = useState({});

  const [options, setOptions] = useState({
    cursos: [],
    categoriasDocente: [],
    aniosAcademicos: [],
    carreras: [],
    cargos: [],
    categoriasCientificas: [],
    asignaturas: [],
    areas: [],
    facultades: [],
    responsabilidades: [],
  });

  const [formData, setFormData] = useState({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    sexo: '',
    cantGrupoConferencia: '',
    cantGrupoClasePractica: '',
    anioGraduado: '',
    aniosExperiencia: '',
    categoriaCientifica: null,
    categoriaDocente: null,
    areasCargos: [{ id_area: null, cargos: [] }],
    facultadesResponsabilidades: [{ id_facultad: null, responsabilidades: [], es_plantilla: false }],
    asignatura: [],
    carrera: [],
    anioAcademico: [],
    cursoImparte: [],
  });

  // Función para obtener datos de la API
  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error al obtener los datos de ${url}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Cargar opciones desde la API
  const loadOptions = useCallback(async () => {
    setLoading(true);
    try {
      const [
        cursos = [],
        categoriasDocente = [],
        aniosAcademicos = [],
        carreras = [],
        cargos = [],
        categoriasCientificas = [],
        asignaturas = [],
        areas = [],
        facultades = [],
        responsabilidades = [],
      ] = await Promise.all([
        fetchData('http://10.10.1.1:8000/api/v2/tipo-curso/'),
        fetchData('http://10.10.1.1:8000/api/v2/categoria-docente/'),
        fetchData('http://10.10.1.1:8000/api/v2/anno-academico/'),
        fetchData('http://10.10.1.1:8000/api/v2/carrera/'),
        fetchData('http://10.10.1.1:8000/api/v2/cargo/'),
        fetchData('http://10.10.1.1:8000/api/v2/categoria-cientifica/'),
        fetchData('http://10.10.1.1:8000/api/v2/asignatura/'),
        fetchData('http://10.10.1.1:8000/api/v2/area/'),
        fetchData('http://10.10.1.1:8000/api/v2/facultad/'),
        fetchData('http://10.10.1.1:8000/api/v2/responsabilidad/'),
      ]);

      setOptions({
        cursos,
        categoriasDocente,
        aniosAcademicos,
        carreras,
        cargos,
        categoriasCientificas,
        asignaturas,
        areas,
        facultades,
        responsabilidades,
      });
    } catch (error) {
      console.error(error);
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
  }, [loadOptions]);

  useEffect(() => {
    if (worker) {
      console.log("Datos del trabajador recibidos:", worker);
      
      // Mapear los datos del trabajador al formato del formulario
      const mappedData = {
        nombre: worker.nombre || '',
        primerApellido: worker.primer_apellido || '',
        segundoApellido: worker.segundo_apellido || '',
        sexo: worker.sexo || '',
        cantGrupoConferencia: worker.cantidad_grupo_c || '',
        cantGrupoClasePractica: worker.cantidad_grupo_cp || '',
        anioGraduado: worker.anno_graduado || '',
        aniosExperiencia: worker.annos_experiencia || '',
        categoriaCientifica: worker.categoria_cientifica || null,
        categoriaDocente: worker.categoria_docente || null,
        
        // Mapear áreas y cargos
        areasCargos: worker.areas && worker.areas.length > 0 
          ? worker.areas.map(area => ({
              id_area: area.id_area,
              cargos: area.cargos || []
            }))
          : [{ id_area: null, cargos: [] }],
        
        // Mapear facultades y responsabilidades
        facultadesResponsabilidades: worker.facultades && worker.facultades.length > 0
          ? worker.facultades.map(facultad => ({
              id_facultad: facultad.id_facultad,
              responsabilidades: facultad.responsabilidades || [],
              es_plantilla: facultad.es_plantilla || false
            }))
          : [{ id_facultad: null, responsabilidades: [], es_plantilla: false }],
        
        // Mapear listas simples
        asignatura: worker.asignaturas 
          ? worker.asignaturas.map(a => a.id_asignatura) 
          : [],
        carrera: worker.carreras 
          ? worker.carreras.map(c => c.id_carrera) 
          : [],
        anioAcademico: worker.annos_academicos 
          ? worker.annos_academicos.map(a => a.id_anno_academico) 
          : [],
        cursoImparte: worker.tipos_cursos 
          ? worker.tipos_cursos.map(t => t.id_tipo_curso) 
          : [],
      };
      
      setFormData(mappedData);
      // Guardar los datos originales para comparación posterior
      setOriginalData(JSON.parse(JSON.stringify(mappedData)));
    }
  }, [worker]);

  // Función para marcar un campo como modificado
  const markAsModified = (fieldName) => {
    setModifiedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  // Manejar cambios en inputs de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    markAsModified(name);
  };

  // Generar opciones para selects numéricos
  const generateOptions = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => ({
      value: start + i,
      label: start + i,
    }));
  };
    
  const generateYearOptions = useMemo(() => generateOptions(1950, new Date().getFullYear()), []);
  const generateNumberOptions = useMemo(() => generateOptions(0, 10), []);
  const generateExperienceOptions = useMemo(() => generateOptions(0, 100), []);

  // Manejar cambios en selects múltiples
  const handleSelectChange = (field, selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData(prev => ({
      ...prev,
      [field]: values
    }));
    markAsModified(field);
  };


// Modificar la función validateForm para que no valide estos campos como obligatorios
const validateForm = () => {
  const newErrors = {};
  
  // Eliminamos las validaciones obligatorias para estos campos
  // Podemos mantener otras validaciones si las hay
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  // Función para verificar si un campo ha sido modificado
  const hasFieldChanged = (field, currentValue, originalValue) => {
    // Para arrays, comparamos su contenido
    if (Array.isArray(currentValue) && Array.isArray(originalValue)) {
      if (currentValue.length !== originalValue.length) return true;
      return !currentValue.every(item => originalValue.includes(item));
    }
    
    // Para objetos complejos, comparamos su representación JSON
    if (typeof currentValue === 'object' && currentValue !== null && 
        typeof originalValue === 'object' && originalValue !== null) {
      return JSON.stringify(currentValue) !== JSON.stringify(originalValue);
    }
    
    // Para valores simples, comparación directa
    return currentValue !== originalValue;
  };

  // Función para obtener solo los campos modificados
  const getModifiedFields = () => {
    const modified = {
      id_trabajador: worker.id_trabajador,
       nombre: formData.nombre.trim(),
       segundo_apellido: formData.segundoApellido.trim(),
       sexo: formData.sexo,
       primer_apellido: formData.primerApellido.trim(),
        // Siempre incluir el ID
    };
    
    
    if (hasFieldChanged('cantGrupoConferencia', formData.cantGrupoConferencia, originalData.cantGrupoConferencia)) {
      modified.cantidad_grupo_c = formData.cantGrupoConferencia ? parseInt(formData.cantGrupoConferencia, 10) : null;
    }
    
    if (hasFieldChanged('cantGrupoClasePractica', formData.cantGrupoClasePractica, originalData.cantGrupoClasePractica)) {
      modified.cantidad_grupo_cp = formData.cantGrupoClasePractica ? parseInt(formData.cantGrupoClasePractica, 10) : null;
    }
    
    if (hasFieldChanged('anioGraduado', formData.anioGraduado, originalData.anioGraduado)) {
      modified.anno_graduado = formData.anioGraduado ? parseInt(formData.anioGraduado, 10) : null;
    }
    
    if (hasFieldChanged('aniosExperiencia', formData.aniosExperiencia, originalData.aniosExperiencia)) {
      modified.annos_experiencia = formData.aniosExperiencia ? parseInt(formData.aniosExperiencia, 10) : null;
    }
    
    if (hasFieldChanged('categoriaCientifica', formData.categoriaCientifica, originalData.categoriaCientifica)) {
      modified.categoria_cientifica = formData.categoriaCientifica || null;
    }
    
    if (hasFieldChanged('categoriaDocente', formData.categoriaDocente, originalData.categoriaDocente)) {
      modified.categoria_docente = formData.categoriaDocente || null;
    }
    
    // Campos complejos
    if (hasFieldChanged('areasCargos', formData.areasCargos, originalData.areasCargos)) {
      modified.areas = formData.areasCargos
        .filter(item => item.id_area)
        .map(item => ({
          id_area: parseInt(item.id_area, 10),
          id_cargo: item.cargos && item.cargos.length > 0 ? parseInt(item.cargos[0], 10) : null
        }));
    }
    
    if (hasFieldChanged('facultadesResponsabilidades', formData.facultadesResponsabilidades, originalData.facultadesResponsabilidades)) {
      modified.facultades = formData.facultadesResponsabilidades
        .filter(item => item.id_facultad)
        .map(item => ({
          id_facultad: parseInt(item.id_facultad, 10),
          id_responsabilidad: item.responsabilidades && item.responsabilidades.length > 0 ? 
            parseInt(item.responsabilidades[0], 10) : null,
          es_plantilla: Boolean(item.es_plantilla)
        }));
    }
    
    // Listas
    if (hasFieldChanged('asignatura', formData.asignatura, originalData.asignatura)) {
      modified.asignaturas = formData.asignatura.map(id => ({
        id_asignatura: parseInt(id, 10)
      }));
    }
    
    if (hasFieldChanged('carrera', formData.carrera, originalData.carrera)) {
      modified.carreras = formData.carrera.map(id => ({
        id_carrera: parseInt(id, 10)
      }));
    }
    
    if (hasFieldChanged('anioAcademico', formData.anioAcademico, originalData.anioAcademico)) {
      modified.anio_academico = formData.anioAcademico.map(id => ({
        id_anio_academico: parseInt(id, 10)
      }));
    }
    if (hasFieldChanged('cursoImparte', formData.cursoImparte, originalData.cursoImparte)) {
      modified.tipos_cursos = formData.cursoImparte.map(id => ({
        id_tipo_curso: parseInt(id, 10)
      }));
    }
    
    return modified;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Verificar que el ID del trabajador existe
    if (!worker || !worker.id_trabajador) {
      Swal.fire({
        title: 'Error',
        text: 'No se puede editar el trabajador: ID no encontrado',
        icon: 'error',
      });
      return;
    }

    // Obtener solo los campos modificados
    const modifiedData = getModifiedFields();
    
    // Verificar si hay cambios para enviar
    if (Object.keys(modifiedData).length <= 1) { // Solo contiene el ID
      await Swal.fire({
        title: 'Información',
        text: 'No se detectaron cambios en los datos del trabajador',
        icon: 'info',
      });
      navigate('/control');
      return;
    }

    console.log("Datos modificados a enviar:", JSON.stringify(modifiedData, null, 2));

    try {
      setLoading(true);
      const response = await fetchWithAuth('http://10.10.1.1:8000/api/v2/modifyTrabajador/', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(modifiedData),
      });
      
      if (response.ok) {
        await Swal.fire({
          title: '¡Éxito!',
          text: 'Trabajador actualizado correctamente',
          icon: 'success',
        });
        navigate('/control');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error de la API:", errorData);
        console.error("Status:", response.status);
        console.error("StatusText:", response.statusText);
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error completo:", error);
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Ocurrió un error al actualizar los datos',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/control');
  };

  // Función para manejar cambios en áreas y cargos
  const handleAreaCargoChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedAreasCargos = [...prev.areasCargos];
      updatedAreasCargos[index][field] = value;
      return { ...prev, areasCargos: updatedAreasCargos };
    });
    markAsModified('areasCargos');
  };

  // Función para manejar cambios en facultades y responsabilidades
  const handleFacultadResponsabilidadChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedFacultadesResponsabilidades = [...prev.facultadesResponsabilidades];
      updatedFacultadesResponsabilidades[index][field] = value;
      return { ...prev, facultadesResponsabilidades: updatedFacultadesResponsabilidades };
    });
    markAsModified('facultadesResponsabilidades');
  };

  return (
    <div className="add-worker-container  scrollable-form">
      <h2>Editar trabajador</h2>
      <form onSubmit={handleSubmit}>
        {/* ========================= */}
        {/* Fila 1: Información básica */}
        {/* ========================= */}
        <div className="form-row">
           <div className="form-group">
            <label htmlFor="nombre"><strong>Nombre</strong></label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
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
              className={errors.segundoApellido ? 'is-invalid' : ''}
            />
            {errors.segundoApellido && <div className="error-message">Por favor, ingresa un apellido válido.</div>}
          </div>

          <div className="form-group">
            <label htmlFor="sexo"><strong>Sexo</strong></label>
            <select
              id="sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleInputChange}
              aria-label="Seleccionar sexo"
            >
              <option value="">Seleccionar</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            {errors.sexo && <div className="error-message">Por favor, selecciona un sexo.</div>}
          </div>
        </div>

        {/* ========================= */}
        {/* Fila 2: Experiencia y años */}
        {/* ========================= */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cantGrupoConferencia"><strong>Cant Grupo Conferencia</strong></label>
            <select
              id="cantGrupoConferencia"
              name="cantGrupoConferencia"
              value={formData.cantGrupoConferencia}
              onChange={handleInputChange}
            >
              <option value="">Seleccionar</option>
              {generateNumberOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cantGrupoClasePractica"><strong>Cant Grupo Clase Práctica</strong></label>
            <select
              id="cantGrupoClasePractica"
              name="cantGrupoClasePractica"
              value={formData.cantGrupoClasePractica}
              onChange={handleInputChange}
            >
              <option value="">Seleccionar</option>
              {generateNumberOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
              {generateYearOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
              {generateExperienceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ========================= */}
        {/* Fila 3: Categorías y cursos */}
        {/* ========================= */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cursoImparte"><strong>Curso que imparte</strong></label>
            <Select
              id="cursoImparte"
              name="cursoImparte"
              isMulti
              options={options.cursos?.map((curso) => ({
                value: curso.id_tipo_curso,
                label: curso.nombre_tipo_curso
              })) || []}
              value={formData.cursoImparte?.map((id) => {
                const curso = options.cursos?.find(c => c.id_tipo_curso === id);
                return curso ? { value: curso.id_tipo_curso, label: curso.nombre_tipo_curso } : null;
              }).filter(Boolean) || []}
              onChange={(selected) => {
                const selectedIds = selected ? selected.map(option => option.value) : [];
                setFormData(prev => ({
                  ...prev,
                  cursoImparte: selectedIds
                }));
                markAsModified('cursoImparte');
              }}
              placeholder="Seleccionar cursos"
              classNamePrefix="react-select"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoriaDocente"><strong>Categoría Docente</strong></label>
            <Select
              id="categoriaDocente"
              name="categoriaDocente"
              options={options.categoriasDocente?.map((categoria) => ({
                value: categoria.id_categoria_docente,
                label: categoria.nombre_categoria_docente
              })) || []}
              value={
                formData.categoriaDocente
                  ? {
                      value: formData.categoriaDocente,
                      label: options.categoriasDocente?.find(
                        c => c.id_categoria_docente === formData.categoriaDocente
                      )?.nombre_categoria_docente || ''
                    }
                  : null
              }
              onChange={(selected) => {
                setFormData(prev => ({
                  ...prev,
                  categoriaDocente: selected ? selected.value : null
                }));
                markAsModified('categoriaDocente');
              }}
              placeholder="Seleccionar categoría"
              classNamePrefix="react-select"
              isClearable
            />
          </div>

          <div className="form-group">
            <label htmlFor="anioAcademico"><strong>Año Académico</strong></label>
            <Select
              id="anioAcademico"
              name="anioAcademico"
              isMulti
              options={options.aniosAcademicos?.map((anio) => ({
                value: anio.id_anno_academico,
                label: anio.nombre_anno_academico
              })) || []}
              value={formData.anioAcademico?.map(id => {
                const anio = options.aniosAcademicos?.find(a => a.id_anno_academico === id);
                return anio ? { value: anio.id_anno_academico, label: anio.nombre_anno_academico } : null;
              }).filter(Boolean) || []}
              onChange={(selected) => {
                handleSelectChange('anioAcademico', selected);
                markAsModified('anioAcademico');
              }}
              placeholder="Seleccionar años académicos"
              classNamePrefix="react-select"
              closeMenuOnSelect={false}
            />
          </div>

          <div className="form-group">
            <label htmlFor="carrera"><strong>Carrera</strong></label>
            <Select
              id="carrera"
              name="carrera"
              isMulti
              options={options.carreras?.map((carrera) => ({
                value: carrera.id_carrera,
                label: carrera.nombre_carrera
              })) || []}
              value={formData.carrera?.map(id => {
                const carrera = options.carreras?.find(c => c.id_carrera === id);
                return carrera ? { value: carrera.id_carrera, label: carrera.nombre_carrera } : null;
              }).filter(Boolean) || []}
              onChange={(selected) => {
                handleSelectChange('carrera', selected);
                markAsModified('carrera');
              }}
              placeholder="Seleccionar carreras"
              classNamePrefix="react-select"
              closeMenuOnSelect={false}
            />
          </div>
        </div>

        {/* ========================= */}
        {/* Fila 4: Categoría científica y asignaturas */}
        {/* ========================= */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="categoriaCientifica"><strong>Categoría Científica</strong></label>
            <Select
              id="categoriaCientifica"
              name="categoriaCientifica"
              options={options.categoriasCientificas?.map((categoria) => ({
                value: categoria.id_categoria_cientifica,
                label: categoria.nombre_categoria_cientifica
              })) || []}
              value={
                formData.categoriaCientifica
                  ? {
                      value: formData.categoriaCientifica,
                      label: options.categoriasCientificas?.find(
                        c => c.id_categoria_cientifica === formData.categoriaCientifica
                      )?.nombre_categoria_cientifica || ''
                    }
                  : null
              }
              onChange={(selected) => {
                setFormData(prev => ({
                  ...prev,
                  categoriaCientifica: selected ? selected.value : null
                }));
                markAsModified('categoriaCientifica');
              }}
              placeholder="Seleccionar categoría científica"
              classNamePrefix="react-select"
              isClearable
            />
          </div>

          <div className="form-group">
                        <label htmlFor="asignatura"><strong>Asignatura</strong></label>
            <Select
              id="asignatura"
              name="asignatura"
              isMulti
              options={options.asignaturas?.map((asignatura) => ({
                value: asignatura.id_asignatura,
                label: asignatura.nombre_asignatura
              })) || []}
              value={formData.asignatura?.map(id => {
                const asignatura = options.asignaturas?.find(a => a.id_asignatura === id);
                return asignatura ? { value: asignatura.id_asignatura, label: asignatura.nombre_asignatura } : null;
              }).filter(Boolean) || []}
              onChange={(selected) => {
                handleSelectChange('asignatura', selected);
                markAsModified('asignatura');
              }}
              placeholder="Seleccionar asignaturas"
              classNamePrefix="react-select"
              closeMenuOnSelect={false}
            />
          </div>
        </div>

        <hr />

        {/* ========================= */}
        {/* Sección dinámica: Áreas y Cargos */}
        {/* ========================= */}
        <div className="form-row">
          {formData.areasCargos.map((item, index) => (
            <div key={index} className="area-cargo-container">
              {/* Campo Área */}
              <div className="form-group" style={{ flex: 1, marginRight: '10px' }}>
                <label htmlFor={`area-${index}`}><strong>Área</strong></label>
                <Select
                  id={`area-${index}`}
                  name={`area-${index}`}
                  options={options.areas?.map((area) => ({
                    value: area.id_area,
                    label: area.nombre_area
                  })) || []}
                  value={
                    item.id_area
                      ? {
                          value: item.id_area,
                          label: options.areas?.find(a => a.id_area === item.id_area)?.nombre_area || ''
                        }
                      : null
                  }
                  onChange={(selected) => {
                    handleAreaCargoChange(index, 'id_area', selected ? selected.value : null);
                    // Resetear cargos cuando cambia el área
                    handleAreaCargoChange(index, 'cargos', []);
                  }}
                  placeholder="Seleccionar área"
                  classNamePrefix="react-select"
                  isClearable
                />
              </div>

              {/* Campo Cargo - Solo mostrar si hay un área seleccionada */}
              {item.id_area && (
                <div className="form-group" style={{ flex: 1, marginLeft: '10px' }}>
                  <label htmlFor={`cargo-${index}`}><strong>Cargo</strong></label>
                  <Select
                    id={`cargo-${index}`}
                    name={`cargo-${index}`}
                    isMulti
                    options={options.cargos?.map((cargo) => ({
                      value: cargo.id_cargo,
                      label: cargo.nombre_cargo
                    })) || []}
                    value={item.cargos?.map(id => {
                      const cargo = options.cargos?.find(c => c.id_cargo === id);
                      return cargo ? { value: cargo.id_cargo, label: cargo.nombre_cargo } : null;
                    }).filter(Boolean) || []}
                    onChange={(selected) => {
                      handleAreaCargoChange(
                        index, 
                        'cargos', 
                        selected ? selected.map(option => option.value) : []
                      );
                    }}
                    placeholder="Seleccionar cargos"
                    classNamePrefix="react-select"
                    closeMenuOnSelect={false}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Botones para agregar o eliminar áreas y cargos */}
          <div className="form-group" style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <span
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  areasCargos: [...prev.areasCargos, { id_area: null, cargos: [] }],
                }));
                markAsModified('areasCargos');
              }}
              className="icon-button add-icon"
              title="Agregar Área y Cargo"
            >
              ➕
            </span>
            <span
              onClick={() => {
                if (formData.areasCargos.length > 1) {
                  setFormData((prev) => {
                    const updatedAreasCargos = [...prev.areasCargos];
                    updatedAreasCargos.pop();
                    return { ...prev, areasCargos: updatedAreasCargos };
                  });
                  markAsModified('areasCargos');
                }
              }}
              className="icon-button remove-icon"
              title="Eliminar Área y Cargo"
              style={{ cursor: formData.areasCargos.length === 1 ? 'not-allowed' : 'pointer' }}
            >
              ➖
            </span>
          </div>
        </div>

        <hr />

        {/* Fila dinámica: Facultad y Responsabilidades */}
        <div className="form-row">
          {formData.facultadesResponsabilidades.map((item, index) => (
            <div key={index} className="facultad-responsabilidad-container">
              {/* Campo Facultad */}
              <div className="form-group" style={{ flex: 1, marginRight: '10px' }}>
                <label htmlFor={`facultad-${index}`}><strong>Facultad</strong></label>
                <Select
                  id={`facultad-${index}`}
                  name={`facultad-${index}`}
                  options={options.facultades?.map((facultad) => ({
                    value: facultad.id_facultad,
                    label: facultad.nombre_facultad
                  })) || []}
                  value={
                    item.id_facultad
                      ? {
                          value: item.id_facultad,
                          label: options.facultades?.find(f => f.id_facultad === item.id_facultad)?.nombre_facultad || ''
                        }
                      : null
                  }
                  onChange={(selected) => {
                    handleFacultadResponsabilidadChange(index, 'id_facultad', selected ? selected.value : null);
                    // Resetear responsabilidades cuando cambia la facultad
                    handleFacultadResponsabilidadChange(index, 'responsabilidades', []);
                  }}
                  placeholder="Seleccionar facultad"
                  classNamePrefix="react-select"
                  isClearable
                />
              </div>

              {/* Campo Responsabilidades */}
              {item.id_facultad && (
                <div className="form-group" style={{ flex: 1, marginLeft: '10px' }}>
                  <label htmlFor={`responsabilidades-${index}`}><strong>Responsabilidades</strong></label>
                  <Select
                    id={`responsabilidades-${index}`}
                    name={`responsabilidades-${index}`}
                    isMulti
                    options={options.responsabilidades?.map((resp) => ({
                      value: resp.id_responsabilidad,
                      label: resp.nombre_responsabilidad
                    })) || []}
                    value={item.responsabilidades?.map(id => {
                      const resp = options.responsabilidades?.find(r => r.id_responsabilidad === id);
                      return resp ? { value: resp.id_responsabilidad, label: resp.nombre_responsabilidad } : null;
                    }).filter(Boolean) || []}
                    onChange={(selected) => {
                      handleFacultadResponsabilidadChange(
                        index, 
                        'responsabilidades', 
                        selected ? selected.map(option => option.value) : []
                      );
                    }}
                    placeholder="Seleccionar responsabilidades"
                    classNamePrefix="react-select"
                    closeMenuOnSelect={false}
                  />
                </div>
              )}

              {/* Checkbox: ¿Pertenece a Facultad? */}
              {item.id_facultad && (
                <div className="form-group" style={{ marginTop: '10px' }}>
                  <label>
                    <input
                      type="checkbox"
                      id={`es_plantilla-${index}`}
                      name={`es_plantilla-${index}`}
                      checked={item.es_plantilla || false}
                      onChange={(e) => {
                        handleFacultadResponsabilidadChange(index, 'es_plantilla', e.target.checked);
                      }}
                    />
                    <strong> ¿Pertenece a Facultad?</strong>
                  </label>
                </div>
              )}
            </div>
          ))}

          {/* Botones para agregar o eliminar pares de inputs */}
          <div className="form-group" style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <span
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  facultadesResponsabilidades: [
                    ...prev.facultadesResponsabilidades,
                    { id_facultad: null, responsabilidades: [], es_plantilla: false }
                  ],
                }));
                markAsModified('facultadesResponsabilidades');
              }}
              className="icon-button add-icon"
              title="Agregar Facultad y Responsabilidades"
            >
              ➕
            </span>
            <span
              onClick={() => {
                if (formData.facultadesResponsabilidades.length > 1) {
                  setFormData((prev) => {
                    const updatedFacultadesResponsabilidades = [...prev.facultadesResponsabilidades];
                    updatedFacultadesResponsabilidades.pop();
                    return { ...prev, facultadesResponsabilidades: updatedFacultadesResponsabilidades };
                  });
                  markAsModified('facultadesResponsabilidades');
                }
              }}
              className="icon-button remove-icon"
              title="Eliminar Facultad y Responsabilidades"
              style={{ cursor: formData.facultadesResponsabilidades.length === 1 ? 'not-allowed' : 'pointer' }}
            >
              ➖
            </span>
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

export default EditWorker;

