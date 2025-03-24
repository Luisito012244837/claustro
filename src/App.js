import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './Components/Welcome/Welcome';
import SideBar from './Components/Home/SideBar';
import NavBar from './Components/Home/NavBar';
import Control from './Components/Control/Control';
import AddWorker from './Components/Control/AddWorker';
import EditWorker from './Components/Control/EditWorker';
import Filter from './Components/Filter/Filter';
import Login from './Components/Authentication/Login';
import Register from './Components/Authentication/Register';
import EditPassword from './Components/Authentication/EditPassword';
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
                  <Route path="/edit-worker" element={<EditWorker />} />
                  <Route path="/gestion" element={<Register />} />
                  <Route path="/filtrar" element={<Filter />} />
                </Routes>
              </div>
            </div>
          }
        />

        {/* Rutas independientes para autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<EditPassword />} />
      </Routes>
    </Router>
  );
}

export default App;