// frontend_spa/src/components/modales/ModalReclutarCazador.tsx
import { useState } from "react";
import { apiDjango } from "../../api/client";
import { UserPlus } from "lucide-react";
import ModalBase from "./ModalBase";

/**
 * UserPlus (Usuario +):
    Dibuja la silueta de la cabeza y hombros de una persona con un símbolo de más (+) a su lado. 
    Es el estándar visual para "Reclutar", añadir un nuevo miembro a tu gremio, o crear una 
    cuenta nueva.
 */

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalReclutarCazador({
  onClose,
  onSuccess,
}: ModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("GUERRERO");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Usamos el mismo endpoint de registro que ya tenías
      await apiDjango.post("/register/", {
        username,
        password,
        role,
      });

      // Limpiamos los campos
      setUsername("");
      setPassword("");
      setRole("GUERRERO");

      // Recargamos la tabla y cerramos
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error al reclutar:", err);
      setError("Fallo al forjar el pacto. Quizás el nombre ya existe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase
      onClose={onClose}
      icon={<UserPlus className="w-6 h-6 text-rpg-blood" />}
      title="Nuevo Recluta"
      accentColor="blood"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="bg-rpg-blood/20 border border-rpg-blood text-rpg-parchment px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-rpg-bone text-sm font-bold mb-1">
            Nombre de Héroe (Sin espacios)
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/\s+/g, "_"))}
            placeholder="Ej. Grant_Danasty"
            className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded py-2 px-3 focus:outline-none focus:border-rpg-blood"
          />
        </div>

        <div>
          <label className="block text-rpg-bone text-sm font-bold mb-1">
            Contraseña Provisional
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded py-2 px-3 focus:outline-none focus:border-rpg-blood"
          />
        </div>

        <div>
          <label className="block text-rpg-bone text-sm font-bold mb-1">
            Clase de Combate
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded py-2 px-3 focus:outline-none focus:border-rpg-blood"
          >
            <option value="GUERRERO">🗡️ Guerrero (Ventas)</option>
            <option value="MAGO">🔮 Mago (Marketing)</option>
            <option value="PICARO">🏹 Pícaro (Operaciones)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-rpg-blood hover:bg-[#a11c19] text-white font-bold py-3 px-4 rounded-lg transition-colors border border-rpg-gold/30 disabled:opacity-50"
        >
          {loading ? "Firmando pacto..." : "Forjar Pacto"}
        </button>
      </form>
    </ModalBase>
  );
}
