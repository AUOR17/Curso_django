// frontend_spa/src/components/modales/ModalForjarMision.tsx
import { useState, useEffect } from "react";
import { apiDjango } from "../../api/client";
import { ScrollText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { Gremio } from "../../types";
import ModalBase from "./ModalBase";

// ScrollText (Pergamino con texto):

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalForjarMision({ onClose, onSuccess }: ModalProps) {
  const { user } = useAuth(); // Necesitamos saber el rol
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [potentialReward, setPotentialReward] = useState("");

  // Nuevo estado para el Gran Maestro
  const [gremioId, setGremioId] = useState<string>("");
  const [gremios, setGremios] = useState<Gremio[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si es Gran Maestro, le traemos la lista de sedes
  useEffect(() => {
    if (user?.role === "GRAN_MAESTRO") {
      apiDjango
        .get("/sedes/")
        .then((res) => setGremios(res.data))
        .catch((err) => console.error("Error al cargar sedes", err));
    }
  }, [user]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let recompensaSegura = parseFloat(potentialReward);
    if (isNaN(recompensaSegura) || recompensaSegura < 0) {
      recompensaSegura = 0;
    } else if (recompensaSegura > 99999999.99) {
      recompensaSegura = 99999999.99;
    }

    try {
      await apiDjango.post("/quests/tablero/", {
        title,
        description,
        difficulty_level: difficultyLevel,
        potential_reward: potentialReward,
        status: "TABERNA",
        // Si hay un gremio seleccionado, lo mandamos como número, si no, nulo
        gremio_id: gremioId ? Number(gremioId) : null,
      });

      setTitle("");
      setDescription("");
      setDifficultyLevel(1);
      setPotentialReward("");
      setGremioId("");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Fallo al forjar misión:", err);
      setError("Los cuervos fallaron. Revisa que los datos sean correctos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase
      onClose={onClose}
      icon={<ScrollText className="w-6 h-6 text-rpg-gold" />}
      title="Forjar Nuevo Encargo"
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
            Título de la Misión
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded py-2 px-3 focus:outline-none focus:border-rpg-blood"
          />
        </div>

        <div>
          <label className="block text-rpg-bone text-sm font-bold mb-1">
            Descripción
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded py-2 px-3 h-24 resize-none focus:outline-none focus:border-rpg-blood"
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-rpg-bone text-sm font-bold mb-1">
              Nivel (1-100)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              required
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(Number(e.target.value))}
              className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded py-2 px-3 focus:outline-none focus:border-rpg-blood"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-rpg-bone text-sm font-bold mb-1">
              Recompensa
            </label>
            <input
              type="number"
              step="100"
              min="0"
              max="99999999.99"
              required
              value={potentialReward}
              onChange={(e) => setPotentialReward(e.target.value)}
              placeholder="0.00"
              className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded py-2 px-3 focus:outline-none focus:border-rpg-blood"
            />
          </div>
        </div>

        {/* Selector de Gremio SOLO para el Gran Maestro */}
        {user?.role === "GRAN_MAESTRO" && (
          <div>
            <label className="block text-rpg-bone text-sm font-bold mb-1">
              Sede Asignada (Opcional)
            </label>
            <select
              value={gremioId}
              onChange={(e) => setGremioId(e.target.value)}
              className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded py-2 px-3 focus:outline-none focus:border-rpg-blood"
            >
              <option value="">🌍 Misión Global (Todos los gremios)</option>
              {gremios.map((g) => (
                <option key={g.id} value={g.id}>
                  ⛺ {g.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-rpg-blood hover:bg-[#a11c19] text-white font-bold py-3 px-4 rounded-lg transition-colors border border-rpg-gold/30 disabled:opacity-50"
        >
          {loading ? "Redactando pergamino..." : "Colgar en Tablero"}
        </button>
      </form>
    </ModalBase>
  );
}
