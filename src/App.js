import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './Components/Welcome/Welcome';
import SideBar from './Components/Home/SideBar';
import NavBar from './Components/Home/NavBar';
import Control from './Components/Control/Control'; // Importa el componente Control
import AddWorker from './Components/Control/AddWorker'; // Importa el componente AddWorker
import './assets/styles/Home.css'; // Ruta corregida
import './assets/styles/Authentication.css'; // Estilos de autenticación
import Login from './Components/Authentication/Login'; // Importa el componente Login

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal con NavBar y SideBar */}
        <Route
          path="/*"
          element={
            <div style={{ display: 'flex' }}>
              <SideBar />
              <div style={{ flex: 1 }}>
                <NavBar />
                <Routes>
                <Route path="/" element={<Welcome />} />
            <Route path="/control" element={<Control />} /> {/* Ruta para Control */}
            <Route path="/add-worker" element={<AddWorker />} /> {/* Ruta para AddWorker */}
            <Route path="/gestion" element={<div>Gestión</div>} />
                </Routes>
              </div>
            </div>
          }
        />

        {/* Ruta para el Login (página independiente) */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;