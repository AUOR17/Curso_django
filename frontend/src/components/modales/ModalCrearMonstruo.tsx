import { useState } from 'react';
import { apiDjango } from '../../api/client';
import { Target } from 'lucide-react';
import ModalBase from './ModalBase';

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalAsignarGremio({
    onClose,
    onSuccess
}: ModalProps) {
    const [name, setName] = useState('');
    const [raceClass, setRaceClass] = useState('');
    const [threatLevel, setThreatLevel] = useState(50);
    const [estimatedReward, setEstimatedReward] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await apiDjango.post('/quests/leads/', {
                name,
                race_class: raceClass,
                threat_level: threatLevel,
                estimated_reward: estimatedReward,
                status: 'AVISTAMIENTO' 
            });

            setName('');
            setRaceClass('');
            setThreatLevel(50);
            setEstimatedReward('');
            onSuccess();
            onClose();
        }
        catch(err) {
            console.error("Error al registarar al monstruo:", err);
            setError("No se pudo registrar al monstruo");
        }
        finally{
            setLoading(false);
        }
    };

    return (
    <ModalBase
      onClose={onClose}
      icon={<Target className="w-6 h-6 text-rpg-blood" />}
      title="Nuevo Objetivo"
      accentColor="blood"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rpg-blood/20 border border-rpg-blood text-rpg-parchment px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-rpg-bone text-sm font-bold mb-1">Nombre de la Bestia</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Carmilla"
              className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded py-2 px-3 focus:outline-none focus:border-rpg-blood"
            />
          </div>

          <div>
            <label className="block text-rpg-bone text-sm font-bold mb-1">Clase / Raza</label>
            <input
              type="text"
              required
              value={raceClass}
              onChange={(e) => setRaceClass(e.target.value)}
              placeholder="Ej. Vampiro Noble"
              className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded py-2 px-3 focus:outline-none focus:border-rpg-blood"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-rpg-bone text-sm font-bold mb-1">Amenaza (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={threatLevel}
                onChange={(e) => setThreatLevel(Number(e.target.value))}
                className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded py-2 px-3 focus:outline-none focus:border-rpg-blood"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-rpg-bone text-sm font-bold mb-1">Botín Estimado</label>
              <input
                type="number"
                step="0.01"
                required
                value={estimatedReward}
                onChange={(e) => setEstimatedReward(e.target.value)}
                placeholder="0.00"
                className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-blood/30 rounded py-2 px-3 focus:outline-none focus:border-rpg-blood"
              />
            </div>
          </div>

          {/* Botón de Guardar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-rpg-blood hover:bg-[#a11c19] text-white font-bold py-3 px-4 rounded-lg transition-colors border border-rpg-gold/30 disabled:opacity-50"
          >
            {loading ? 'Invocando...' : 'Añadir al Bestiario'}
          </button>
        </form>
      </ModalBase>
  );

}