import { useState, useEffect } from "react";
import { apiDjango } from "../../api/client";
import { ShieldPlus } from "lucide-react";
import type { Gremio } from "../../types";
import ModalBase from "./ModalBase";

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
  cazadorId: number;
  cazadorNombre: string;
}

export default function ModalReclutarParaSede({
  onClose,
  onSuccess,
  cazadorId,
  cazadorNombre,
}: ModalProps) {
  const [gremioId, setGremioId] = useState("");
  const [gremios, setGremios] = useState<Gremio[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // El Gran Maestro puede ver TODAS las sedes (usamos el endpoint de ListCreateView)
    apiDjango
      .get("/sedes/")
      .then((res) => setGremios(res.data))
      .catch((err) => console.error("Error al buscar sedes:", err));
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Usamos el endpoint generado por el @action en tu ViewSet
      await apiDjango.post(`/usuarios/${cazadorId}/reclutar/`, {
        gremio_id: gremioId,
      });

      onSuccess();
    } catch (err: any) {
      console.error("Error al asignar al cazador:", err);
      setError(err.response?.data?.error || "Fallo al reclutar al candidato.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase
      onClose={onClose}
      icon={<ShieldPlus className="w-6 h-6 text-purple-400" />}
      title="Asignar Destino"
      subtitle={`Enviando a ${cazadorNombre} a una sede`}
      accentColor="purple"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-2 rounded text-sm font-serif">
            {error}
          </div>
        )}

        <div>
          <label className="block text-rpg-bone text-sm font-bold mb-1">
            Seleccionar Gremio Destino
          </label>
          <select
            required
            value={gremioId}
            onChange={(e) => setGremioId(e.target.value)}
            className="w-full bg-rpg-dark text-rpg-parchment border border-purple-500/30 rounded py-2 px-3 focus:outline-none focus:border-purple-500"
          >
            <option value="" disabled>
              Elige el estandarte que defenderá...
            </option>
            {gremios.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
          {gremios.length === 0 && (
            <p className="text-xs text-red-400 mt-2">
              No hay gremios fundados en el reino.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || gremios.length === 0 || !gremioId}
          className="w-full mt-6 bg-purple-900 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg transition-colors border border-purple-500/50 disabled:opacity-50"
        >
          {loading ? "Sellando contrato..." : "Reclutar Cazador"}
        </button>
      </form>
    </ModalBase>
  );
}
