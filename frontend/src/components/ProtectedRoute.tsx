// frontend_spa/src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-rpg-dark h-screen text-rpg-blood flex items-center justify-center font-serif">
        Verificando linaje...
      </div>
    );
  }

  // Si está autenticado, renderiza el Outlet (las rutas de adentro).
  // Si no, lo rebota al login de inmediato.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
