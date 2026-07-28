import { Target, Skull, Swords, Coins, Image as ImageIcon, X } from 'lucide-react';
import ModalBase from './ModalBase';
import type { Lead } from '../../types';

interface Props {
  onClose: () => void;
  lead: Lead | null;
}

export default function ModalDetalleMonstruo({ onClose, lead }: Props) {
    if (!lead) return null;
    return (
        <ModalBase
        onClose={onClose}
        icon = {<Target className='w-6 h-6 text-rpg-blood'/>}
        title={lead.name}
        accentColor="blood"
        maxWidth='max-w-lg'
        >
         <div className="h-48 bg-rpg-dark/80 border-b border-rpg-blood/30 rounded-t-xl flex flex-col items-center justify-center relative overflow-hidden group">
          <ImageIcon className="w-16 h-16 text-rpg-silver/20 mb-2 group-hover:scale-110 transition-transform duration-500" />
          <span className="text-sm text-rpg-silver/40 font-serif italic">Se busca retrato oficial...</span>
          <div className="absolute bottom-2 left-4 bg-rpg-dark/80 px-3 py-1 rounded border border-rpg-gold/30 text-rpg-gold text-xs font-bold shadow-lg backdrop-blur-sm">
            Fase: {lead.status}
          </div>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-rpg-bone font-serif leading-tight mb-2">
              {lead.name}
            </h2>
            <p className="text-lg text-rpg-silver font-serif italic border-l-2 border-rpg-blood pl-3">
              {lead.race_class}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-rpg-dark/50 p-4 rounded-lg flex flex-col items-center border border-rpg-blood/20 shadow-inner">
              <Skull className="w-8 h-8 text-rpg-blood mb-2" />
              <span className="text-xs uppercase text-rpg-parchment tracking-wider mb-1">Nivel de Amenaza</span>
              <span className="font-bold text-rpg-bone text-2xl">{lead.threat_level}%</span>
            </div>
            <div className="bg-rpg-dark/50 p-4 rounded-lg flex flex-col items-center border border-rpg-gold/20 shadow-inner">
              <Coins className="w-8 h-8 text-rpg-gold mb-2" />
              <span className="text-xs uppercase text-rpg-parchment tracking-wider mb-1">Botín Estimado</span>
              <span className="font-bold text-rpg-bone text-xl">${lead.estimated_reward}</span>
            </div>
          </div>

          <div className="bg-rpg-dark p-4 rounded-lg border border-rpg-silver/10 space-y-3 text-sm">
            <div className="flex justify-between border-b border-rpg-silver/10 pb-2">
              <span className="text-rpg-silver flex items-center gap-2"><Swords className="w-4 h-4"/> Días de Rastreo:</span>
              <span className="font-bold text-rpg-bone">{lead.days_in_funnel} días</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rpg-silver flex items-center gap-2"><Target className="w-4 h-4"/> Asignado a:</span>
              <span className="font-bold text-rpg-gold">{lead.hunter_name || 'El Gremio (Sin asignar)'}</span>
            </div>
          </div>
        </div>

        </ModalBase>
    );
}