import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import '../../assets/styles/AddWorker.css';
import { useTheme } from '../Home/ThemeContext';
import * as Yup from 'yup';

const ProgressBar = ({ progress }) => (
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

const AddWorker = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

// Estados
const [formData, setFormData] = useState({
  nombre: '',
  primerApellido: '',
  segundoApellido: '',
  sexo: '',
  cantGrupoConferencia: null,
  cantGrupoClasePractica: null,
  anioGraduado: null,
  aniosExperiencia: null,
  categoriaCientifica: null,
  categoriaDocente: null,
  areasCargos: [{ id_area: null, cargos: [] }], // Ajustado para incluir id_area y cargos
  facultadesResponsabilidades: [{ id_facultad: null, responsabilidades: [], es_plantilla: false }], // Ajustado para incluir es_plantilla
  asignatura: [], // IDs de asignaturas
  carrera: [], // IDs de carreras
  anioAcademico: [], // IDs de años académicos
  cursoImparte: [], // IDs de tipos de cursos
});

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState({});
  const [errors, setErrors] = useState({});

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
    setProgress(0);

    try {
      const [
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

  // Manejo de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre es obligatorio'),
    primerApellido: Yup.string().required('El primer apellido es obligatorio'),
    segundoApellido: Yup.string().required('El segundo apellido es obligatorio'),
    categoriaCientifica: Yup.string().required('La categoría científica es obligatoria'),
  });

  const validateForm = () => {
    try {
      validationSchema.validateSync(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSelectChange = (name, selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFormData((prev) => ({ ...prev, [name]: values }));
  };

  // Cancelar cambios
  const handleCancel = () => {
    Swal.fire({
      title: '¿Cancelar cambios?',
      text: '¿Estás seguro que deseas salir sin guardar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'No, quedarme',
    }).then((result) => {
      if (result.isConfirmed) navigate('/control');
    });
  };

        // Enviar formulario
        const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const data = {
          nombre: formData.nombre,
          primer_apellido: formData.primerApellido,
          segundo_apellido: formData.segundoApellido,
          sexo: formData.sexo,
          cantidad_grupo_c: formData.cantGrupoConferencia ? parseInt(formData.cantGrupoConferencia, 10) : undefined,
          cantidad_grupo_cp: formData.cantGrupoClasePractica ? parseInt(formData.cantGrupoClasePractica, 10) : undefined,
          anno_graduado: formData.anioGraduado ? parseInt(formData.anioGraduado, 10) : undefined,
          annos_experiencia: formData.aniosExperiencia ? parseInt(formData.aniosExperiencia, 10) : undefined,
          categoria_cientifica: formData.categoriaCientifica || undefined,
          categoria_docente: formData.categoriaDocente || undefined,
          areas: formData.areasCargos.map((item) => ({
            id_area: item.id_area,
            cargos: item.cargos.length > 0 ? item.cargos : undefined,
          })),
          facultades: formData.facultadesResponsabilidades.map((item) => ({
            id_facultad: item.id_facultad,
            responsabilidades: item.responsabilidades.length > 0 ? item.responsabilidades : undefined,
            es_plantilla: item.es_plantilla || false,
          })),
          asignaturas: formData.asignatura.map((id) => ({ id_asignatura: id })),
          carreras: formData.carrera.map((id) => ({ id_carrera: id })),
          annos_academicos: formData.anioAcademico.map((id) => ({ id_anno_academico: id })),
          tipos_cursos: formData.cursoImparte.map((id) => ({ id_tipo_curso: id })),
        };

        try {
          const response = await fetch('http://10.10.1.1:8000/api/v2/insertTrabajador/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Trabajador agregado correctamente',
              icon: 'success',
            });
            navigate('/control');
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al guardar');
          }
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: error.message || 'Ocurrió un error al guardar los datos',
            icon: 'error',
          });
        }
      };
  const generateOptions = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => ({
      value: start + i,
      label: start + i,
    }));
  };
  // Generar opciones para los select 
  
  const generateYearOptions = useMemo(() => generateOptions(1950, new Date().getFullYear()), []);
  const generateNumberOptions = useMemo(() => generateOptions(0, 10), []);
  const generateExperienceOptions = useMemo(() => generateOptions(0, 100), []);

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
          <label htmlFor="sexo"><strong>Sexo</strong></label>
          <select
              id="sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleInputChange}
              required
              aria-label="Seleccionar sexo"
            >
              <option value="">Seleccionar</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
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
                label: curso.nombre_tipo_curso,
              }))}
              value={formData.cursoImparte.map((id_tipo_curso) => ({
                value: id_tipo_curso,
                label: options.cursos.find((curso) => curso.id_tipo_curso === id_tipo_curso)?.nombre_tipo_curso || '',
              }))}
              onChange={(selectedOptions) => handleSelectChange('cursoImparte', selectedOptions)}
              placeholder="Seleccionar"
              classNamePrefix="react-select"
            />
          {errors.cursoImparte && (
            <div className="error-message"><strong>Por favor, selecciona al menos un curso.</strong></div>
          )}
        </div>

         <div className="form-group">
            <label htmlFor="categoriaDocente"><strong>Categoría Docente</strong></label>
            <Select
              id="categoriaDocente"
              name="categoriaDocente"
              isMulti
              options={options.categoriasDocente?.map((categoria) => ({
                value: categoria.id_categoria_docente,
                label: categoria.nombre_categoria_docente,
              })) || []}
              value={formData.categoriaDocente?.map(id_categoria_docente => {
                const categoria = options.categoriasDocente?.find(c => c.id_categoria_docente === id_categoria_docente);
                return categoria ? { 
                  value: categoria.id_categoria_docente, 
                  label: categoria.nombre_categoria_docente 
                } : null;
              }).filter(Boolean) || []}
              onChange={(selected) => {
                const selectedCategories = selected ? 
                  selected.map(option => option.value) : [];
                setFormData(prev => ({
                  ...prev,
                  categoriaDocente: selectedCategories
                }));
              }}
              placeholder="Seleccionar una o más categorías"
              classNamePrefix="react-select"
              closeMenuOnSelect={false}
              isClearable
              noOptionsMessage={() => "No hay categorías disponibles"}
            />
            {errors.categoriaDocente && (
              <div className="error-message">
                <strong>Por favor, selecciona al menos una categoría docente.</strong>
              </div>
            )}
          </div>

       <div className="form-group">
          <label htmlFor="anioAcademico"><strong>Año Académico</strong></label>
          <Select
            id="anioAcademico"
            name="anioAcademico"
            isMulti
            options={options.aniosAcademicos?.map((anio) => ({
              value: anio.id_anno_academico,
              label: anio.nombre_anno_academico,
            })) || []}
            value={formData.anioAcademico?.map(id_anno_academico => {
              const anio = options.aniosAcademicos?.find(a => a.id_anno_academico === id_anno_academico);
              return anio ? { value: anio.id_anno_academico, label: anio.nombre_anno_academico } : null;
            }).filter(Boolean) || []}
            onChange={(selected) => {
              const selectedYears = selected ? selected.map(option => option.value) : [];
              setFormData(prev => ({
                ...prev,
                anioAcademico: selectedYears
              }));
            }}
            placeholder="Seleccionar uno o más años"
            classNamePrefix="react-select"
            closeMenuOnSelect={false}
            isClearable
          />
          {errors.anioAcademico && (
            <div className="error-message">
              <strong>Por favor, selecciona al menos un año académico.</strong>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="carrera"><strong>Carrera</strong></label>
          <Select
            id="carrera"
            name="carrera"
            isMulti
            options={options.carreras?.map((carrera) => ({
              value: carrera.id_carrera,
              label: carrera.nombre_carrera,
            })) || []}
            value={formData.carrera?.map(id_carrera => {
              const carrera = options.carreras?.find(c => c.id_carrera === id_carrera);
              return carrera ? { value: carrera.id, label: carrera.nombre_carrera } : null;
            }).filter(Boolean) || []}
            onChange={(selected) => {
              const newSelectedCarreras = selected ? selected.map(option => option.value) : [];
              setFormData(prev => ({
                ...prev,
                carrera: newSelectedCarreras
              }));
            }}
            placeholder="Seleccionar una o más carreras"
            classNamePrefix="react-select"
            closeMenuOnSelect={false}
            isClearable
          />
          {errors.carrera && (
            <div className="error-message">
              <strong>Por favor, selecciona al menos una carrera.</strong>
            </div>
          )}
        </div>
      </div>

      {/* ========================= */}
      {/* Fila 4: Área y asignatura */}
      {/* ========================= */}
      <div className="form-row">
       <div className="form-group">
          <label htmlFor="categoriaCientifica"><strong>Categoría Científica</strong></label>
          <Select
            id="categoriaCientifica"
            name="categoriaCientifica"
            options={options.categoriasCientificas?.map((categoria) => ({
              value: categoria.id_categoria_cientifica,
              label: categoria.nombre_categoria_cientifica,
            })) || []}
            value={
              formData.categoriaCientifica
                ? {
                    value: formData.categoriaCientifica,
                    label: options.categoriasCientificas?.find(
                      (categoria) => categoria.id_categoria_cientifica === formData.categoriaCientifica
                    )?.nombre_categoria_cientifica || '',
                  }
                : null
            }
            onChange={(selected) => {
              setFormData((prev) => ({
                ...prev,
                categoriaCientifica: selected ? selected.value : '',
              }));
            }}
            placeholder="Seleccionar una categoría científica"
            classNamePrefix="react-select"
            isClearable
          />
          {errors.categoriaCientifica && (
            <div className="error-message">
              <strong>Por favor, selecciona una categoría científica.</strong>
            </div>
          )}
        </div>

          <div className="form-group">
              <label htmlFor="asignatura"><strong>Asignatura</strong></label>
              <Select
                id="asignatura"
                name="asignatura"
                isMulti
                options={options.asignaturas?.map((asignatura) => ({
                  value: asignatura.id_asignatura,
                  label: asignatura.nombre_asignatura,
                  key: asignatura.id, // Aunque no es necesario para react-select, no causa problemas
                })) || []}
                value={formData.asignatura?.map((id_asignatura) => {
                  const asignatura = options.asignaturas?.find((a) => a.id_asignatura === id_asignatura);
                  return asignatura
                    ? { value: asignatura.id_asignatura, label: asignatura.nombre_asignatura }
                    : null;
                }).filter(Boolean) || []}
                onChange={(selected) => {
                  const selectedAsignaturas = selected
                    ? selected.map((option) => option.value)
                    : [];
                  setFormData((prev) => ({
                    ...prev,
                    asignatura: selectedAsignaturas,
                  }));
                }}
                placeholder="Seleccionar una o más asignaturas"
                classNamePrefix="react-select"
              />
              {errors.asignatura && (
                <div className="error-message">
                  <strong>Por favor, selecciona al menos una asignatura.</strong>
                </div>
              )}
            </div>
          </div><hr />
 
         
            <div className="form-row">
              {formData.areasCargos.map((item, index) => (
                <div key={index} className="area-cargo-container">
                  {/* Campo Área */}
                  <div className="form-group" style={{ flex: 1, marginRight: '10px' }}>
                    <label htmlFor={`area-${index}`}><strong>Área</strong></label>
                    <Select
                      id={`area-${index}`}
                      name={`area-${index}`}
                      isMulti
                      options={options.areas?.map((area) => ({
                        value: area.id_area,
                        label: area.nombre_area,
                      })) || []}
                      value={item.area?.map((id_area) => {
                        const area = options.areas?.find((a) => a.id_area === id_area);
                        return area ? { value: area.id_area, label: area.nombre_area } : null;
                      }).filter(Boolean)} // Asegúrate de filtrar valores nulos
                      onChange={(selected) => {
                        const newSelectedAreas = selected ? selected.map((option) => option.value) : [];
                        setFormData((prev) => {
                          const updatedAreasCargos = [...prev.areasCargos];
                          updatedAreasCargos[index].area = newSelectedAreas;
                          return { ...prev, areasCargos: updatedAreasCargos };
                        });
                      }}
                      placeholder="Seleccionar áreas"
                      classNamePrefix="react-select"
                      closeMenuOnSelect={false}
                      isClearable
                    />
                    {errors.area && (
                      <div className="error-message">
                        <strong>Por favor, selecciona al menos un área.</strong>
                      </div>
                    )}
                  </div>

                  {/* Campo Cargo */}
                 <div className="form-group" style={{ flex: 1, marginLeft: '10px' }}>
                    <label htmlFor={`cargo-${index}`}><strong>Cargo</strong></label>
                    {options.cargos && options.cargos.length > 0 ? (
                      <Select
                        id={`cargo-${index}`}
                        name={`cargo-${index}`}
                        isMulti
                        options={options.cargos?.map((cargo) => ({
                          value: cargo.id_cargo,
                          label: cargo.nombre_cargo,
                        })) || []}
                        value={item.cargos?.map((id_cargo) => {
                          const cargo = options.cargos?.find((c) => c.id_cargo === id_cargo);
                          return cargo ? { value: cargo.id_cargo, label: cargo.nombre_cargo } : null;
                        }).filter(Boolean)} // Asegúrate de filtrar valores nulos
                        onChange={(selectedOptions) => {
                          const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                          setFormData((prev) => {
                            const updatedAreasCargos = [...prev.areasCargos];
                            updatedAreasCargos[index].cargos = selectedValues;
                            return { ...prev, areasCargos: updatedAreasCargos };
                          });
                        }}
                        placeholder="Seleccionar cargos"
                        classNamePrefix="react-select"
                        closeMenuOnSelect={false}
                        isClearable
                      />
                    ) : (
                      <div>No hay opciones disponibles</div>
                    )}
                    {errors.cargo && (
                      <div className="error-message">
                        <strong>Por favor, selecciona al menos un cargo.</strong>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Botones para agregar o eliminar pares de inputs */}
              <div className="form-group" style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <span
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      areasCargos: [...prev.areasCargos, { area: [], cargo: [] }],
                    }));
                  }}
                  className="icon-button add-icon"
                  title="Agregar Área y Cargo"
                >
                  ➕
                </span>
                <span
                  onClick={() => {
                    setFormData((prev) => {
                      const updatedAreasCargos = [...prev.areasCargos];
                      updatedAreasCargos.pop();
                      return { ...prev, areasCargos: updatedAreasCargos };
                    });
                  }}
                  className="icon-button remove-icon"
                  title="Eliminar Área y Cargo"
                  style={{ cursor: formData.areasCargos.length === 1 ? 'not-allowed' : 'pointer' }}
                >
                  ➖
                </span>
              </div>
            </div><br /><hr />

           {/* Fila dinámica: Facultad y Responsabilidades */}
          <div className="form-row">
            {formData.facultadesResponsabilidades?.map((item, index) => (
              <div key={index} className="facultad-responsabilidad-container">
                {/* Campo Facultad */}
                <div className="form-group" style={{ flex: 1, marginRight: '10px' }}>
                  <label htmlFor={`facultad-${index}`}><strong>Facultad</strong></label>
                  <Select
                    id={`facultad-${index}`}
                    name={`facultad-${index}`}
                    options={options.facultades?.map((facultad) => ({
                      value: facultad.id_facultad,
                      label: facultad.nombre_facultad,
                    })) || []}
                    value={
                      item.facultad
                        ? {
                            value: item.facultad,
                            label: options.facultades?.find(
                              (facultad) => facultad.id_facultad === item.facultad
                            )?.nombre_facultad || '',
                          }
                        : null
                    }
                    onChange={(selected) => {
                      setFormData((prev) => {
                        const updatedFacultadesResponsabilidades = [...prev.facultadesResponsabilidades];
                        updatedFacultadesResponsabilidades[index].facultad = selected ? selected.value : '';
                        return { ...prev, facultadesResponsabilidades: updatedFacultadesResponsabilidades };
                      });
                    }}
                    placeholder="Seleccionar una facultad"
                    classNamePrefix="react-select"
                    isClearable
                  />
                  {errors.facultad && (
                    <div className="error-message">
                      <strong>Por favor, selecciona una facultad.</strong>
                    </div>
                  )}
                </div>

                {/* Campo Responsabilidades */}
                <div className="form-group" style={{ flex: 1, marginLeft: '10px' }}>
                  <label htmlFor={`responsabilidades-${index}`}><strong>Responsabilidades</strong></label>
                  <Select
                    id={`responsabilidades-${index}`}
                    name={`responsabilidades-${index}`}
                    isMulti
                    options={options.responsabilidades?.map((responsabilidad) => ({
                      value: responsabilidad.id_responsabilidad,
                      label: responsabilidad.nombre_responsabilidad,
                    })) || []}
                    value={item.responsabilidades?.map((id_responsabilidad) => {
                      const responsabilidad = options.responsabilidades?.find(
                        (r) => r.id_responsabilidad === id_responsabilidad
                      );
                      return responsabilidad
                        ? { value: responsabilidad.id_responsabilidad, label: responsabilidad.nombre_responsabilidad }
                        : null;
                    }).filter(Boolean)} // Asegúrate de filtrar valores nulos
                    onChange={(selectedOptions) => {
                      const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                      setFormData((prev) => {
                        const updatedFacultadesResponsabilidades = [...prev.facultadesResponsabilidades];
                        updatedFacultadesResponsabilidades[index].responsabilidades = selectedValues;
                        return { ...prev, facultadesResponsabilidades: updatedFacultadesResponsabilidades };
                      });
                    }}
                    placeholder="Seleccionar responsabilidades"
                    classNamePrefix="react-select"
                    closeMenuOnSelect={false}
                    isClearable
                  />
                  {errors.responsabilidades && (
                    <div className="error-message">
                      <strong>Por favor, selecciona al menos una responsabilidad.</strong>
                    </div>
                  )}
                </div>

                {/* Checkbox: ¿Pertenece a Facultad? */}
                <div className="form-group" style={{ marginTop: '10px' }}>
                  <label>
                    <input
                      type="checkbox"
                      id={`perteneceFacultad-${index}`}
                      name={`perteneceFacultad-${index}`}
                      checked={item.perteneceFacultad || false}
                      onChange={(e) => {
                        setFormData((prev) => {
                          const updatedFacultadesResponsabilidades = [...prev.facultadesResponsabilidades];
                          updatedFacultadesResponsabilidades[index].perteneceFacultad = e.target.checked;
                          return { ...prev, facultadesResponsabilidades: updatedFacultadesResponsabilidades };
                        });
                      }}
                    />
                    <strong> ¿Pertenece a Facultad?</strong>
                  </label>
                </div>
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
                      { facultad: '', responsabilidades: [], perteneceFacultad: false },
                    ],
                  }));
                }}
                className="icon-button add-icon"
                title="Agregar Facultad y Responsabilidades"
              >
                ➕
              </span>
              <span
                onClick={() => {
                  setFormData((prev) => {
                    const updatedFacultadesResponsabilidades = [...prev.facultadesResponsabilidades];
                    updatedFacultadesResponsabilidades.pop();
                    return { ...prev, facultadesResponsabilidades: updatedFacultadesResponsabilidades };
                  });
                }}
                className="icon-button remove-icon"
                title="Eliminar Facultad y Responsabilidades"
                style={{ cursor: formData.facultadesResponsabilidades.length === 1 ? 'not-allowed' : 'pointer' }}
              >
                ➖
              </span>
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