// frontend_spa/src/components/MonsterCard.tsx
import { useState, useEffect, useRef } from "react";
import { Skull, Coins } from "lucide-react";
import type { Lead } from "../types";

interface MonsterCardProps {
  lead: Lead;
  onInspect: (lead: Lead) => void;
}

export default function MonsterCard({ lead, onInspect }: MonsterCardProps) {
  const [isSpinning, setIsSpinning] = useState(false);

  const timer1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timer2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // La función que retornas dentro de un useEffect se ejecuta ÚNICAMENTE
    // cuando el componente está a punto de ser destruido (desmontado).
    return () => {
      if (timer1Ref.current) clearTimeout(timer1Ref.current);
      if (timer2Ref.current) clearTimeout(timer2Ref.current);
    };
  }, []);

  const handleClick = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    // 4️⃣ Guardamos el ID del temporizador en la referencia

    /*
    setTimeout(() => { ... }, 800);
    La función nativa setTimeout en JavaScript siempre recibe dos cosas obligatorias:

    Una función (qué es lo que va a ejecutar).

    Un número (cuánto tiempo va a esperar antes de ejecutarlo).

    Ese () => { ... } que ves ahí es una función flecha anónima. Es como decirle a JavaScript: 
    "Oye, te voy a dar este bloque de código encapsulado, pero no lo ejecutes ahorita, guárdalo y 
    ejecútalo cuando se acabe el tiempo". No pide argumentos (por eso los paréntesis () están vacíos) 
    porque su único trabajo es disparar lo que tiene adentro cuando el reloj llega a cero.

    */
    timer1Ref.current = setTimeout(() => {
      onInspect(lead);

      timer2Ref.current = setTimeout(() => setIsSpinning(false), 300);
    }, 800);
  };

  return (
    <div
      className="relative w-full cursor-pointer group"
      style={{ perspective: "1000px" }}
      onClick={handleClick}
    >
      <div
        className="w-full bg-[#141614] border border-rpg-blood/40 rounded-lg p-5 shadow-[0_0_15px_rgba(130,23,21,0.1)] group-hover:border-rpg-blood flex flex-col transition-all ease-in-out"
        style={{
          transform: isSpinning
            ? "rotateY(1080deg) scale(0.95)"
            : "rotateY(0deg) scale(1)",
          transitionDuration: isSpinning ? "800ms" : "0ms",
        }}
      >
        <div className="flex justify-between items-start mb-4 gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-rpg-bone font-serif leading-tight group-hover:text-rpg-gold transition-colors line-clamp-2">
              {lead.name}
            </h3>
            <p className="text-sm text-rpg-silver mt-1 line-clamp-1">
              {lead.race_class}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-rpg-dark/50 p-3 rounded flex flex-col items-center border border-rpg-blood/10">
            <Skull className="w-5 h-5 text-rpg-blood mb-1" />
            <span className="font-bold text-rpg-bone text-lg">
              {lead.threat_level}%
            </span>
          </div>
          <div className="bg-rpg-dark/50 p-3 rounded flex flex-col items-center border border-rpg-gold/10">
            <Coins className="w-5 h-5 text-rpg-gold mb-1" />
            <span className="font-bold text-rpg-bone text-sm">
              ${lead.estimated_reward}
            </span>
          </div>
        </div>

        <p className="text-xs text-center text-rpg-silver/50 italic mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Click para inspeccionar...
        </p>
      </div>
    </div>
  );
}
