// frontend_spa/src/pages/Codice.tsx
import { useEffect, useState, useCallback } from "react";
import { apiDjango } from "../api/client";
import { Target, UserPlus } from "lucide-react";
import { useModal } from "../context/ModalContext";
import ModalCrearMonstruo from "../components/modales/ModalCrearMonstruo";
import ModalDetalleMonstruo from "../components/modales/ModalDetalleMonstruo";
import MonsterCard from "../components/MonsterCard";
import type { Lead } from "../types";

export default function Codice() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { openModal, closeModal } = useModal();

  const fetchLeads = useCallback(async () => {
    try {
      const response = await apiDjango.get("/quests/leads/");
      setLeads(response.data);
    } catch (error) {
      console.error("Los cuervos no pudieron traer el códice", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  if (loading) {
    return (
      <div className="text-rpg-blood animate-pulse font-serif text-xl p-8">
        Consultando los tomos antiguos...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-start mb-8 border-b border-rpg-blood/30 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-rpg-gold font-serif flex items-center gap-3">
            <Target className="w-8 h-8 text-rpg-blood" />
            Códice de Objetivos (Leads)
          </h2>
          <p className="text-rpg-silver mt-2">
            Bestiario de presas identificadas y su nivel de amenaza.
          </p>
        </div>

        <button
          onClick={() =>
            openModal(
              <ModalCrearMonstruo
                onClose={closeModal}
                onSuccess={() => {
                  fetchLeads();
                  closeModal();
                }}
              />,
            )
          }
          className="bg-rpg-blood text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors shadow-lg font-serif border border-rpg-gold/30 flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Registrar Monstruo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {leads.map((lead) => (
          <MonsterCard
            key={lead.id}
            lead={lead}
            onInspect={(l) =>
              openModal(<ModalDetalleMonstruo onClose={closeModal} lead={l} />)
            }
          />
        ))}

        {leads.length === 0 && (
          <div className="col-span-full p-8 text-center border border-dashed border-rpg-silver/30 rounded-lg text-rpg-silver">
            No hay monstruos en el radar. Disfruta la paz mientras dure...
          </div>
        )}
      </div>
      {/* 💥 Sin modales montados en el DOM — el ModalContext los maneja globalmente */}
    </div>
  );
}
