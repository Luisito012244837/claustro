import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrash, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../../assets/styles/Especialistas.css';

const Especialistas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [especialistas, setEspecialistas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEspecialistas = async () => {
      try {
        const response = await fetch('http://10.10.1.1:8000/api/v2/especialistas/');
        if (!response.ok) throw new Error('Error al obtener los datos de los especialistas');
        const data = await response.json();
        setEspecialistas(data);
      } catch (error) {
        console.error('Error al cargar los especialistas:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al cargar los especialistas.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEspecialistas();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleView = (especialista) => {
    Swal.fire({
      title: 'Detalles del Especialista',
      html: `
        <p><strong>Nombre:</strong> ${especialista.nombre}</p>
        <p><strong>Primer Apellido:</strong> ${especialista.primer_apellido}</p>
        <p><strong>Segundo Apellido:</strong> ${especialista.segundo_apellido || '-'}</p>
      `,
      confirmButtonText: 'Cerrar',
    });
  };

  const handleDelete = async (especialista) => {
    try {
      const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (confirmacion.isConfirmed) {
        const response = await fetch(`http://10.10.1.1:8000/api/v2/especialistas/${especialista.id}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          Swal.fire('Eliminado', 'El especialista ha sido eliminado.', 'success');
          setEspecialistas(especialistas.filter((e) => e.id !== especialista.id));
        } else {
          throw new Error('Error al eliminar el especialista');
        }
      }
    } catch (error) {
      console.error('Error al eliminar el especialista:', error);
      Swal.fire('Error', 'No se pudo eliminar el especialista.', 'error');
    }
  };

  const filteredEspecialistas = especialistas.filter((especialista) =>
    `${especialista.nombre} ${especialista.primer_apellido} ${especialista.segundo_apellido || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Cargando especialistas...</div>;
  }

  return (
    <div className="especialistas-container">
      <h2>Listado de Especialistas</h2>
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por nombre, primer apellido o segundo apellido"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <table className="especialistas-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Primer Apellido</th>
            <th>Segundo Apellido</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredEspecialistas.length > 0 ? (
            filteredEspecialistas.map((especialista) => (
              <tr key={especialista.id}>
                <td>{especialista.nombre}</td>
                <td>{especialista.primer_apellido}</td>
                <td>{especialista.segundo_apellido || '-'}</td>
                <td>
                  <button onClick={() => handleView(especialista)} className="icon-button">
                    <FaEye />
                  </button>
                  <button onClick={() => handleDelete(especialista)} className="icon-button">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No se encontraron especialistas</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Especialistas;