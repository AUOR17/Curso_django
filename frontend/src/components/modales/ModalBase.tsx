import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalBaseProps {
  onClose: () => void;
  icon: ReactNode;
  title: string;
  accentColor?: 'blood' | 'gold' | 'purple' | 'green';
  children: ReactNode;
  maxWidth?: string;
  subtitle?: string; 
}

const colorMap = {
  blood:  { border: 'border-rpg-blood/50',  header: 'border-rpg-blood/30',  shadow: 'shadow-[0_0_30px_rgba(130,23,21,0.3)]',  hover: 'hover:text-rpg-blood'  },
  gold:   { border: 'border-rpg-gold/50',   header: 'border-rpg-gold/30',   shadow: 'shadow-[0_0_30px_rgba(255,215,0,0.2)]',  hover: 'hover:text-rpg-gold'   },
  purple: { border: 'border-purple-500/50', header: 'border-purple-500/30', shadow: 'shadow-[0_0_30px_rgba(147,51,234,0.3)]', hover: 'hover:text-purple-400' },
  green:  { border: 'border-green-500/50',  header: 'border-green-500/30',  shadow: 'shadow-[0_0_30px_rgba(34,197,94,0.2)]',  hover: 'hover:text-green-400'  },
};

export default function ModalBase ({
    onClose,
    icon,
    title,
    accentColor = 'blood', 
    maxWidth = 'max-w-md',
    subtitle,
    children
}: ModalBaseProps){
    const c = colorMap[accentColor];

    return(
       <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className={`bg-[#1411614] border ${c.border} rounded-xl ${c.shadow} w-full ${maxWidth ?? 'max-w-md'} relative flex flex-col max-h-[900vh]`}>

                <button onClick={onClose} className={`absolute top-4 right-4 text-rpg-silver ${c.hover} transition-colors z-10`}>
                    <X className='w-6 h-6'/>
                </button>

                <div className={`p-6 border-b ${c.header}`}>
                    <div className='flex items-center gap-3'>
                        {icon}
                        <h2 className='text-2x1 font-bold text-rpg-bone font-serif'>{title}</h2>
                    </div>

                    {subtitle && (
                        <p className='text-sm text-rpg-silver/70 mt-1 ml-9 font-serif'>
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className='p-6 overflow-y-auto custom-scrollbar'>
                    {children}
                </div>

            </div>
       </div> 
    );
}