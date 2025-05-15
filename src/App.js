import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './Components/Welcome/Welcome';
import SideBar from './Components/Home/SideBar';
import NavBar from './Components/Home/NavBar';
import Control from './Components/Control/Control';
import AddWorker from './Components/Control/AddWorker';
import EditWorker from './Components/Control/EditWorker';
import AsignaturaCreate from './Components/AsignaturaCreate/AsignaturaCreate';
import Login from './Components/Authentication/Login';
import Register from './Components/Authentication/Register';
import EditPassword from './Components/Authentication/EditPassword';
import Especialistas from './Components/Especialistas/Especialistas';
import './assets/styles/Home.css';
import './assets/styles/Authentication.css';
import { ThemeProvider, useTheme } from './Components/Home/ThemeContext'; // Importa el ThemeProvider y el hook useTheme

// Componente para manejar el atributo data-theme
const ThemeHandler = () => {
  const { darkMode } = useTheme();

  useEffect(() => {
    // Aplica el atributo data-theme al elemento raíz (html)
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return null; // Este componente no renderiza nada
};

function App() {
  return (
    <ThemeProvider> {/* Envuelve toda la aplicación con el ThemeProvider */}
      <ThemeHandler /> {/* Maneja el cambio de tema */}
      <Router>
        <Routes>
          {/* Ruta principal con NavBar y SideBar */}
          <Route
            path="/*"
            element={
              <div style={{ display: 'flex' }}> {/* Mantiene el mismo posicionamiento */}
                <SideBar />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <NavBar />
                  <div className="theme-content"> {/* Nueva clase para el área temática */}
                    <Routes>
                      <Route path="/" element={<Welcome />} />
                      <Route path="/control" element={<Control />} />
                      <Route path="/add-worker" element={<AddWorker />} />
                      <Route path="/edit-worker" element={<EditWorker />} />
                      <Route path="/gestion" element={<Register />} />
                      <Route path="/welcome" element={<Welcome />} />
                      <Route path="/create-asignatura" element={<AsignaturaCreate />} />
                      <Route path="/especialistas" element={<Especialistas />} />

                    </Routes>
                  </div>
                </div>
              </div>
            }
          />

          {/* Rutas independientes para autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/change-password" element={<EditPassword />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;