// frontend_spa/src/pages/Registro.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiDjango } from "../api/client";
import { UserPlus, ShieldCheck } from "lucide-react";

export default function Registro() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("GUERRERO"); // Rol por defecto
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      // Enviamos el pergamino de registro al backend
      await apiDjango.post("/register/", { username, password, role });

      // Si tiene éxito, lo mandamos al login para que entre formalmente
      alert(
        "¡Reclutamiento exitoso! Las puertas del Gremio se han abierto para ti.",
      );
      navigate("/login");
    } catch (err: any) {
      console.error("Fallo al forjar el nuevo cazador:", err);
      setError(
        "Ese nombre de héroe ya está reclamado o los datos son inválidos.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-rpg-dark flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#141614] border border-rpg-blood/30 rounded-xl shadow-[0_0_30px_rgba(130,23,21,0.15)] p-8">
        <div className="flex flex-col items-center mb-8">
          <ShieldCheck className="w-12 h-12 text-rpg-gold mb-2" />
          <h2 className="text-3xl font-bold text-center text-rpg-gold font-serif">
            Nuevo Recluta
          </h2>
          <p className="text-sm text-rpg-silver mt-2 text-center">
            Firma el pacto de sangre para unirte al Gremio de Cazadores.
          </p>
        </div>

        {error && (
          <div className="bg-rpg-blood/20 border border-rpg-blood text-rpg-parchment px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Input Nombre */}
          <div>
            <label className="block text-rpg-bone text-sm font-bold mb-2">
              Nombre de Héroe
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s+/g, "_"))}
              placeholder="Ej. Sypha_Belnades"
              className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded-lg py-3 px-4 focus:outline-none focus:border-rpg-blood focus:ring-1 focus:ring-rpg-blood transition-colors"
              required
            />
          </div>

          {/* Input Contraseña */}
          <div>
            <label className="block text-rpg-bone text-sm font-bold mb-2">
              Contraseña Secreta
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded-lg py-3 px-4 focus:outline-none focus:border-rpg-blood focus:ring-1 focus:ring-rpg-blood transition-colors"
              required
            />
          </div>

          {/* Selector de Clase / Rol */}
          <div>
            <label className="block text-rpg-bone text-sm font-bold mb-2">
              Clase de Combate
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded-lg py-3 px-4 focus:outline-none focus:border-rpg-blood focus:ring-1 focus:ring-rpg-blood transition-colors"
            >
              <option value="GUERRERO">🗡️ Guerrero (Ventas)</option>
              <option value="MAGO">🔮 Mago (Marketing)</option>
              <option value="PICARO">🏹 Pícaro (Operaciones)</option>
              {/* Dejamos al Maestro fuera del registro público por seguridad */}
            </select>
          </div>

          {/* Botón de Submit */}
          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2 bg-rpg-blood hover:bg-[#a11c19] text-rpg-bone font-bold py-3 px-4 rounded-lg transition-colors border border-[#a11c19]"
          >
            <UserPlus className="w-5 h-5" />
            Forjar Pacto
          </button>
        </form>

        {/* Link para regresar al Login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-rpg-silver">
            ¿Ya eres miembro del Gremio?{" "}
            <Link
              to="/login"
              className="text-rpg-gold hover:text-white transition-colors underline decoration-rpg-gold/50"
            >
              Entra a la taberna aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
