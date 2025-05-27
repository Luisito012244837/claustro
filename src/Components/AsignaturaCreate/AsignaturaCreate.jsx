import React, { useState, useEffect, useCallback } from 'react';
import '../../assets/styles/AsignaturaCreate.css';
import Swal from 'sweetalert2';

const AsignaturaCreate = () => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    id_asignatura: '',
    id_anno_academico: '',
    id_tipo_curso: '',
    id_carrera: '',
    id_periodo: ''
  });

  // Estados para las opciones
  const [options, setOptions] = useState({
    asignaturas: [],
    aniosAcademicos: [],
    cursos: [],
    carreras: [],
    periodos: []
  });

  // Estados para mensajes y carga
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Función para cargar datos de la API
  const fetchData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al cargar datos de ${url}`);
    }
    return await response.json();
  };

  // Función auxiliar para extraer datos de cualquier estructura de respuesta
  const extractData = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (response.results) return response.results;
    if (response.data) return response.data;
    if (response.items) return response.items;
    
    // Si la respuesta es un objeto con propiedades que podrían ser los datos
    const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
    if (possibleArrays.length > 0) return possibleArrays[0];
    
    return [];
  };

  // Cargar opciones desde las APIs
  const loadOptions = useCallback(async () => {
    setLoading(true);
    setProgress(0);
    try {
      const cursosResponse = await fetchData('http://10.10.1.1:8000/api/v2/tipo-curso/');
      setProgress(20);
      
      const aniosResponse = await fetchData('http://10.10.1.1:8000/api/v2/anno-academico/');
      setProgress(40);
      
      const carrerasResponse = await fetchData('http://10.10.1.1:8000/api/v2/carrera/');
      setProgress(60);
      
      const asignaturasResponse = await fetchData('http://10.10.1.1:8000/api/v2/asignatura/');
      setProgress(80);
      
      const periodosResponse = await fetchData('http://10.10.1.1:8000/api/v2/periodo/');
      setProgress(100);

      const cursos = extractData(cursosResponse);
      const aniosAcademicos = extractData(aniosResponse);
      const carreras = extractData(carrerasResponse);
      const asignaturas = extractData(asignaturasResponse);
      const periodos = extractData(periodosResponse);

      setOptions({
        asignaturas,
        aniosAcademicos,
        cursos,
        carreras,
        periodos
      });
    } catch (error) {
      console.error('Error loading options:', error);
      setError('Error cargando datos necesarios');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al cargar los datos. Por favor, recarga la página.',
        customClass: {
          popup: 'small-swal-popup',
          title: 'small-swal-title',
          content: 'small-swal-content',
        },
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que se hayan seleccionado todas las opciones
    for (const key in formData) {
      if (formData[key] === '') {
        setError(`Debe seleccionar un valor para ${key.replace('_', ' ')}`);
        return;
      }
    }

    try {
      const response = await fetch('http://10.10.1.1:8000/api/v2/CreatePlanAsignatura/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al asignar la asignatura');
      }

      setMensaje('Asignatura asignada exitosamente');
      setFormData({
        id_asignatura: '',
        id_anno_academico: '',
        id_tipo_curso: '',
        id_carrera: '',
        id_periodo: ''
      });
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Hubo un error al asignar la asignatura');
      setMensaje('');
    }
  };

  if (loading) {
    return (
      <div className="asignatura-create-container">
        <h1>Asignar Asignatura </h1>
        <div className="loading-container">
          <p>Cargando opciones... {progress}%</p>
          <progress value={progress} max="100"></progress>
        </div>
      </div>
    );
  }

  return (
    <div className="asignatura-create-container">
      <h1>Asignar Asignatura al Periodo</h1>
      <div className="form-scroll-container">
        <form onSubmit={handleSubmit} className="asignatura-form">
          <div className="form-group">
            <label htmlFor="id_asignatura">Asignatura</label>
            <select
              id="id_asignatura"
              name="id_asignatura"
              value={formData.id_asignatura}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una asignatura</option>
              {options.asignaturas && options.asignaturas.length > 0 ? (
                options.asignaturas.map(asignatura => (
                  <option key={asignatura.id} value={asignatura.id}>
                    {asignatura.nombre_asignatura || `Asignatura ${asignatura.id}`}
                  </option>
                ))
              ) : (
                <option value="">No hay asignaturas disponibles</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="id_anno_academico">Año Académico</label>
            <select
              id="id_anno_academico"
              name="id_anno_academico"
              value={formData.id_anno_academico}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un año académico</option>
              {options.aniosAcademicos && options.aniosAcademicos.length > 0 ? (
                options.aniosAcademicos.map(anno => (
                  <option key={anno.id} value={anno.id}>
                    {anno.nombre_anno_academico || `Año ${anno.id}`}
                  </option>
                ))
              ) : (
                <option value="">No hay años académicos disponibles</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="id_tipo_curso">Tipo de Curso</label>
            <select
              id="id_tipo_curso"
              name="id_tipo_curso"
              value={formData.id_tipo_curso}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un tipo de curso</option>
              {options.cursos && options.cursos.length > 0 ? (
                options.cursos.map(curso => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nombre_tipo_curso || `Curso ${curso.id}`}
                  </option>
                ))
              ) : (
                <option value="">No hay cursos disponibles</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="id_carrera">Carrera</label>
            <select
              id="id_carrera"
              name="id_carrera"
              value={formData.id_carrera}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una carrera</option>
              {options.carreras && options.carreras.length > 0 ? (
                options.carreras.map(carrera => (
                  <option key={carrera.id} value={carrera.id}>
                    {carrera.nombre_carrera || `Carrera ${carrera.id}`}
                  </option>
                ))
              ) : (
                <option value="">No hay carreras disponibles</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="id_periodo">Periodo</label>
            <select
              id="id_periodo"
              name="id_periodo"
              value={formData.id_periodo}
              onChange={handleChange}
              required
            >
                            <option value="">Seleccione un periodo</option>
              {options.periodos && options.periodos.length > 0 ? (
                options.periodos.map(periodo => (
                  <option key={periodo.id} value={periodo.id}>
                    {periodo.nombre_periodo || `Periodo ${periodo.id}`}
                  </option>
                ))
              ) : (
                <option value="">No hay periodos disponibles</option>
              )}
            </select>
          </div>
          
          {error && <p className="error-message">{error}</p>}
          {mensaje && <p className="mensaje">{mensaje}</p>}
          
          <button type="submit" className="btn-submit" disabled={loading}>
            Asignar Asignatura
          </button>
        </form>
      </div>
    </div>
  );
};

export default AsignaturaCreate;

