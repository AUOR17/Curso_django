// frontend_spa/src/components/gremio/TablaMaestros.tsx
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import {
  Shield,
  Crown,
  Tent,
  Coins,
  Sword,
  Wand2,
  Crosshair,
  Users,
} from "lucide-react";
import type { Cazador } from "../../types";

// Modales específicos para los líderes
import ModalAsignarGremio from "../modales/ModalAsignarGremio";
import ModalLiquidar from "../modales/ModalLiquidar";

interface Props {
  cazadores: Cazador[];
  onRecargar: () => void;
}

export default function TablaMaestros({ cazadores, onRecargar }: Props) {
  const { user } = useAuth();
  const { openModal, closeModal } = useModal();

  // Función local para los íconos (Aquí brillarán la Corona y el Escudo)
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "GRAN_MAESTRO":
        return <Crown className="w-4 h-4 text-purple-400" />;
      case "MAESTRO":
        return <Shield className="w-4 h-4 text-rpg-gold" />;
      case "GUERRERO":
        return <Sword className="w-4 h-4 text-rpg-silver" />;
      case "MAGO":
        return <Wand2 className="w-4 h-4 text-blue-400" />;
      case "PICARO":
        return <Crosshair className="w-4 h-4 text-green-400" />;
      default:
        return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-rpg-dark border-b border-rpg-blood/50">
          <th className="p-4 text-rpg-gold font-serif">Deidad / Líder</th>
          <th className="p-4 text-rpg-gold font-serif">Jerarquía</th>
          <th className="p-4 text-rpg-gold font-serif text-center">Nivel</th>
          {/* 👑 Columna exclusiva de esta tabla */}
          <th className="p-4 text-rpg-gold font-serif text-center">
            Sede / Gremio
          </th>
          <th className="p-4 text-rpg-gold font-serif text-right">
            Oro Acumulado
          </th>
        </tr>
      </thead>
      <tbody>
        {cazadores.map((cazador) => (
          <tr
            key={cazador.id}
            className="border-b border-rpg-blood/10 hover:bg-rpg-blood/5 transition-colors"
          >
            <td className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rpg-dark border border-rpg-blood flex items-center justify-center font-bold text-rpg-bone text-xs">
                {cazador.username.substring(0, 2).toUpperCase()}
              </div>
              <span
                className={`font-bold ${cazador.role === "GRAN_MAESTRO" ? "text-purple-400" : "text-rpg-gold"}`}
              >
                {cazador.username}
              </span>
            </td>

            <td className="p-4">
              <div className="flex items-center gap-2 text-sm text-rpg-silver">
                {getRoleIcon(cazador.role)}
                {cazador.role}
              </div>
            </td>

            <td className="p-4 text-center">
              <span className="bg-rpg-dark border border-rpg-silver/30 px-2 py-1 rounded text-xs text-rpg-bone">
                Lvl {cazador.level}
              </span>
            </td>

            {/* ZONA DE ASIGNACIÓN DE GREMIOS */}
            <td className="p-4 text-center">
              {cazador.role === "GRAN_MAESTRO" ? (
                <span className="text-purple-400/50 text-xs italic">
                  Omnipresente
                </span>
              ) : cazador.gremio_nombre ? (
                <span className="flex items-center justify-center gap-1 text-purple-300 text-sm">
                  <Tent className="w-4 h-4" /> {cazador.gremio_nombre}
                </span>
              ) : (
                <button
                  onClick={() =>
                    openModal(
                      <ModalAsignarGremio
                        onClose={closeModal}
                        onSuccess={() => {
                          onRecargar();
                          closeModal();
                        }}
                        maestroId={cazador.id}
                        maestroNombre={cazador.username}
                      />,
                    )
                  }
                  className="bg-purple-900/40 hover:bg-purple-800 text-purple-200 px-3 py-1 rounded border border-purple-500/30 text-xs transition-colors"
                >
                  Asignar Gremio
                </button>
              )}
            </td>

            <td className="p-4 text-right">
              <div className="flex items-center justify-end gap-3 text-rpg-gold font-bold">
                <span className="flex items-center gap-1">
                  {cazador.gold} <Coins className="w-4 h-4" />
                </span>

                {/* ZONA DE LIQUIDAR (Para el Gran Maestro) */}
                {user?.role === "GRAN_MAESTRO" && (
                  <button
                    onClick={() =>
                      openModal(
                        <ModalLiquidar
                          onClose={closeModal}
                          onSuccess={() => {
                            onRecargar();
                            closeModal();
                          }}
                          cazador={cazador}
                        />,
                      )
                    }
                    className="bg-green-900/40 hover:bg-green-700 text-green-300 px-2 py-1 rounded text-xs border border-green-500/30 transition-colors ml-2"
                  >
                    Liquidar
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}

        {cazadores.length === 0 && (
          <tr>
            <td
              colSpan={5}
              className="p-8 text-center text-rpg-silver/50 font-serif italic border-none"
            >
              Aún no hay líderes forjados en este reino...
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
