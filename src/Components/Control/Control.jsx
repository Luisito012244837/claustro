import React, { useState } from 'react';
import { FaSearch, FaPlus, FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ViewWorker from './ViewWorker'; // Importa el nuevo componente
import '../../assets/styles/Control.css';

const Control = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null); // Estado para el trabajador seleccionado
  const navigate = useNavigate();

  const workers = [
    {
      nombre: 'Juan',
      primerApellido: 'Pérez',
      segundoApellido: 'Gómez',
      cantidadConferencia: 5,
      cantidadClasePractica: 3,
      area: 'Mathematics', // Agregando área
      asignatura: 'Algebra', // Agregando asignatura
    },
    {
      nombre: 'María',
      primerApellido: 'López',
      segundoApellido: 'Martínez',
      cantidadConferencia: 2,
      cantidadClasePractica: 4,
      area: 'Physics', // Agregando área
      asignatura: 'Mechanics', // Agregando asignatura
    },
    {
      nombre: 'Carlos',
      primerApellido: 'García',
      segundoApellido: 'Fernández',
      cantidadConferencia: 7,
      cantidadClasePractica: 1,
      area: 'Chemistry', // Agregando área
      asignatura: 'Organic Chemistry', // Agregando asignatura
    },
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

  const handleEdit = (worker) => {
    navigate('/edit-worker', { state: { worker } });
  };

  const handleView = (worker) => {
    setSelectedWorker(worker); // Establece el trabajador seleccionado
  };

  const handleDelete = (worker) => {
    console.log('Eliminar:', worker);
  };

  const closeModal = () => {
    setSelectedWorker(null); // Cierra el modal
  };

  return (
    <div className="control-container">
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
        <button className="add-button" onClick={handleAddWorker}>
          <FaPlus className="add-icon" />
        </button>
      </div>

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

      {/* Renderiza el modal si hay un trabajador seleccionado */}
      {selectedWorker && (
        <ViewWorker worker={selectedWorker} onClose={closeModal} />
      )}
    </div>
  );
};

export default Control;
