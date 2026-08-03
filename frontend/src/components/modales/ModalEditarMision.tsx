import { useState, useEffect } from 'react';
import { apiDjango } from '../../api/client';
import {Edit3} from 'lucide-react';
import ModalBase from './ModalBase';

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
  quest: any | null;
}

export default function ModalEditarMision({
    onClose,
    onSuccess,
    quest
}: ModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState(1);
    const [potentialReward, setPotentialReward] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (quest) {
            setTitle(quest.title);
            setDescription(quest.description);
            setDifficultyLevel(quest.difficultyLevel);
            setPotentialReward(quest.potentialReward);
        }
    }, [quest]);

    if (!quest) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        let recompensa_segura = parseFloat(potentialReward);
        if (isNaN(recompensa_segura) || recompensa_segura < 0) {
            recompensa_segura = 0;
        } else if (recompensa_segura > 99999999.99) {
            recompensa_segura = 99999999.99;
        }

        try {
            await apiDjango.patch(`/quests/tablero/${quest.id}/`, {
                title,
                description,
                difficultyLevel: difficultyLevel,
                potentialReward: potentialReward,
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating quest:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
    <ModalBase
      onClose={onClose}
      icon={<Edit3 className="w-6 h-6 text-rpg-gold" />}
      title="Modificar Encargo"
      accentColor="gold"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-rpg-bone text-sm font-bold mb-1">
            Título
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-gold/30 rounded py-2 px-3 focus:outline-none focus:border-rpg-gold"
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
            className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-gold/30 rounded py-2 px-3 h-24 resize-none focus:outline-none focus:border-rpg-gold"
          />
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-rpg-bone text-sm font-bold mb-1">
              Nivel
            </label>
            <input
              type="number"
              min="1"
              max="100"
              required
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(Number(e.target.value))}
              className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-gold/30 rounded py-2 px-3 focus:outline-none focus:border-rpg-gold"
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
              className="w-full bg-rpg-dark text-rpg-parchment border border-rpg-gold/30 rounded py-2 px-3 focus:outline-none focus:border-rpg-gold"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-rpg-gold/20 hover:bg-rpg-gold/40 text-rpg-gold font-bold py-3 px-4 rounded-lg transition-colors border border-rpg-gold/50"
        >
          {loading ? "Sellando..." : "Guardar Cambios"}
        </button>
      </form>
    </ModalBase>
  );
}