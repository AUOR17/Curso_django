// frontend_spa/src/components/modales/ModalNombrarMaestro.tsx
import { useState, useEffect } from "react";
import { apiDjango } from "../../api/client";
import { Crown } from "lucide-react";
import type { Gremio, Candidato } from "../../types";
import ModalBase from "./ModalBase";

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalNombrarMaestro({
  onClose,
  onSuccess,
}: ModalProps) {
  const [candidatoId, setCandidatoId] = useState("");
  const [gremioId, setGremioId] = useState("");

  const [gremios, setGremios] = useState<Gremio[]>([]);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Cuando se abre el modal, buscamos la lista de gremios
  useEffect(() => {
    // 1. Traer Gremios
    apiDjango
      .get("/sedes/")
      .then((res) => setGremios(res.data))
      .catch((err) => console.error("Error al cargar sedes:", err));

    // 2. Traer Candidatos (Mortales)
    apiDjango
      .get("/candidatos/")
      .then((res) => setCandidatos(res.data))
      .catch((err) => console.error("Error al cargar candidatos:", err));
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await apiDjango.post("/nombrar-maestro/", {
        user_id: candidatoId,
        gremio_id: gremioId,
      });

      setCandidatoId("");
      setGremioId("");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error al coronar al Maestro:", err);
      setError("Fallo al realizar el ascenso. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase
      onClose={onClose}
      icon={<Crown className="w-6 h-6 text-rpg-gold" />}
      title="Ascender a Maestro"
      accentColor="blood"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="bg-rpg-blood/20 border border-rpg-blood text-rpg-parchment px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* SELECT DE CAZADORES ELEGIBLES */}
        <div>
          <label className="block text-rpg-bone text-sm font-bold mb-1">
            Seleccionar Cazador
          </label>
          <select
            required
            value={candidatoId}
            onChange={(e) => setCandidatoId(e.target.value)}
            className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded py-2 px-3 focus:outline-none focus:border-rpg-blood"
          >
            <option value="" disabled>
              Elige a un mortal digno...
            </option>
            {candidatos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.username} (Actual: {c.role})
              </option>
            ))}
          </select>
        </div>

        {/* SELECT DE GREMIOS */}
        <div>
          <label className="block text-rpg-bone text-sm font-bold mb-1">
            Asignar a Sede (Gremio)
          </label>
          <select
            required
            value={gremioId}
            onChange={(e) => setGremioId(e.target.value)}
            className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded py-2 px-3 focus:outline-none focus:border-rpg-blood"
          >
            <option value="" disabled>
              Selecciona la Sede que liderará...
            </option>
            {gremios.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || gremios.length === 0 || candidatos.length === 0}
          className="w-full mt-6 bg-rpg-blood hover:bg-[#a11c19] text-white font-bold py-3 px-4 rounded-lg transition-colors border border-rpg-gold/30 disabled:opacity-50"
        >
          {loading ? "Realizando Ritual..." : "Coronar Maestro"}
        </button>
      </form>
    </ModalBase>
  );
}
