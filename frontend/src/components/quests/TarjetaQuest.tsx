import { Edit2, Send, Coins, Shield, Swords } from "lucide-react";
import type { Quest } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";

// Modales que usa la tarjeta
import ModalEditarMision from "../modales/ModalEditarMision";
import ModalAsignarMision from "../modales/ModalAsignarMision";

interface TarjetaProps {
  quest: Quest;
  onDragStart: (e: React.DragEvent, id: number) => void;
  onRecargar: () => void;
  // Funciones opcionales dependiendo de la columna
  onAceptar?: (id: number) => void;
  onLiquidar?: (id: number) => void;
}

export default function TarjetaQuest({
  quest,
  onDragStart,
  onRecargar,
  onAceptar,
  onLiquidar,
}: TarjetaProps) {
  const { user } = useAuth();
  const { openModal, closeModal } = useModal();

  // --------------------------------------------------------
  // VARIANTE 1: TABERNA (Misiones Libres)
  // --------------------------------------------------------
  if (quest.status === "TABERNA") {
    return (
      <div
        draggable
        onDragStart={(e) => onDragStart(e, quest.id)}
        className="bg-[#1a1c1a] p-4 border-l-4 border-rpg-blood rounded shadow-[0_0_10px_rgba(130,23,21,0.2)] hover:border-rpg-gold transition-all group flex flex-col cursor-grab active:cursor-grabbing"
      >
        <div className="flex justify-between items-start mb-1 gap-2">
          <h5 className="text-rpg-bone font-bold leading-tight flex-1">
            {quest.title}
          </h5>

          {(user?.role === "GRAN_MAESTRO" || user?.role === "MAESTRO") && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() =>
                  openModal(
                    <ModalEditarMision
                      onClose={closeModal}
                      onSuccess={() => {
                        onRecargar();
                        closeModal();
                      }}
                      quest={quest}
                    />,
                  )
                }
                className="text-rpg-silver hover:text-rpg-gold p-1"
                title="Editar Misión"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              {user?.role === "GRAN_MAESTRO" && (
                <button
                  onClick={() =>
                    openModal(
                      <ModalAsignarMision
                        onClose={closeModal}
                        onSuccess={() => {
                          onRecargar();
                          closeModal();
                        }}
                        quest={quest}
                      />,
                    )
                  }
                  className="text-rpg-silver hover:text-purple-400 p-1"
                  title="Delegar a Gremio"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mb-2">
          {quest.gremio_nombre ? (
            <span className="bg-purple-900/40 text-purple-300 text-[10px] px-2 py-0.5 rounded border border-purple-500/30">
              ⛺ {quest.gremio_nombre}
            </span>
          ) : (
            <span className="bg-blue-900/40 text-blue-300 text-[10px] px-2 py-0.5 rounded border border-blue-500/30">
              🌍 Global
            </span>
          )}
        </div>

        <p className="text-xs text-rpg-silver mb-3 line-clamp-2">
          {quest.description}
        </p>

        <div className="flex justify-between items-center mt-auto border-t border-rpg-blood/20 pt-2">
          <span className="text-xs font-bold text-rpg-gold flex items-center gap-1">
            <Coins className="w-3 h-3" /> {quest.potential_reward}
          </span>
          {onAceptar && (
            <button
              onClick={() => onAceptar(quest.id)}
              className="bg-rpg-blood/80 hover:bg-rpg-blood text-xs text-white px-3 py-1 rounded transition-colors"
            >
              Aceptar
            </button>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // VARIANTE 2: EN COMBATE / EXPLORACIÓN (Misiones Activas)
  // --------------------------------------------------------
  if (quest.status === "EXPLORACION" || quest.status === "COMBATE") {
    return (
      <div
        draggable
        onDragStart={(e) => onDragStart(e, quest.id)}
        className="bg-[#1a1c1a] p-4 border-l-4 border-rpg-silver rounded shadow-lg group flex flex-col relative overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <div className="absolute top-0 right-0 bg-rpg-dark px-2 py-1 text-[10px] text-rpg-silver border-b border-l border-rpg-silver/20 rounded-bl">
          {quest.status}
        </div>
        <h5 className="text-rpg-silver font-bold group-hover:text-rpg-bone pr-12">
          {quest.title}
        </h5>

        <div className="my-1">
          {quest.gremio_nombre ? (
            <span className="text-purple-400 text-[10px]">
              ⛺ {quest.gremio_nombre}
            </span>
          ) : (
            <span className="text-blue-400 text-[10px]">🌍 Global</span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-rpg-parchment">
          <Shield className="w-3 h-3" /> {quest.assigned_to_details?.username}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // VARIANTE 3: TESORO (Misiones Completadas)
  // --------------------------------------------------------
  if (quest.status === "TESORO") {
    return (
      <div
        draggable
        onDragStart={(e) => onDragStart(e, quest.id)}
        className="bg-rpg-gold/10 p-4 border-l-4 border-rpg-gold rounded shadow-[0_0_10px_rgba(255,215,0,0.1)] group flex flex-col cursor-grab active:cursor-grabbing"
      >
        <h5 className="text-rpg-gold font-bold">{quest.title}</h5>
        <div className="flex justify-between items-center mt-3 border-t border-rpg-gold/20 pt-2">
          <span className="text-xs text-rpg-bone flex items-center gap-1">
            <Swords className="w-3 h-3" /> {quest.assigned_to_details?.username}
          </span>
          <span className="text-sm font-bold text-rpg-gold">
            +{quest.potential_reward}
          </span>
        </div>
        {(user?.role === "GRAN_MAESTRO" || user?.role === "MAESTRO") &&
          onLiquidar && (
            <button
              onClick={() => onLiquidar(quest.id)}
              className="mt-4 w-full bg-rpg-gold/20 hover:bg-rpg-gold/40 text-rpg-gold border border-rpg-gold/50 text-xs font-bold py-2 rounded transition-colors flex justify-center items-center"
            >
              💰 Liquidar Recompensa
            </button>
          )}
      </div>
    );
  }

  // Si por alguna razón la misión tiene un status extraño, no devuelve nada
  return null;
}
