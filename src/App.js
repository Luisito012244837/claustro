import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom';
import { ThemeProvider, useTheme } from './Components/Home/ThemeContext';
import SideBar from './Components/Home/SideBar';
import NavBar from './Components/Home/NavBar';
import Welcome from './Components/Welcome/Welcome';
import Control from './Components/Control/Control';
import AddWorker from './Components/Control/AddWorker';
import EditWorker from './Components/Control/EditWorker';
import AsignaturaCreate from './Components/AsignaturaCreate/AsignaturaCreate';
import Login from './Components/Authentication/Login';
import Register from './Components/Authentication/Register';
import EditPassword from './Components/Authentication/EditPassword';
import Especialistas from './Components/Especialistas/Especialistas';
import ProtectedRoute from './Components/ProtectedRoute'; // Asegúrate de crearlo (ver ejemplo abajo)
import './assets/styles/Home.css';
import './assets/styles/Authentication.css';

// Componente para manejar el tema
const ThemeHandler = () => {
  const { darkMode } = useTheme();

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return null;
};

// Layout para rutas protegidas (incluye SideBar y NavBar)
const ProtectedLayout = () => (
  <div style={{ display: 'flex' }}>
    <SideBar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <div className="theme-content">
        <Outlet />  {/* Cambiado de {children} a Outlet */}
      </div>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <ThemeHandler />
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/change-password" element={<EditPassword />} />

          {/* Rutas protegidas (estructura corregida) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedLayout />}>
              <Route index element={<Welcome />} />
              <Route path="control" element={<Control />} />
              <Route path="add-worker" element={<AddWorker />} />
              <Route path="edit-worker" element={<EditWorker />} />
              <Route path="gestion" element={<Register />} />
              <Route path="welcome" element={<Welcome />} />
              <Route path="create-asignatura" element={<AsignaturaCreate />} />
              <Route path="especialistas" element={<Especialistas />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;