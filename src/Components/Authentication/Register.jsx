import React from 'react';
import '../../assets/styles/Register.css'; // Ruta corregida

const Register = () => {
  return (
    <div className="register-container">
      <h1>Agregar Trabajador</h1>
      <form className="register-form">
        {/* Nombre y Apellido en la misma fila */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" placeholder="Ingrese el nombre" />
          </div>
          <div className="form-group">
            <label htmlFor="lastname">Apellido</label>
            <input type="text" id="lastname" placeholder="Ingrese el apellido" />
          </div>
        </div>

        {/* Nombre de usuario */}
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario</label>
          <input type="text" id="username" placeholder="Ingrese el nombre de usuario" />
        </div>

        {/* Correo electrónico */}
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input type="email" id="email" placeholder="Ingrese el correo electrónico" />
        </div>

        {/* Contraseña */}
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" placeholder="Ingrese la contraseña" />
        </div>

        {/* Botón de registrar */}
        <button type="submit" className="register-button">Registrar</button>
      </form>
    </div>
  );
};

export default Register;