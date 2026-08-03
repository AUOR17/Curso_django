// frontend_spa/src/components/modales/ModalLiquidar.tsx
import { useState } from "react";
import { apiDjango } from "../../api/client";
import { HandCoins } from "lucide-react";
import ModalBase from "./ModalBase";

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
  cazador: any | null;
}

export default function ModalLiquidar({
  onClose,
  onSuccess,
  cazador,
}: ModalProps) {
  const [monto, setMonto] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!cazador) return null;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiDjango.post(`/usuarios/${cazador.id}/liquidar/`, {
        monto: parseFloat(monto),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase
      onClose={onClose}
      icon={<HandCoins className="w-6 h-6 text-green-400" />}
      title="Liquidar Comisiones"
      accentColor="green"
      maxWidth="max-w-sm"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <p className="text-sm text-rpg-silver">
          Cazador: <strong className="text-rpg-bone">{cazador.username}</strong>
          <br />
          Saldo disponible:{" "}
          <strong className="text-rpg-gold">{cazador.gold}</strong>
        </p>

        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-rpg-bone text-sm font-bold mb-1">
            Monto a retirar (MXN / Oro)
          </label>
          <input
            type="number"
            step="0.01"
            max={cazador.gold}
            required
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full bg-rpg-dark text-rpg-parchment border border-green-500/30 rounded py-2 px-3 focus:border-green-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-green-900 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-lg transition-colors border border-green-500/50"
        >
          {loading ? "Procesando..." : "Aprobar Retiro"}
        </button>
      </form>
    </ModalBase>
  );
}
