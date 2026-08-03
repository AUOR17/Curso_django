// frontend_spa/src/components/gremio/TablaCandidatos.tsx
import { apiDjango } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { Users, Sword, Wand2, Crosshair, Coins } from "lucide-react";
import type { Cazador } from "../../types";

// Modales que utiliza específicamente esta tabla
import ModalLiquidar from "../modales/ModalLiquidar";
import ModalReclutarParaSede from "../modales/ModalReclutarParaSede";

interface Props {
  cazadores: Cazador[];
  onRecargar: () => void;
}

export default function TablaCandidatos({ cazadores, onRecargar }: Props) {
  const { user } = useAuth();
  const { openModal, closeModal } = useModal();

  // Función local para los íconos (solo necesitamos los de clase mortal aquí)
  const getRoleIcon = (role: string) => {
    switch (role) {
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

  // Funciones de acción extraídas de tu Gremio.tsx
  const handleExpulsar = async (cazadorId: number, cazadorNombre: string) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas expulsar a ${cazadorNombre} del gremio?`,
      )
    )
      return;
    try {
      await apiDjango.post(`/usuarios/${cazadorId}/expulsar/`);
      onRecargar(); // Avisamos al padre que vuelva a buscar datos
    } catch (err) {
      console.error("Error al expulsar:", err);
      alert("Las deidades impidieron la expulsión.");
    }
  };

  const handleReclutarMaestro = async (cazadorId: number) => {
    try {
      await apiDjango.post(`/usuarios/${cazadorId}/reclutar/`);
      onRecargar();
    } catch (err) {
      console.error("Error al reclutar:", err);
      alert("El cazador rechazó tu oferta.");
    }
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-rpg-dark border-b border-rpg-blood/50">
          <th className="p-4 text-rpg-gold font-serif">Héroe</th>
          <th className="p-4 text-rpg-gold font-serif">Clase</th>
          <th className="p-4 text-rpg-gold font-serif text-center">Nivel</th>
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
              <span className="font-bold text-rpg-bone">
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

            <td className="p-4 text-right">
              <div className="flex items-center justify-end gap-3 text-rpg-gold font-bold">
                <span className="flex items-center gap-1">
                  {cazador.gold} <Coins className="w-4 h-4" />
                </span>

                <div className="flex gap-2 ml-4">
                  {/* RECLUTAR: Si el cazador NO tiene gremio */}
                  {!cazador.gremio_nombre && (
                    <>
                      {user?.role === "MAESTRO" && (
                        <button
                          onClick={() => handleReclutarMaestro(cazador.id)}
                          className="bg-blue-900/40 hover:bg-blue-700 text-blue-300 px-3 py-1 rounded text-xs border border-blue-500/30 transition-colors font-serif"
                        >
                          Reclutar
                        </button>
                      )}
                      {user?.role === "GRAN_MAESTRO" && (
                        <button
                          onClick={() =>
                            openModal(
                              <ModalReclutarParaSede
                                onClose={closeModal}
                                onSuccess={() => {
                                  onRecargar();
                                  closeModal();
                                }}
                                cazadorId={cazador.id}
                                cazadorNombre={cazador.username}
                              />,
                            )
                          }
                          className="bg-purple-900/40 hover:bg-purple-700 text-purple-300 px-3 py-1 rounded text-xs border border-purple-500/30 transition-colors font-serif"
                        >
                          Reclutar a Sede...
                        </button>
                      )}
                    </>
                  )}

                  {/* EXPULSAR: Si el cazador SÍ tiene gremio */}
                  {cazador.gremio_nombre && (
                    <>
                      {(user?.role === "GRAN_MAESTRO" ||
                        (user?.role === "MAESTRO" &&
                          cazador.gremio_id === user.gremio_id)) && (
                        <button
                          onClick={() =>
                            handleExpulsar(cazador.id, cazador.username)
                          }
                          className="bg-rpg-blood/40 hover:bg-red-700 text-red-300 px-3 py-1 rounded text-xs border border-red-500/30 transition-colors font-serif"
                        >
                          Expulsar
                        </button>
                      )}
                    </>
                  )}
                </div>

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
              colSpan={4}
              className="p-8 text-center text-rpg-silver/50 font-serif italic border-none"
            >
              El salón de los mortales está vacío...
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
