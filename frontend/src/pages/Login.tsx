// frontend_spa/src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiDjango } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await apiDjango.post("/token/", { username, password });
      const meResponse = await apiDjango.get("/me/");
      login(meResponse.data);

      navigate("/tablero");
    } catch (err: any) {
      console.error("Fallo en la brecha:", err);
      setError(
        "Credenciales incorrectas o los escudos del servidor están arriba.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-rpg-dark flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#141614] border border-rpg-blood/30 rounded-xl shadow-[0_0_30px_rgba(130,23,21,0.15)] p-8">
        <h2 className="text-3xl font-bold text-center text-rpg-gold mb-8 font-serif">
          Gremio de Cazadores
        </h2>

        {error && (
          <div className="bg-rpg-blood/20 border border-rpg-blood text-rpg-parchment px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-rpg-bone text-sm font-bold mb-2">
              Nombre de Héroe
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded-lg py-3 px-4 focus:outline-none focus:border-rpg-blood focus:ring-1 focus:ring-rpg-blood transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-rpg-bone text-sm font-bold mb-2">
              Contraseña Secreta
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded-lg py-3 px-4 focus:outline-none focus:border-rpg-blood focus:ring-1 focus:ring-rpg-blood transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-rpg-blood hover:bg-[#a11c19] text-rpg-bone font-bold py-3 px-4 rounded-lg transition-colors border border-[#a11c19]"
          >
            Entrar al Tablero
          </button>
        </form>

        {/* --- NUEVO LINK HACIA EL REGISTRO --- */}
        <div className="mt-6 text-center">
          <p className="text-sm text-rpg-silver">
            ¿Aún no tienes un pacto de sangre?{" "}
            <Link
              to="/register"
              className="text-rpg-gold hover:text-white transition-colors underline decoration-rpg-gold/50"
            >
              Únete al Gremio aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
