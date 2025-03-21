import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './Components/Welcome/Welcome';
import SideBar from './Components/Home/SideBar';
import NavBar from './Components/Home/NavBar';
import Control from './Components/Control/Control';
import AddWorker from './Components/Control/AddWorker';
import EditWorker from './Components/Control/EditWorker'; // Importa el nuevo componente EditWorker
import Login from './Components/Authentication/Login';
import Register from './Components/Authentication/Register';
import './assets/styles/Home.css';
import './assets/styles/Authentication.css';

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
                  <Route path="/control" element={<Control />} />
                  <Route path="/add-worker" element={<AddWorker />} />
                  <Route path="/edit-worker" element={<EditWorker />} /> {/* Ruta para EditWorker */}
                  <Route path="/gestion" element={<Register />} />
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