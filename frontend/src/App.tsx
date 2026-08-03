// frontend_spa/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Tablero from "./pages/Tablero";
import Login from "./pages/Login";
import Codice from "./pages/Codice";
import Registro from "./pages/Registro";
import Gremio from "./pages/Gremio";
import Sedes from "./pages/Sedes";
import MiGremio from "./pages/MiGremio";

export default function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <BrowserRouter>
          <Routes>
            {/* 🔓 RUTAS PÚBLICAS */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registro />} />

            {/* 🔒 RUTAS PRIVADAS ANIDADAS */}
            {/* Primer filtro: ¿Está autenticado? */}
            <Route element={<ProtectedRoute />}>
              {/* Segundo filtro: Aplicar el diseño base (Sidebar/Topbar) */}
              <Route element={<DashboardLayout />}>
                <Route path="/tablero" element={<Tablero />} />
                <Route path="/leads" element={<Codice />} />
                <Route path="/gremio" element={<Gremio />} />
                <Route path="/sedes" element={<Sedes />} />
                <Route path="/mi-gremio" element={<MiGremio />} />
              </Route>
            </Route>

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/tablero" replace />} />
          </Routes>
        </BrowserRouter>
      </ModalProvider>
    </AuthProvider>
  );
}
