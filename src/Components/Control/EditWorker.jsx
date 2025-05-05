import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Para redireccionar
import '../../assets/styles/EditWorker.css'; // Importa los estilos CSS

const EditWorker = () => {
  const navigate = useNavigate(); // Hook para redireccionar
  const location = useLocation();
  const worker = location.state?.worker; // Obtiene los datos del trabajador desde la navegación

  const handleCancel = () => {
    navigate('/control'); // Redirige a la ruta /control
  };

  return (
    <div className="add-worker-container">
      <h2>Editar trabajador</h2>
      <form>
        {/* Primera fila de campos */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" defaultValue={worker?.nombre} required />
          </div>
          <div className="form-group">
            <label htmlFor="primerApellido">Primer Apellido</label>
            <input type="text" id="primerApellido" name="primerApellido" defaultValue={worker?.primerApellido} required />
          </div>
          <div className="form-group">
            <label htmlFor="segundoApellido">Segundo Apellido</label>
            <input type="text" id="segundoApellido" name="segundoApellido" defaultValue={worker?.segundoApellido} required />
          </div>
          <div className="form-group">
            <label htmlFor="cantGrupoConferencia">Cant Grupo Conferencia</label>
            <input type="number" id="cantGrupoConferencia" name="cantGrupoConferencia" defaultValue={worker?.cantidadConferencia} />
          </div>
        </div>

        {/* Segunda fila de campos */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cantGrupoClasePractica">Cant Grupo Clase Práctica</label>
            <input type="number" id="cantGrupoClasePractica" name="cantGrupoClasePractica" defaultValue={worker?.cantidadClasePractica} />
          </div>
          <div className="form-group">
            <label htmlFor="anioGraduado">Año Graduado</label>
            <select id="anioGraduado" name="anioGraduado" defaultValue={worker?.anoGraduado}>
              <option value="Ninguno">Ninguno</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="aniosExperiencia">Años de experiencia</label>
            <input type="text" id="aniosExperiencia" name="aniosExperiencia" defaultValue={worker?.anosExperiencia} placeholder="Vacío" />
          </div>
          <div className="form-group">
            <label htmlFor="sexo">Sexo</label>
            <select id="sexo" name="sexo" defaultValue={worker?.sexo}>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        {/* Tercera fila de campos */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cursoImparte">Curso que imparte</label>
            <select id="cursoImparte" name="cursoImparte" defaultValue={worker?.cursoImparte}>
              <option value="Seleccionar">Seleccionar</option>
              <option value="Curso1">Curso 1</option>
              <option value="Curso2">Curso 2</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="categoriaDocente">Categoría Docente</label>
            <select id="categoriaDocente" name="categoriaDocente" defaultValue={worker?.categoriaDocente}>
              <option value="Seleccionar">Seleccionar</option>
              <option value="Categoria1">Categoría 1</option>
              <option value="Categoria2">Categoría 2</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="anioAcademico">Año Académico</label>
            <select id="anioAcademico" name="anioAcademico" defaultValue={worker?.anoAcademico}>
              <option value="Seleccionar">Seleccionar</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="carrera">Carrera</label>
            <select id="carrera" name="carrera" defaultValue={worker?.carrera}>
              <option value="Seleccionar">Seleccionar</option>
              <option value="Carrera1">Carrera 1</option>
              <option value="Carrera2">Carrera 2</option>
            </select>
          </div>
        </div>

        {/* Cuarta fila de campos */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="responsabilidad">Responsabilidad</label>
            <select id="responsabilidad" name="responsabilidad" defaultValue={worker?.responsabilidad}>
              <option value="Seleccionar">Seleccionar</option>
              <option value="Responsabilidad1">Responsabilidad 1</option>
              <option value="Responsabilidad2">Responsabilidad 2</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="cargo">Cargo</label>
            <select id="cargo" name="cargo" defaultValue={worker?.cargo}>
              <option value="Seleccionar">Seleccionar</option>
              <option value="Cargo1">Cargo 1</option>
              <option value="Cargo2">Cargo 2</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="categoriaCientifica">Categoría Científica</label>
            <select id="categoriaCientifica" name="categoriaCientifica" defaultValue={worker?.categoriaCientifica}>
              <option value="Seleccionar">Seleccionar</option>
              <option value="CategoriaCientifica1">Categoría Científica 1</option>
              <option value="CategoriaCientifica2">Categoría Científica 2</option>
            </select>
          </div>
        </div>

        {/* Asignatura y área */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="asignatura">Asignatura</label>
            <select id="asignatura" name="asignatura" defaultValue={worker?.asignatura}>
              <option value="Seleccionar">Seleccionar</option>
              <option value="Asignatura1">Asignatura 1</option>
              <option value="Asignatura2">Asignatura 2</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="area">Área</label>
            <select id="area" name="area" defaultValue={worker?.area}>
              <option value="Seleccionar">Seleccionar</option>
              <option value="Area1">Área 1</option>
              <option value="Area2">Área 2</option>
            </select>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button type="submit" className="submit-button">Guardar cambios</button>
          <button type="button" className="cancel-button" onClick={handleCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default EditWorker;
