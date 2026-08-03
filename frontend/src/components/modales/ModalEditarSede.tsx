import { useState, useEffect } from 'react';
import { apiDjango } from '../../api/client';
import {Edit3} from 'lucide-react';
import ModalBase from './ModalBase';

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
  gremio: {id:number; nombre:string; description:string} | null;
}

export default function ModalEditarSede({
    onClose,
    onSuccess,
    gremio
}: ModalProps) {
    const [nombre, setNombre] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (gremio) {
            setNombre(gremio.nombre);
            setDescription(gremio.description || "");
        }
    }, [gremio]);

    if (!gremio) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await apiDjango.patch(`/sedes/${gremio.id}/`, {
                nombre,
                description
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al editar el gremio:', error);
            setError('Error al actualizar la sede');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalBase
        onClose={onClose}
        icon={<Edit3 className="w-6 h-6 text-purple-400" />}
        title="Editar Sede"
        accentColor="purple"
        >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
            <div className="bg-red-900/20 text-red-200 px-4 py-2 rounded text-sm">
                {error}
            </div>
            )}

            <div>
            <label className="block text-rpg-bone text-sm font-bold mb-1">
                Nombre
            </label>
            <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-rpg-dark text-rpg-parchment border border-purple-500/30 rounded py-2 px-3 focus:outline-none focus:border-purple-500"
            />
            </div>

            <div>
            <label className="block text-rpg-bone text-sm font-bold mb-1">
                Descripción
            </label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-rpg-dark text-rpg-parchment border border-purple-500/30 rounded py-2 px-3 h-24 resize-none focus:outline-none focus:border-purple-500"
            />
            </div>

            <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-purple-900 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg transition-colors border border-purple-500/50"
            >
            {loading ? "Reescribiendo..." : "Guardar Cambios"}
            </button>
        </form>
        </ModalBase>
    );
   
}