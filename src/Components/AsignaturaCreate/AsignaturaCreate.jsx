import React, { useState } from 'react';
import '../../assets/styles/AsignaturaCreate.css';

const AsignaturaCreate = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://10.10.1.1:8000/apiv2/asignaturas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, descripcion }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la asignatura');
      }

      setMensaje('Asignatura creada exitosamente');
      setNombre('');
      setDescripcion('');
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Hubo un error al crear la asignatura');
    }
  };

  return (
    <div className="asignatura-create-container">
      <h1>Crear Nueva Asignatura</h1>
      <form onSubmit={handleSubmit} className="asignatura-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre de la Asignatura</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn-submit">
          Crear Asignatura
        </button>
      </form>
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default AsignaturaCreate;