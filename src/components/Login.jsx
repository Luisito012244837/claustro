import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/bootstrap.min.css";
import "../assets/fonts/fontawesome-all.min.css";
import Swal from "sweetalert2";
import "../assets/css/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validación básica de campos vacíos
    if (!username || !password) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }
  
    const data = {
      username: username,
      password: password,
    };
  
    setIsLoading(true);
  
    try {
      console.log("Enviando solicitud a la API...");
  
      // Hacer la solicitud POST a la API usando fetch
      const response = await fetch("http://10.10.1.1:8000/apiv1/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      console.log("Respuesta recibida:", response);
  
      // Verificar si la respuesta es exitosa
      if (response.ok) {
        const result = await response.json(); // Parsear la respuesta como JSON
        console.log("Respuesta de la API:", result);
  
        // Verificar si la respuesta contiene un token
        if (result.token) {
          // Guardar el token y el nombre de usuario en localStorage
          localStorage.setItem("token", result.token); // Guardar el token
          localStorage.setItem("username", username); // Guardar el nombre de usuario
  
          // Asignar rol (esto es un ejemplo, ajusta según tu lógica)
          const role = username === "admin" ? "admin" : "user"; // Asignar rol
          localStorage.setItem("role", role); // Guardar el rol
  
          console.log("Token y rol guardados en localStorage:", result.token, role);
  
          // Mostrar mensaje de éxito con SweetAlert2
          Swal.fire({
            icon: "success",
            title: "¡Inicio de sesión exitoso!",
            text: "Bienvenido a nuestra web.",
          }).then(() => {
            // Redirigir al usuario después del login
            navigate("/"); // Redirige a la ruta de Bienvenido
          });
        } else {
          // Manejar errores de la API
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Usuario o contraseña incorrectos.",
          });
        }
      } else {
        // Manejar errores de la API
        const errorData = await response.json();
        console.error("Error en la API:", errorData);
  
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.message || "Usuario o contraseña incorrectos.",
        });
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
  
      // Mostrar mensaje de error en caso de fallo en la conexión
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar al servidor. Inténtalo de nuevo más tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card card shadow-lg o-hidden border-0">
        <div className="card-body p-4">
          <div className="text-center">
            <h4 className="text-dark mb-4">
              <b>Bienvenido a AKADEMIA</b>
            </h4>
          </div>
          <form className="user" onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                className="form-control form-control-user"
                type="text"
                id="exampleInputusername"
                aria-describedby="usernameHelp"
                placeholder="Introduzca su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                className="form-control form-control-user"
                type="password"
                id="exampleInputPassword"
                placeholder="Introduzca su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="formCheck-1"
                />
                <label className="form-check-label" htmlFor="formCheck-1">
                  Recordar
                </label>
              </div>
            </div>
            <button
              className="btn bg-success d-block btn-primary w-100"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Cargando..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
