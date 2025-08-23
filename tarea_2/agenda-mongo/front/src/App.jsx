import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Listado from './pages/Listado';
import Formulario from './pages/Formulario';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{maxWidth: 900, margin: '20px auto', padding: 16}}>
        <Routes>
          <Route path="/" element={<Listado />} />
          <Route path="/nuevo" element={<Formulario />} />
          <Route path="/editar/:id" element={<Formulario editar />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
