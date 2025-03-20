import React, { useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa'; // Importa íconos de lupa y más
import { useNavigate } from 'react-router-dom'; // Para redireccionar
import '../../assets/styles/Control.css'; // Ruta corregida

const Control = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const [error, setError] = useState(''); // Estado para mensajes de error
  const navigate = useNavigate(); // Hook para redireccionar

  // Datos de ejemplo (simulando una API)
  const workers = [
    {
      nombre: 'Juan',
      primerApellido: 'Pérez',
      segundoApellido: 'Gómez',
      cantidadConferencia: 5,
      cantidadClasePractica: 3,
    },
    {
      nombre: 'María',
      primerApellido: 'López',
      segundoApellido: 'Martínez',
      cantidadConferencia: 2,
      cantidadClasePractica: 4,
    },
    {
      nombre: 'Carlos',
      primerApellido: 'García',
      segundoApellido: 'Fernández',
      cantidadConferencia: 7,
      cantidadClasePractica: 1,
    },
  ];

  // Filtrar trabajadores según el término de búsqueda
  const filteredWorkers = workers.filter(
    (worker) =>
      worker.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.primerApellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.segundoApellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Validar el término de búsqueda
  const handleSearch = (e) => {
    const value = e.target.value;
    if (value.length > 30) {
      setError('El término de búsqueda no puede tener más de 30 caracteres.');
    } else {
      setError('');
      setSearchTerm(value);
    }
  };

  // Redirigir al componente AddWorker
  const handleAddWorker = () => {
    navigate('/add-worker'); // Redirige a la ruta /add-worker
  };

  return (
    <div className="control-container">
      <h2>Control de trabajadores</h2>

      {/* Contenedor de búsqueda y botón */}
      <div className="header-control">
        <div className="search-container">
          <FaSearch className="search-icon" /> {/* Ícono de lupa */}
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
          <FaPlus className="add-icon" /> {/* Ícono de más */}
        </button>
      </div>

      {/* Tabla de trabajadores */}
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
                <button className="options-button">Editar</button>
                <button className="options-button">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Control;