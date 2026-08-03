import type { ReactNode } from "react";

interface ColumnaProps {
  titulo: string;
  icono: ReactNode;
  status: "TABERNA" | "EXPLORACION" | "COMBATE" | "TESORO";
  colorAcento: "blood" | "silver" | "gold";
  onDrop: (e: React.DragEvent, status: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  children: ReactNode;
}

// Un diccionario para centralizar los colores y bordes de Tailwind
const estilosAcento = {
  blood: {
    contenedor: "bg-[#141614]/50 border-rpg-blood/20",
    titulo: "text-rpg-blood border-rpg-blood/30",
  },
  silver: {
    contenedor: "bg-rpg-dark/50 border-rpg-silver/20", // Se ajustó a silver para mantener consistencia
    titulo: "text-rpg-silver border-rpg-silver/30",
  },
  gold: {
    contenedor: "bg-rpg-dark/50 border-rpg-gold/20",
    titulo: "text-rpg-gold border-rpg-gold/30",
  },
};

export default function ColumnaQuest({
  titulo,
  icono,
  status,
  colorAcento,
  onDrop,
  onDragOver,
  children,
}: ColumnaProps) {
  const estilo = estilosAcento[colorAcento];

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
      className={`${estilo.contenedor} border p-4 rounded-lg flex flex-col min-h-0 overflow-hidden`}
    >
      <h4
        className={`${estilo.titulo} font-serif text-xl border-b mb-4 pb-2 flex items-center gap-2 shrink-0`}
      >
        <span>{icono}</span> {titulo}
      </h4>
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {children}
      </div>
    </div>
  );
}
