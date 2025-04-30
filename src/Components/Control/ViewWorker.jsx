import React from 'react';
import '../../assets/styles/ViewWorker.css';
import { useTheme } from '../Home/ThemeContext';

const ViewWorker = ({ worker, onClose }) => {
    const { darkMode } = useTheme();
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
