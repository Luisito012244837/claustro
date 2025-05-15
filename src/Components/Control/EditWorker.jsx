import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Select from 'react-select';
import '../../assets/styles/EditWorker.css';

const EditWorker = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const worker = location.state?.worker;
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
  categoriaCientifica: '',
  categoriaDocente: [], // Asegúrate de que sea un array
  areas: [],
  facultades: [],
  asignaturas: [],
  carreras: [],
  anioAcademico: [],
  tiposCursos: [],
  areasCargos: [{ area: [], cargos: [] }],
  facultadesResponsabilidades: [{ facultad: '', responsabilidades: [], perteneceFacultad: false }],
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
      setFormData({
        nombre: worker.nombre || '',
        primerApellido: worker.primer_apellido || '',
        segundoApellido: worker.segundo_apellido || '',
        sexo: worker.sexo || '',
        cantGrupoConferencia: worker.cantidad_grupo_c || '',
        cantGrupoClasePractica: worker.cantidad_grupo_cp || '',
        anioGraduado: worker.anno_graduado || '',
        aniosExperiencia: worker.annos_experiencia || '',
        categoriaCientifica: worker.categoria_cientifica || '',
        categoriaDocente: worker.categoria_docente || '',
        areas: worker.areas || [],
        facultades: worker.facultades || [],
        asignaturas: worker.asignaturas || [],
        carreras: worker.carreras || [],
        annosAcademicos: worker.annos_academicos || [],
        tiposCursos: worker.tipos_cursos || [],
      });
    }
  }, [worker]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleSelectChange = (field, selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: selectedOptions || [],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!formData.primerApellido.trim()) newErrors.primerApellido = 'El primer apellido es obligatorio.';
    if (!formData.segundoApellido.trim()) newErrors.segundoApellido = 'El segundo apellido es obligatorio.';
    if (!formData.sexo) newErrors.sexo = 'El sexo es obligatorio.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      id_trabajador: worker?.id,
      nombre: formData.nombre.trim(),
      primer_apellido: formData.primerApellido.trim(),
      segundo_apellido: formData.segundoApellido.trim(),
      sexo: formData.sexo,
      cantidad_grupo_c: parseInt(formData.cantGrupoConferencia) || undefined,
      cantidad_grupo_cp: parseInt(formData.cantGrupoClasePractica) || undefined,
      anno_graduado: parseInt(formData.anioGraduado) || undefined,
      annos_experiencia: parseInt(formData.aniosExperiencia) || undefined,
      categoria_cientifica: formData.categoriaCientifica || undefined,
      categoria_docente: formData.categoriaDocente || undefined,
      areas: formData.areas.map((area) => ({
        id_area: area.id_area,
        id_cargo: area.id_cargo || undefined,
      })),
      facultades: formData.facultades.map((facultad) => ({
        id_facultad: facultad.id_facultad,
        id_responsabilidad: facultad.id_responsabilidad || undefined,
        es_plantilla: facultad.es_plantilla || undefined,
      })),
      asignaturas: formData.asignaturas.map((asignatura) => ({
        id_asignatura: asignatura.id_asignatura,
      })),
      carreras: formData.carreras.map((carrera) => ({
        id_carrera: carrera.id_carrera,
      })),
      annos_academicos: formData.annosAcademicos.map((anno) => ({
        id_anno_academico: anno.id_anno_academico,
      })),
      tipos_cursos: formData.tiposCursos.map((curso) => ({
        id_tipo_curso: curso.id_tipo_curso,
      })),
    };

    try {
      setLoading(true);
      const response = await fetch('http://10.10.1.1:8000/api/v2/modifyTrabajador/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await Swal.fire({
          title: '¡Éxito!',
          text: 'Trabajador actualizado correctamente',
          icon: 'success',
        });
        navigate('/control');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el trabajador');
      }
    } catch (error) {
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

  return (
    <div className="add-worker-container">
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
              options={options.cursos?.map((curso) => (
                <option key={curso.id_tipo_curso} value={curso.id_tipo_curso}>
                  {curso.nombre_tipo_curso}
                </option>
              ))}
              value={formData.cursoImparte?.map((id_tipo_curso) => ({
                value: id_tipo_curso,
                label: options.cursos?.find((curso) => curso.id_tipo_curso === id_tipo_curso)?.nombre_tipo_curso || '',
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
             value={formData.categoriaDocente?.map((id_categoria_docente) => {
              const categoria = options.categoriasDocente?.find(
                (c) => c.id_categoria_docente === id_categoria_docente
              );
              return categoria
                ? { value: categoria.id_categoria_docente, label: categoria.nombre_categoria_docente }
                : null;
            }).filter(Boolean) || []}

              onChange={(selected) => {
                const selectedCategories = selected ? selected.map((option) => option.value) : [];
                setFormData((prev) => ({
                  ...prev,
                  categoriaDocente: selectedCategories,
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
            value={formData.carreras?.map((id_carrera) => {
              const carrera = options.carreras?.find((c) => c.id_carrera === id_carrera);
              return carrera ? { value: carrera.id_carrera, label: carrera.nombre_carrera } : null;
            }).filter(Boolean) || []}
            onChange={(selected) => {
              const newSelectedCarreras = selected ? selected.map((option) => option.value) : [];
              setFormData((prev) => ({
                ...prev,
                carreras: newSelectedCarreras,
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
                value={formData.asignaturas?.map((id_asignatura) => {
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
                    }).filter(Boolean) || []}// Asegúrate de filtrar valores nulos
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
  );
};

export default EditWorker;