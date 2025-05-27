import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import ProtectedRoute from './Components/ProtectedRoute';
import { checkAuthComplete, loginSuccess, setLoading } from './redux/authSlice';
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
        <Outlet />
      </div>
    </div>
  </div>
);

// Componente para rutas públicas (sin autenticación)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  
  // Si está cargando, mostrar loading
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Cargando...</div>
      </div>
    );
  }
  
  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Si no está autenticado, mostrar la ruta pública
  return children;
};

// Función para validar token (opcional: puedes hacer una llamada al backend)
const validateToken = async (token) => {
  try {
    // Aquí puedes hacer una llamada a tu API para validar el token
    // const response = await fetch('/api/validate-token', {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return response.ok;
    
    // Por ahora, validación básica del formato del token
    return token && token.length > 10; // Validación simple
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

// Componente principal de inicialización
const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch(setLoading(true));
        
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          // Validar el token
          const isValidToken = await validateToken(token);
          
          if (isValidToken) {
            try {
              const parsedUser = JSON.parse(userData);
              
              // Verificar que los datos del usuario sean válidos
              if (parsedUser && parsedUser.id) {
                dispatch(loginSuccess({ 
                  user: parsedUser, 
                  token: token 
                }));
                return;
              }
            } catch (parseError) {
              console.error('Error parsing user data:', parseError);
            }
          }
        }
        
        // Si llegamos aquí, limpiar datos inválidos
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(checkAuthComplete());
        
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(checkAuthComplete());
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Mostrar loading mientras se inicializa la autenticación
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        <div>Inicializando aplicación...</div>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <ThemeHandler />
      <BrowserRouter>
        <AppInitializer>
          <Routes>
            {/* Rutas públicas */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/change-password" 
              element={
                <PublicRoute>
                  <EditPassword />
                </PublicRoute>
              } 
            />
            
            {/* Rutas protegidas */}
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
            
            {/* Ruta catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppInitializer>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
