import { useState, useEffect } from 'react';
import { apiDjango } from '../../api/client';
import {Tent, Crown, Coins } from 'lucide-react';
import type {Cazador} from '../../types'
import ModalBase from './ModalBase';

interface ModalProps {
  onClose: () => void;
  gremioId: number | null;
  gremioNombre: string;
}

export default function ModalDetalleSede({ onClose, gremioId, gremioNombre }: ModalProps) {
    const [miembros, setMiembros] = useState<Cazador[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (gremioId){
            setLoading(true);
            apiDjango.get(`/sedes/${gremioId}/miembros/`)
            .then(res => setMiembros(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
        }
    }, [gremioId]);

    
    return (
        <ModalBase
        onClose={onClose}
        icon = {<Tent className='w-6 h-6 text-purple-400'/>}
        title={`Inspeccionando: ${gremioNombre}`}
        accentColor="purple"
        maxWidth='max-w-2xl'
        subtitle={`Fuerza total: ${miembros.length} cazadores`}
        >
         
         {loading ? (
            <div className="text-center text-purple-400 animate-pulse py-8">Invocando bola de cristal...</div>
         ):(
            <div>
                {miembros.map(m=>(
                    <div key={m.id} className={`flex justify-between items-center p-4 rounded-lg border ${m.role ==='MAESTRO' ? 'bg-rpg-blood/10 border-rpg-blood/50': 'bg-rpg-dark border-purple-500/20'}`}>
                        
                    </div>
                ))}
            </div>
         )}

        </ModalBase>
    );
}