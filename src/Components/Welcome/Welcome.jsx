import React, { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import '../../assets/styles/Welcome.css';
import { useTheme } from '../Home/ThemeContext'; // Importa el hook useTheme

const Welcome = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [totalTrabajadores, setTotalTrabajadores] = useState('Error al cargar');
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme(); // Obtiene el estado del tema

  useEffect(() => {
    // Función para obtener el total de trabajadores
    const obtenerTotalTrabajadores = async () => {
      try {
        const response = await fetch('http://10.10.1.1:8000/api/v2/getParameters/');
        if (!response.ok) {
          throw new Error('Error al obtener el total de trabajadores');
        }
        const data = await response.json();
        setTotalTrabajadores(data.total_trabajadores || 'No disponible');
      } catch (error) {
        console.error('Error en la solicitud:', error);
        setTotalTrabajadores('Error al cargar');
      } finally {
        setLoading(false);
      }
    };

    // Configurar el reloj
    const updateTime = () => {
      const now = new Date();
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
      };
      setCurrentTime(now.toLocaleString('es-ES', options));
    };

    // Llamar a las funciones
    updateTime();
    obtenerTotalTrabajadores();
    
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
   <div className={`welcome-container ${darkMode ? 'dark-theme' : ''}`}>
      <h1>Bienvenidos</h1>
      <div className="welcome-message">
        <p>Hola, bienvenido a AKADEMIA, donde podrá consultar los datos de todos los trabajadores, además de ver la información de cada uno.</p>
        <p>Explora las diferentes secciones del menú para comenzar.</p>
      </div>
      
      <div className="stats-container">
        <div className="stat-card">
          <h2>TOTAL DE TRABAJADORES</h2>
          <p className={loading ? 'loading' : ''}>
  {loading ? (
    <div className="spinner">
      <div></div>   
      <div></div>    
      <div></div>    
      <div></div>    
      <div></div>    
      <div></div>    
      <div></div>    
      <div></div>    
      <div></div>    
      <div></div>    
    </div>
  ) : (
    totalTrabajadores
  )}
</p>
        </div>
        <div className="stat-card">
          <h2>CURSOS VIGENTES</h2>
          <p>12</p>
        </div>
        <div className="stat-card">
          <h2>TOTAL DE ESTUDIANTES</h2>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h2>NUEVOS REGISTROS</h2>
          <p>5</p>
        </div>
      </div>
      <div className="clock-container">
        <FaClock className="clock-icon" />
        <span>{currentTime}</span>
      </div>
    </div>
    
  );
};

<script src="https://bots.easy-peasy.ai/chat.min.js" data-chat-url="https://bots.easy-peasy.ai/bot/4206c0d0-1e0f-40ee-a0e6-6350c5420c95" data-btn-position="top-right" data-widget-btn-color="#6366f1 " defer> </script>

export default Welcome;