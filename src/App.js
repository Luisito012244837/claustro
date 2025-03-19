import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Bienvenido from "./components/Bienvenido";
import Login from "./components/Login";
import Control from "./components/Control";
import Gestion from './components/Gestion';
import AddTrabajador from './components/AddTrabajador';
import EditarTrabajador from './components/EditarTrabajador'; // Importa el nuevo componente

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route index element={<Bienvenido />} />
                        <Route path="control" element={<Control />} />
                        <Route path="gestion" element={<Gestion />} />
                        <Route path="add-trabajador" element={<AddTrabajador />} />
                        <Route path="editar-trabajador/:id" element={<EditarTrabajador />} /> {/* Nueva ruta */}
                    </Route>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;