import { useState, useEffect } from 'react';
import { apiDjango } from '../../api/client';
import { Tent } from 'lucide-react';
import type {Gremio} from '../../types'
import ModalBase from './ModalBase';

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
  quest: any | null;
}

export default function ModalAsignarMision({
    onClose,
    onSuccess,
    quest
}: ModalProps) {
    const [gremios, setGremios] = useState<Gremio[]>([]);
    const [selectedGremio, setSelectedGremio] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        apiDjango.get('/sedes/')
        .then(res => setGremios(res.data))
        .catch(err => console.error("Error al cargar las sedes", err));
    },[]);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiDjango.post(`/quests/tablero/${quest.id}/`, {
                gremio: selectedGremio ? Number(selectedGremio): null
            });
            onSuccess();
            onClose();
        }
        catch(err) {
            console.error("Error al asignar sede:", err);
        }
        finally{
            setLoading(false);
        }
    };

    return (
    <ModalBase
      onClose={onClose}
      icon={<Tent className="w-6 h-6 text-purple-400" />}
      title="Delegar a Sede"
      accentColor="purple"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className='text-sm text-rpg-silver'>
            ¿A que gremio se desea encomendar esta mision? <strong className='text-rpg-bone'>{quest.title}</strong>
        </p>
        <div>
            <select required value={selectedGremio} onChange={(e) => setSelectedGremio(e.target.value)}
              className="w-full bg-rpg-dark text-rpg-parchment border border-purple-500/30 rounded py-2 px-3 focus:outline-none focus:border-purple-500"
            >
              <option value="" disabled>-- Selecciona un Gremio --</option>
              <option value="">🌍 Volverla Misión Global</option>
              {gremios.map(g => (
                <option key={g.id} value={g.id}> {g.nombre}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="w-full mt-6 bg-purple-900 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg transition-colors border border-purple-500/50"
          >
            {loading ? 'Asignando...' : 'Confirmar Asignación'}
          </button>
          
        </form>
      </ModalBase>
  );

}