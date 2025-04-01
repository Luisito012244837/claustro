import React, { useState } from 'react';
import { FaSearch, FaPlus, FaEdit, FaEye, FaTrash, FaFileExcel } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import ViewWorker from './ViewWorker';
import '../../assets/styles/Control.css';
import { useTheme } from '../Home/ThemeContext';

const Control = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const workers = [
    {
      nombre: 'Juan',
      primerApellido: 'Pérez',
      segundoApellido: 'Gómez',
      cantidadConferencia: 5,
      cantidadClasePractica: 3,
      area: 'Mathematics',
      asignatura: 'Algebra',
    },
    // Agrega más trabajadores según sea necesario
  ];

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.primerApellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.segundoApellido.toLowerCase().includes(searchTerm.toLowerCase())
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
      'Primer Apellido': worker.primerApellido,
      'Segundo Apellido': worker.segundoApellido,
      'Conferencias': worker.cantidadConferencia,
      'Clases Prácticas': worker.cantidadClasePractica,
      'Área': worker.area,
      'Asignatura': worker.asignatura
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

  const handleView = (worker) => {
    setSelectedWorker(worker);
  };

  const handleDelete = (worker) => {
    console.log('Eliminar:', worker);
  };

  const closeModal = () => {
    setSelectedWorker(null);
  };

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
            {filteredWorkers.map((worker, index) => (
              <tr key={index}>
                <td>{worker.nombre}</td>
                <td>{worker.primerApellido}</td>
                <td>{worker.segundoApellido}</td>
                <td>{worker.cantidadConferencia}</td>
                <td>{worker.cantidadClasePractica}</td>
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
            ))}
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