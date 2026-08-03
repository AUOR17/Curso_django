// frontend_spa/src/components/modales/ModalFundarGremio.tsx
import { useState } from "react";
import { apiDjango } from "../../api/client";
import { Tent } from "lucide-react";
import ModalBase from "./ModalBase";

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalFundarGremio({ onClose, onSuccess }: ModalProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await apiDjango.post("/sedes/", { nombre, descripcion });
      setNombre("");
      setDescripcion("");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error al fundar gremio:", err);
      setError("Fallo al crear la sede. ¿Quizás ese nombre ya existe?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase
      onClose={onClose}
      icon={<Tent className="w-6 h-6 text-purple-400" />}
      title="Fundar Nueva Sede"
      accentColor="purple"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-rpg-bone text-sm font-bold mb-1">
            Nombre del Gremio
          </label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Fairy Tail"
            className="w-full bg-rpg-dark text-rpg-parchment border border-purple-500/30 rounded py-2 px-3 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-rpg-bone text-sm font-bold mb-1">
            Descripción (Opcional)
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej. Gremio especializado en magia de fuego..."
            className="w-full bg-rpg-dark text-rpg-parchment border border-purple-500/30 rounded py-2 px-3 focus:outline-none focus:border-purple-500 h-24 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-purple-900 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg transition-colors border border-purple-500/50 disabled:opacity-50"
        >
          {loading ? "Construyendo..." : "Levantar Estandarte"}
        </button>
      </form>
    </ModalBase>
  );
}
