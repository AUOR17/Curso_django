import { useEffect, useState, useCallback } from "react";
import { apiDjango } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Tent, Shield, MoreVertical } from "lucide-react";
import ModalFundarGremio from "../components/modales/ModalFundarGremio";
import ModalDetalleSede from "../components/modales/ModalDetalleSede";
import ModalEditarSede from "../components/modales/ModalEditarSede";
import type { Gremio } from "../types";
import { useModal } from "../context/ModalContext";

export default function Sedes() {
  const [gremios, setGremios] = useState<Gremio[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { openModal, closeModal } = useModal();

  const fetchGremios = useCallback(async () => {
    try {
      const response = await apiDjango.get("/sedes/");
      setGremios(response.data);
    } catch (error) {
      console.error("Error al cargar sedes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGremios();
  }, [fetchGremios]);

  if (loading)
    return (
      <div className="text-xl text-rpg-blood animate-pulse font-serif p-8">
        Inspeccionando el mapa continental...
      </div>
    );

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-start mb-6 border-b border-rpg-blood/30 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-purple-400 font-serif flex items-center gap-3 mb-2">
            <Tent className="w-8 h-8 text-purple-600" />
            Sedes y Alianzas
          </h2>
          <p className="text-rpg-silver">
            Registro central de todos los Gremios fundados en el reino.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              openModal(
                <ModalFundarGremio
                  onClose={closeModal}
                  onSuccess={() => {
                    fetchGremios();
                    closeModal();
                  }}
                />,
              )
            }
            className="bg-purple-900/50 text-purple-200 px-4 py-2 rounded-md hover:bg-purple-800 transition-colors shadow-lg font-serif border border-purple-500/30 flex items-center gap-2"
          >
            <Tent className="w-5 h-5" />
            Fundar Gremio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gremios.map((gremio) => (
          <div
            key={gremio.id}
            onClick={() =>
              openModal(
                <ModalDetalleSede
                  onClose={closeModal}
                  gremioId={gremio.id}
                  gremioNombre={gremio.nombre}
                />,
              )
            }
            className="bg-[#141614] border border-purple-500/30 rounded-lg p-5 shadow-[0_0_15px_rgba(147,51,234,0.1)] hover:border-purple-500 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all cursor-pointer transform hover:-translate-y-1 relative group"
          >
            <div className="flex justify-between items-start mb-3 border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-rpg-bone font-serif">
                  {gremio.nombre}
                </h3>
              </div>

              {user?.role === "GRAN_MAESTRO" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(
                      <ModalEditarSede
                        onClose={closeModal}
                        onSuccess={() => {
                          fetchGremios();
                          closeModal();
                        }}
                        gremio={gremio}
                      />,
                    );
                  }}
                  className="text-rpg-silver hover:text-purple-400 p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              )}
            </div>

            <p className="text-sm text-rpg-silver h-16 overflow-hidden">
              {gremio.descripcion ||
                "Un misterioso gremio sin descripción oficial en los registros..."}
            </p>
          </div>
        ))}

        {gremios.length === 0 && (
          <div className="col-span-full p-8 text-center border border-dashed border-purple-500/30 rounded-lg text-purple-300/50">
            No hay Gremios fundados aún. El reino espera a su primer líder.
          </div>
        )}
      </div>
      {/* 💥 Sin modales montados en el DOM — el ModalContext los maneja globalmente */}
    </div>
  );
}
