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
      area: 'Mathematics',
      asignatura: 'Algebra',
    },
    {
      nombre: 'María',
      primerApellido: 'López',
      segundoApellido: 'Martínez',
      cantidadConferencia: 2,
      cantidadClasePractica: 4,
      area: 'Physics',
      asignatura: 'Mechanics',
    },
    {
      nombre: 'Carlos',
      primerApellido: 'García',
      segundoApellido: 'Fernández',
      cantidadConferencia: 7,
      cantidadClasePractica: 1,
      area: 'Chemistry',
      asignatura: 'Organic Chemistry',
    },
    {
      nombre: 'Ana',
      primerApellido: 'Rodríguez',
      segundoApellido: 'Sánchez',
      cantidadConferencia: 3,
      cantidadClasePractica: 6,
      area: 'Biology',
      asignatura: 'Genetics',
    },
    {
      nombre: 'Luis',
      primerApellido: 'Martínez',
      segundoApellido: 'González',
      cantidadConferencia: 4,
      cantidadClasePractica: 2,
      area: 'Computer Science',
      asignatura: 'Programming',
    },
    {
      nombre: 'Laura',
      primerApellido: 'Hernández',
      segundoApellido: 'Díaz',
      cantidadConferencia: 6,
      cantidadClasePractica: 3,
      area: 'Mathematics',
      asignatura: 'Calculus',
    },
    {
      nombre: 'Pedro',
      primerApellido: 'Gómez',
      segundoApellido: 'Fernández',
      cantidadConferencia: 2,
      cantidadClasePractica: 5,
      area: 'Physics',
      asignatura: 'Thermodynamics',
    },
    {
      nombre: 'Sofía',
      primerApellido: 'Díaz',
      segundoApellido: 'López',
      cantidadConferencia: 8,
      cantidadClasePractica: 1,
      area: 'Chemistry',
      asignatura: 'Inorganic Chemistry',
    },
    {
      nombre: 'Miguel',
      primerApellido: 'Sánchez',
      segundoApellido: 'Martínez',
      cantidadConferencia: 3,
      cantidadClasePractica: 4,
      area: 'Biology',
      asignatura: 'Microbiology',
    },
    {
      nombre: 'Elena',
      primerApellido: 'González',
      segundoApellido: 'Rodríguez',
      cantidadConferencia: 5,
      cantidadClasePractica: 2,
      area: 'Computer Science',
      asignatura: 'Data Structures',
    },
    {
      nombre: 'Jorge',
      primerApellido: 'Fernández',
      segundoApellido: 'Gómez',
      cantidadConferencia: 7,
      cantidadClasePractica: 3,
      area: 'Mathematics',
      asignatura: 'Linear Algebra',
    },
    {
      nombre: 'Carmen',
      primerApellido: 'Martínez',
      segundoApellido: 'Sánchez',
      cantidadConferencia: 4,
      cantidadClasePractica: 6,
      area: 'Physics',
      asignatura: 'Electromagnetism',
    },
    {
      nombre: 'Ricardo',
      primerApellido: 'López',
      segundoApellido: 'González',
      cantidadConferencia: 6,
      cantidadClasePractica: 2,
      area: 'Chemistry',
      asignatura: 'Analytical Chemistry',
    },
    {
      nombre: 'Isabel',
      primerApellido: 'Gómez',
      segundoApellido: 'Fernández',
      cantidadConferencia: 3,
      cantidadClasePractica: 5,
      area: 'Biology',
      asignatura: 'Ecology',
    },
    {
      nombre: 'Fernando',
      primerApellido: 'Díaz',
      segundoApellido: 'Martínez',
      cantidadConferencia: 5,
      cantidadClasePractica: 3,
      area: 'Computer Science',
      asignatura: 'Algorithms',
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

      {/* Renderiza el modal si hay un trabajador seleccionado */}
      {selectedWorker && (
        <ViewWorker worker={selectedWorker} onClose={closeModal} />
      )}
    </div>
  );
};

export default Control;