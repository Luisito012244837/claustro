import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaPlus, FaEdit, FaEye, FaTrash, FaFileExcel } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import ViewWorker from './ViewWorker';
import '../../assets/styles/Control.css';
import { useTheme } from '../Home/ThemeContext';

const Control = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleError = useCallback(
    (message) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        background: darkMode ? '#000000' : '#ffffff', // Fondo negro para modo oscuro, blanco para modo claro
        color: darkMode ? '#ffffff' : '#333333', // Texto blanco para modo oscuro, negro para modo claro
        iconColor: '#04bfc5', // Azul para el ícono
        confirmButtonColor: darkMode ? '#007a5a' : '#00b87a', // Verde oscuro o claro para el botón
      });
    },
    [darkMode] // Dependencia de darkMode
  );

  // Cargar datos de la API al montar el componente
  useEffect(() => {
    const cargarDatosTrabajadores = async () => {
      try {
        const response = await fetch('http://10.10.1.1:8000/apiv2/trabajador/');
        
        if (!response.ok) {
          throw new Error('Error al obtener los datos de la API');
        }

        const data = await response.json();
        setWorkers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        handleError('Hubo un error al cargar los datos. Por favor, intenta nuevamente.');
        setLoading(false);
      }
    };

    cargarDatosTrabajadores();
  }, [handleError]); // Incluye handleError como dependencia

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.primer_apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (worker.segundo_apellido && worker.segundo_apellido.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value.length > 30) {
      setError('El término de búsqueda no puede tener más de 30 caracteres.');
    } else {
      setError('');
      setSearchTerm(value);
    }
  };

  const handleAddWorker = () => {
    navigate('/add-worker');
  };

  const handleDownloadExcel = () => {
    // Preparar los datos para Excel
    const data = filteredWorkers.map(worker => ({
      'Nombre': worker.nombre,
      'Primer Apellido': worker.primer_apellido,
      'Segundo Apellido': worker.segundo_apellido || '',
      'Conferencias': worker.cantidad_grupo_c,
      'Clases Prácticas': worker.cantidad_grupo_cp,
      'Categoría Docente': worker.categorias_docentes?.map(c => c.nombre_categoria_docente).join(', '),
      'Categoría Científica': worker.nombre_categoria_cientifica,
      'Área': worker.areas?.map(a => a.nombre_area).join(', ')
    }));

    // Crear libro de trabajo de Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Añadir hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trabajadores");
    
    // Generar archivo Excel
    XLSX.writeFile(workbook, "trabajadores.xlsx", {
      compression: true
    });
  };

  const handleEdit = (worker) => {
    navigate('/edit-worker', { state: { worker } });
  };

  const handleView = async (worker) => {
    try {
      // Obtener los detalles completos del trabajador
      const response = await fetch(`http://10.10.1.1:8000/apiv2/getTrabajador/${worker.id_trabajador}/`);
      
      if (!response.ok) {
        throw new Error('No se pudo obtener la información del trabajador.');
      }

      const trabajadorCompleto = await response.json();
      
      // Mostrar modal con los detalles
      Swal.fire({
        title: 'Detalles del Trabajador',
        html: `
          <style>
            .custom-modal {
              max-height: 80vh;
              overflow-y: auto;
            }
            .card {
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              margin: 5px 0;
              padding: 10px;
              background-color: #fff;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .card-header {
              border-bottom: 1px solid #e0e0e0;
              margin-bottom: 5px;
            }
            .card-header h3 {
              margin: 0;
              font-size: 1.1em;
              color: #333;
            }
            .card-body p {
              margin: 3px 0;
              color: #555;
            }
          </style>  
          <div class="card">
            <div class="card-header">
              <h3>Información Personal</h3>
            </div>
            <div class="card-body">
              <p><strong>Nombre:</strong> ${trabajadorCompleto.nombre}</p>
              <p><strong>Primer Apellido:</strong> ${trabajadorCompleto.primer_apellido}</p>
              <p><strong>Segundo Apellido:</strong> ${trabajadorCompleto.segundo_apellido || 'No disponible'}</p>
              <p><strong>Sexo:</strong> ${trabajadorCompleto.sexo}</p>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>Categorías y Cursos</h3>
            </div>
            <div class="card-body">
              <p><strong>Categoría docente:</strong> ${trabajadorCompleto.categorias_docentes?.map(c => c.nombre_categoria_docente).join(', ') || 'No disponible'}</p>
              <p><strong>Categoría cientifica:</strong> ${trabajadorCompleto.nombre_categoria_cientifica || 'No disponible'}</p>
              <p><strong>Cursos:</strong> ${trabajadorCompleto.tipos_curso?.map(c => c.nombre_curso).join(', ') || 'No disponible'}</p>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>Carreras y Asignaturas</h3>
            </div>
            <div class="card-body">
              <p><strong>Carreras:</strong> ${trabajadorCompleto.carreras?.map(c => c.nombre_carrera).join(', ') || 'No disponible'}</p>
              <p><strong>Asignaturas:</strong> ${trabajadorCompleto.asignaturas?.map(a => a.nombre_asignatura).join(', ') || 'No disponible'}</p>
              <p><strong>Año de graduado:</strong> ${trabajadorCompleto.ano_graduado || 'No disponible'}</p>
              <p><strong>Años de experiencia:</strong> ${trabajadorCompleto.anos_experiencia || 'No disponible'}</p>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>Cargos y Responsabilidades</h3>
            </div>
            <div class="card-body">
              <p><strong>Cargo:</strong> ${trabajadorCompleto.cargos?.map(c => c.nombre_cargo).join(', ') || 'No disponible'}</p>
              <p><strong>Responsabilidad:</strong> ${trabajadorCompleto.responsabilidades?.map(r => r.nombre_responsabilidad).join(', ') || 'No disponible'}</p>
              <p><strong>Cantidad de grupos C:</strong> ${trabajadorCompleto.cantidad_grupo_c || 'No disponible'}</p>
              <p><strong>Cantidad de grupos CP:</strong> ${trabajadorCompleto.cantidad_grupo_cp || 'No disponible'}</p>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>Áreas y Años Académicos</h3>
            </div>
            <div class="card-body">
              <p><strong>Áreas:</strong> ${trabajadorCompleto.areas?.map(a => a.nombre_area).join(', ') || 'No disponible'}</p>
              <p><strong>Año Académico:</strong> ${trabajadorCompleto.annos_academicos?.map(a => a.anno).join(', ') || 'No disponible'}</p>
            </div>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '500px',
        customClass: {
          popup: 'custom-modal',
          confirmButton: 'custom-confirm-button',
        },
      });
    } catch (error) {
      console.error('Error al obtener detalles del trabajador:', error);
      handleError('No se pudieron cargar los detalles del trabajador.');
    }
  };

  const handleDelete = async (worker) => {
    try {
      const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (confirmacion.isConfirmed) {
        const response = await fetch(`http://10.10.1.1:8000/apiv2/trabajador/${worker.id_trabajador}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'Se ha eliminado un trabajador del sistema.',
          });
          
          // Actualizar la lista de trabajadores
          const updatedWorkers = workers.filter(w => w.id_trabajador !== worker.id_trabajador);
          setWorkers(updatedWorkers);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al eliminar el trabajador');
        }
      }
    } catch (error) {
      console.error('Error al eliminar el trabajador:', error);
      handleError(error.message || 'Hubo un problema al eliminar el trabajador.');
    }
  };

  const closeModal = () => {
    setSelectedWorker(null);
  };

  if (loading) {
    return (
      <div className={`control-container ${darkMode ? 'dark-theme' : ''}`}>
        <h2>Control de trabajadores</h2>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className={`control-container ${darkMode ? 'dark-theme' : ''}`}>
      <h2>Control de trabajadores</h2>

      <div className="header-control">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, primer apellido o segundo apellido"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {error && <p className="error-message">{error}</p>}
        </div>
        
        <div className="action-buttons">
          <button 
            className="download-button" 
            onClick={handleDownloadExcel}
            title="Descargar en Excel"
          >
            <FaFileExcel className="download-icon" />
          </button>
          <button className="add-button" onClick={handleAddWorker}>
            <FaPlus className="add-icon" />
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="workers-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Primer Apellido</th>
              <th>Segundo Apellido</th>
              <th>Cantidad Conferencia</th>
              <th>Cantidad Clase Práctica</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkers.length > 0 ? (
              filteredWorkers.map((worker) => (
                <tr key={worker.id_trabajador}>
                  <td>{worker.nombre}</td>
                  <td>{worker.primer_apellido}</td>
                  <td>{worker.segundo_apellido || '-'}</td>
                  <td>{worker.cantidad_grupo_c}</td>
                  <td>{worker.cantidad_grupo_cp}</td>
                  <td>
                    <div className="options-container">
                      <button className="icon-button" onClick={() => handleEdit(worker)}>
                        <FaEdit className="action-icon" />
                      </button>
                      <button className="icon-button" onClick={() => handleView(worker)}>
                        <FaEye className="action-icon" />
                      </button>
                      <button className="icon-button" onClick={() => handleDelete(worker)}>
                        <FaTrash className="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No se encontraron trabajadores
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedWorker && (
        <ViewWorker worker={selectedWorker} onClose={closeModal} />
      )}
    </div>
  );
};

export default Control;