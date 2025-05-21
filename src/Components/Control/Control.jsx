import React, { useState, useEffect } from 'react';
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

  // Cargar datos de la API al montar el componente
  useEffect(() => {
    const cargarDatosTrabajadores = async () => {
      try {
        const response = await fetch('http://10.10.1.1:8000/api/v2/trabajador/');
        
        if (!response.ok) {
          throw new Error('Error al obtener los datos de la API');
        }

        const data = await response.json();
        setWorkers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al cargar los datos. Por favor, intenta nuevamente.',
          customClass: {
            popup: 'small-swal-popup',
            title: 'small-swal-title',
            content: 'small-swal-content',
          },
        });
        setLoading(false);
      }
    };

    cargarDatosTrabajadores();
  }, []);

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
      const response = await fetch(`http://10.10.1.1:8000/api/v2/getTrabajador/${worker.id_trabajador}/`);
  
      if (!response.ok) {
        throw new Error('No se pudo obtener la información del trabajador.');
      }
  
     Swal.fire({
        title: 'DETALLES DEL TRABAJADOR',
        html: `
          <div class="worker-details-container">
            <div class="worker-header">
              <h3>${worker.nombre} ${worker.primer_apellido} ${worker.segundo_apellido || ''}</h3>
              <div class="worker-id">ID: ${worker.id_trabajador}</div>
            </div>
            
            <div class="worker-sections">
              <div class="worker-section">
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">Género:</span>
                    <span class="detail-value">${worker.sexo}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Año graduado:</span>
                    <span class="detail-value">${worker.anno_graduado}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Experiencia:</span>
                    <span class="detail-value">${worker.annos_experiencia} años</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Científica:</span>
                    <span class="detail-value">${worker.categoria_cientifica}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Docente:</span>
                    <span class="detail-value">${worker.categoria_docente}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Conferencias:</span>
                    <span class="detail-value">${worker.cantidad_grupo_c}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Clases prácticas:</span>
                    <span class="detail-value">${worker.cantidad_grupo_cp}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Facultad:</span>
                    <span class="detail-value">${Array.isArray(worker.facultades) ? worker.facultades.join(', ') : worker.facultades}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Años Académicos:</span>
                    <span class="detail-value">${Array.isArray(worker.annos_academicos) ? worker.annos_academicos.join(', ') : worker.annos_academicos}</span>
                  </div>

                  <div class="detail-item">
                    <span class="detail-label">Carrera:</span>
                    <span class="detail-value">${Array.isArray(worker.carreras) ? worker.carreras.join(', ') : worker.carreras}</span>
                  </div>


                  <div class="detail-item">
                    <span class="detail-label">Asignaturas:</span>
                    <span class="detail-value">${Array.isArray(worker.asignaturas) ? worker.asignaturas.join(', ') : worker.asignaturas}</span>
                  </div>

                   <div class="detail-item full-width">
                    <span class="detail-label">Áreas:</span>
                    <span class="detail-value">
                      ${Array.isArray(worker.areas) 
                        ? worker.areas.map(area => `${area.nombre_area || ''} (${area.cargo || 'Sin cargo'})`)
                            .join(', ')
                        : worker.areas || ''}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        `,
        width: '1000px',
        padding: '2rem',
        backdrop: 'rgba(0,0,0,0.8)',
        showConfirmButton: true,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#2c3e50',
        customClass: {
        container: 'worker-modal-container',
        popup: 'worker-modal-popup',
        title: 'worker-modal-title',
        htmlContainer: 'worker-modal-content',
        confirmButton: 'worker-modal-button'
        },
      });
    } catch (error) {
      console.error('Error al obtener detalles del trabajador:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los detalles del trabajador.',
        customClass: {
          popup: 'small-swal-popup',
          title: 'small-swal-title',
          content: 'small-swal-content',
        },
      });
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
        customClass: {
          popup: 'small-swal-popup',
          title: 'small-swal-title',
          content: 'small-swal-content',
        },
      });

      if (confirmacion.isConfirmed) {
        const response = await fetch(`http://10.10.1.1:8000/api/v2/trabajador/${worker.id_trabajador}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'Se ha eliminado un trabajador del sistema.',
            customClass: {
              popup: 'small-swal-popup',
              title: 'small-swal-title',
              content: 'small-swal-content',
            },
          });
          
          const updatedWorkers = workers.filter(w => w.id_trabajador !== worker.id_trabajador);
          setWorkers(updatedWorkers);
        } else {
          throw new Error('Error al eliminar el trabajador');
        }
      }
    } catch (error) {
      console.error('Error al eliminar el trabajador:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al eliminar el trabajador.',
        customClass: {
          popup: 'small-swal-popup',
          title: 'small-swal-title',
          content: 'small-swal-content',
        },
      });
    }
  };

  if (loading) {
    return (
      <div className={`control-container ${darkMode ? 'dark-theme' : ''}`}>
        <h2>Cargando lista de Profesores</h2>
      </div>
    );
  }

  return (
    <div className={`control-container ${darkMode ? 'dark-theme' : ''}`}>
      <h2>Listado de Profesores</h2>

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
              <th>Facultad</th>
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
                  <td>{worker.facultades}</td>
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
        <ViewWorker worker={selectedWorker} onClose={() => setSelectedWorker(null)} />
      )}
    </div>
  );
};

export default Control;