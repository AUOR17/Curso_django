import { User, Coins, Shield } from 'lucide-react';
import ModalBase from './ModalBase';
import type { Cazador } from '../../types';

interface Props {
  onClose: () => void;
  cazador: Cazador;
}

export default function ModalDetalleCazador({ onClose, cazador }: Props) {
    return (
        <ModalBase
        onClose={onClose}
        icon = {<User className='w-6 h-6 text-rpg-gold'/>}
        title={cazador.username}
        subtitle={`${cazador.role} Nivel ${cazador.level}`}
        accentColor="gold"
        >
            <div className="bg-rpg-dark border border-rpg-gold/30 rounded-lg p-6 space-y-4">
        
        <div className="flex justify-between items-center border-b border-rpg-gold/20 pb-4">
          <span className="text-rpg-silver font-serif">Botín Acumulado</span>
          <span className="text-rpg-gold font-bold flex items-center gap-2 text-lg">
            {cazador.gold} <Coins className="w-5 h-5"/>
          </span>
        </div>

        <div className="flex justify-between items-center border-b border-rpg-gold/20 pb-4">
          <span className="text-rpg-silver font-serif">Afiliación</span>
          <span className="text-purple-300 flex items-center gap-2">
            <Shield className="w-4 h-4"/> {cazador.gremio_nombre || 'Lobo Solitario'}
          </span>
        </div>
        
        <div className="text-center pt-2">
          <p className="text-sm text-rpg-silver italic">
            "Un valiente miembro de nuestras filas."
          </p>
        </div>

      </div>

        </ModalBase>
    );
}