// frontend_spa/src/pages/Tablero.tsx
import { useEffect, useState, useCallback } from "react";
import { apiDjango } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import ModalForjarMision from "../components/modales/ModalForjarMision";
import ColumnaQuest from "../components/quests/ColumnaQuest";
import TarjetaQuest from "../components/quests/TarjetaQuest";
import type { Quest } from "../types";

export default function Tablero() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { openModal, closeModal } = useModal();

  const fetchQuests = useCallback(async () => {
    try {
      const response = await apiDjango.get("/quests/tablero/");
      setQuests(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Fallo al traer las misiones", err);
      setError(
        "Los exploradores del Gremio no pudieron contactar a la bóveda central.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  // --- FUNCIÓN PARA QUE EL CAZADOR ACEPTE LA MISIÓN ---
  const aceptarMision = async (questId: number) => {
    if (!user) return;
    try {
      // Actualizamos la misión: cambiamos el estado y nos la asignamos
      await apiDjango.patch(`/quests/tablero/${questId}/`, {
        status: "EXPLORACION",
        assigned_to: user.id,
      });
      // Recargamos el tablero para ver los cambios
      fetchQuests();
    } catch (err) {
      console.error("Error al aceptar la misión:", err);
      alert("Alguien más ya tomó este encargo.");
    }
  };

  if (loading)
    return (
      <div className="text-xl text-rpg-blood animate-pulse font-serif p-8 flex justify-center h-full items-center">
        Invocando pergaminos...
      </div>
    );
  if (error)
    return (
      <div className="bg-rpg-blood/20 border border-rpg-blood text-rpg-parchment p-4 rounded-lg m-8">
        {error}
      </div>
    );

  // 1. Agrega esta función dentro de tu componente, antes del return:
  const handleDragStart = (e: React.DragEvent, questId: number) => {
    e.dataTransfer.setData("questId", questId.toString());
  };

  const reclamarRecompensa = async (questId: number) => {
    try {
      await apiDjango.post(`/quests/tablero/${questId}/reclamar_recompensa/`);
      // Recargamos el tablero. La misión desaparecerá y el oro se actualizará en la BD.
      fetchQuests();
    } catch (err) {
      console.error("Error al reclamar la recompensa:", err);
      alert("Los duendes del banco rechazaron la transacción.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necesario para permitir soltar objetos aquí
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const questId = e.dataTransfer.getData("questId");
    if (!questId) return;

    try {
      // Mandamos el cambio a Django
      await apiDjango.patch(`/quests/tablero/${questId}/`, {
        status: newStatus,
      });
      fetchQuests(); // Recargamos el tablero visualmente
    } catch (err) {
      console.error("Error al mover la misión", err);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <div className="flex justify-between items-center mb-6 border-b border-rpg-blood/30 pb-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-rpg-gold font-serif mb-1">
            Misiones Activas
          </h2>
          <p className="text-rpg-silver">
            Tablero de contratos y encargos del Gremio.
          </p>
        </div>

        {(user?.role === "MAESTRO" || user?.role === "GRAN_MAESTRO") && (
          <button
            onClick={() =>
              openModal(
                <ModalForjarMision
                  onClose={closeModal}
                  onSuccess={() => {
                    fetchQuests();
                    closeModal();
                  }}
                />,
              )
            }
            className="bg-rpg-blood text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors shadow-lg font-serif border border-rpg-gold/30"
          >
            + Forjar Misión
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-0">
        {/* COLUMNA 1: TABERNA */}
        <ColumnaQuest
          titulo="Taberna"
          icono="📜"
          status="TABERNA"
          colorAcento="blood"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {quests
            ?.filter((q) => q.status === "TABERNA")
            .map((quest) => (
              <TarjetaQuest
                key={quest.id}
                quest={quest}
                onDragStart={handleDragStart}
                onRecargar={fetchQuests}
                onAceptar={aceptarMision}
              />
            ))}
        </ColumnaQuest>

        {/* COLUMNA 2: EN COMBATE */}
        <ColumnaQuest
          titulo="En Combate"
          icono="⚔️"
          status="EXPLORACION"
          colorAcento="silver"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {quests
            ?.filter(
              (q) => q.status === "EXPLORACION" || q.status === "COMBATE",
            )
            .map((quest) => (
              <TarjetaQuest
                key={quest.id}
                quest={quest}
                onDragStart={handleDragStart}
                onRecargar={fetchQuests}
              />
            ))}
        </ColumnaQuest>

        {/* COLUMNA 3: TESORO */}
        <ColumnaQuest
          titulo="Tesoro (Victoria)"
          icono="🏆"
          status="TESORO"
          colorAcento="gold"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {quests
            ?.filter((q) => q.status === "TESORO")
            .map((quest) => (
              <TarjetaQuest
                key={quest.id}
                quest={quest}
                onDragStart={handleDragStart}
                onRecargar={fetchQuests}
                onLiquidar={reclamarRecompensa}
              />
            ))}
        </ColumnaQuest>
      </div>
      {/* 💥 Sin modales montados en el DOM — el ModalContext los maneja globalmente */}
    </div>
  );
}
