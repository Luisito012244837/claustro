import React, { useState, useEffect } from 'react';
import '../../assets/styles/ViewWorker.css';
import { useTheme } from '../Home/ThemeContext';

const ViewWorker = ({ idTrabajador, onClose }) => {
    const { darkMode } = useTheme();
    const [worker, setWorker] = useState(null); // Estado para almacenar los datos del trabajador
    const [loading, setLoading] = useState(true); // Estado para manejar la carga
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        const fetchWorker = async () => {
            try {
                const response = await fetch(`http://host:port/api/v2/getTrabajador/${idTrabajador}/`);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del trabajador');
                }
                const data = await response.json();
                setWorker(data); // Almacena los datos del trabajador en el estado
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // Finaliza la carga
            }
        };

        fetchWorker();
    }, [idTrabajador]);

    if (loading) {
        return <div className="modal-overlay"><div className="modal-content">Cargando...</div></div>;
    }

    if (error) {
        return <div className="modal-overlay"><div className="modal-content">Error: {error}</div></div>;
    }

    return (
        <div className="modal-overlay">
            <div className={`modal-content ${darkMode ? 'dark-theme' : ''}`}>
                <h2>Detalles del Trabajador</h2>
                <div className="details-container">
                    <div className="detail-item">
                        <strong>Nombre:</strong> {worker.nombre}
                    </div>
                    <div className="detail-item">
                        <strong>Primer Apellido:</strong> {worker.primerApellido}
                    </div>
                    <div className="detail-item">
                        <strong>Segundo Apellido:</strong> {worker.segundoApellido}
                    </div>
                    <div className="detail-item">
                        <strong>Cantidad de Conferencias:</strong> {worker.cantidadConferencia}
                    </div>
                    <div className="detail-item">
                        <strong>Cantidad de Clases Prácticas:</strong> {worker.cantidadClasePractica}
                    </div>
                    <div className="detail-item">
                        <strong>Área:</strong> {worker.area}
                    </div>
                    <div className="detail-item">
                        <strong>Asignatura:</strong> {worker.asignatura}
                    </div>
                    {/* Agrega aquí más campos si es necesario */}
                </div>
                <button className="close-button" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default ViewWorker;