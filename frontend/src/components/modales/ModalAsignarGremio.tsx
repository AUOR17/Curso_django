import { useState, useEffect } from 'react';
import { apiDjango } from '../../api/client';
import { Tent } from 'lucide-react';
import type {Gremio} from '../../types'
import ModalBase from './ModalBase';

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
  maestroId: number | null;
  maestroNombre: string;
}

export default function ModalAsignarGremio({
    onClose,
    onSuccess,
    maestroId,
    maestroNombre
}: ModalProps) {
    const [gremioId, setGremioId] = useState('');
    const [gremiosDisponibles, setGremiosDisponibles] = useState<Gremio[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        apiDjango.get('/gremios-disponibles/')
        .then(res => setGremiosDisponibles(res.data))
        .catch(err => console.error("Error al buscar sedes abandonadas", err));
    },[]);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await apiDjango.post('/asignar-gremio/', {
                user_id: maestroId,
                gremio_id: gremioId
            });

            setGremioId('');
            onSuccess();
            onClose();
        }
        catch(err) {
            console.error("Error al asignar sede:", err);
            setError("Fallo al entregar las llaves de la sede");
        }
        finally{
            setLoading(false);
        }
    };

    return (
    <ModalBase
      onClose={onClose}
      icon={<Tent className="w-6 h-6 text-purple-400" />}
      title="Asignar Sede"
      accentColor="purple"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

          <div className="mb-4">
            <p className="text-rpg-silver text-sm">Entregando el control a:</p>
            <p className="text-rpg-gold font-bold text-lg">{maestroNombre}</p>
          </div>

          <div>
            <label className="block text-rpg-bone text-sm font-bold mb-1">Seleccionar Sede Libre</label>
            <select
              required
              value={gremioId}
              onChange={(e) => setGremioId(e.target.value)}
              className="w-full bg-rpg-dark text-rpg-parchment border border-purple-500/30 rounded py-2 px-3 focus:outline-none focus:border-purple-500"
            >
              <option value="" disabled>Elige una sede abandonada...</option>
              {gremiosDisponibles.map(g => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))} {/*2:2 Samara*/}
               
            </select>
            {gremiosDisponibles.length === 0 && (
              <p className="text-xs text-red-400 mt-2">No hay sedes disponibles. Todas tienen Maestro o debes fundar una nueva.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || gremiosDisponibles.length === 0}
            className="w-full mt-6 bg-purple-900 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg transition-colors border border-purple-500/50 disabled:opacity-50"
          >
            {loading ? 'Entregando llaves...' : 'Asignar Gremio'}
          </button>
        </form>
      </ModalBase>
  );

}