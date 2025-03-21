import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/Authentication.css'; // Importa los estilos CSS
import '../../assets/styles/Login.css'; // Importa los estilos CSS

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        <form>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Iniciar Sesión</button>
        </form>
      
      </div>
    </div>
  );
};

export default Login;