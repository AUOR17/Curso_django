import { useEffect, useState, useCallback } from "react";
import { apiDjango } from "../api/client";
import {
  Shield,
  Coins,
  ArrowDownAZ,
  SortDesc,
  UserMinus,
  UserPlus,
} from "lucide-react";
import type { Cazador } from "../types";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import ModalDetalleCazador from "../components/modales/ModalDetalleCazador";
import ModalReclutarCazador from "../components/modales/ModalReclutarCazador";

export default function MiGremio() {
  const [compañeros, setCompañeros] = useState<Cazador[]>([]);
  const [loading, setLoading] = useState(true);
  const [orden, setOrden] = useState<"nivel" | "oro" | "alfabetico">("nivel");

  const { user } = useAuth();
  const { openModal, closeModal } = useModal();

  const fetchMiGremio = useCallback(() => {
    setLoading(true);
    apiDjango
      .get("/mi-gremio/")
      .then((res) => setCompañeros(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchMiGremio();
  }, [fetchMiGremio]);

  const handleExpulsar = async (
    e: React.MouseEvent,
    cazadorId: number,
    cazadorNombre: string,
  ) => {
    e.stopPropagation();

    if (
      !window.confirm(
        `¿Estás seguro de que deseas desterrar a ${cazadorNombre} de la sede?`,
      )
    )
      return;

    try {
      await apiDjango.post(`/usuarios/${cazadorId}/expulsar/`);
      setCompañeros((prev) => prev.filter((c) => c.id !== cazadorId));
    } catch (err) {
      console.error(err);
      alert("Las deidades impidieron la expulsión.");
    }
  };

  const compañerosOrdenados = [...compañeros].sort((a, b) => {
    if (orden === "nivel") return b.level - a.level;
    if (orden === "oro") return parseFloat(b.gold) - parseFloat(a.gold);
    if (orden === "alfabetico") return a.username.localeCompare(b.username);
    return 0;
  });

  if (loading)
    return (
      <div className="p-8 text-rpg-blood animate-pulse font-serif">
        Buscando a tus compañeros...
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-6 border-b border-rpg-blood/30 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-rpg-gold font-serif flex items-center gap-3">
            <Shield className="w-8 h-8 text-rpg-blood" />
            Mis Compañeros de Armas
          </h2>
          <p className="text-rpg-silver mt-2">
            Los cazadores que luchan hombro a hombro contigo.
          </p>
        </div>

        {/* 👇 3. CONTENEDOR DERECHO: Botón y Filtros agrupados */}
        <div className="flex flex-col items-end gap-4">
          {/* EL BOTÓN DE RECLUTAR (Solo visible para Maestros) */}
          {user?.role === "MAESTRO" && (
            <button
              onClick={() =>
                openModal(
                  <ModalReclutarCazador
                    onClose={closeModal}
                    onSuccess={() => {
                      fetchMiGremio();
                      closeModal();
                    }}
                  />,
                )
              }
              className="bg-rpg-blood text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors shadow-lg font-serif border border-rpg-gold/30 flex items-center gap-2 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Reclutar Cazador
            </button>
          )}

          {/* CONTROLES DE FILTRO */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-rpg-silver font-bold uppercase tracking-wider">
              Ordenar por:
            </label>
            <div className="flex bg-[#141614] border border-rpg-blood/30 rounded-lg overflow-hidden">
              <button
                onClick={() => setOrden("nivel")}
                className={`px-4 py-2 text-sm flex items-center gap-2 transition-colors ${orden === "nivel" ? "bg-rpg-blood text-white" : "text-rpg-silver hover:bg-rpg-dark"}`}
              >
                <SortDesc className="w-4 h-4" /> Nivel
              </button>
              <button
                onClick={() => setOrden("oro")}
                className={`px-4 py-2 text-sm flex items-center gap-2 border-l border-rpg-blood/30 transition-colors ${orden === "oro" ? "bg-rpg-blood text-white" : "text-rpg-silver hover:bg-rpg-dark"}`}
              >
                <Coins className="w-4 h-4" /> Botín
              </button>
              <button
                onClick={() => setOrden("alfabetico")}
                className={`px-4 py-2 text-sm flex items-center gap-2 border-l border-rpg-blood/30 transition-colors ${orden === "alfabetico" ? "bg-rpg-blood text-white" : "text-rpg-silver hover:bg-rpg-dark"}`}
              >
                <ArrowDownAZ className="w-4 h-4" /> Nombre
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {compañerosOrdenados.map((c) => (
          <div
            key={c.id}
            onClick={() =>
              openModal(
                <ModalDetalleCazador onClose={closeModal} cazador={c} />,
              )
            }
            className="bg-[#141614] border border-rpg-blood/20 rounded-lg p-5 flex items-center justify-between hover:border-rpg-blood/60 transition-all cursor-pointer group shadow-sm hover:shadow-rpg-blood/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rpg-dark border-2 border-rpg-blood flex items-center justify-center font-bold text-rpg-gold text-lg">
                {c.username.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-rpg-bone group-hover:text-rpg-gold transition-colors">
                  {c.username}
                </h3>
                <p className="text-sm text-rpg-silver">
                  {c.role} • Nvl {c.level}
                </p>
                <p className="text-xs text-rpg-gold mt-1 flex items-center gap-1">
                  <Coins className="w-3 h-3" /> {c.gold}
                </p>
              </div>
            </div>

            {/* Botón de expulsar (Solo visible para el Maestro) */}
            {user?.role === "MAESTRO" && (
              <button
                onClick={(e) => handleExpulsar(e, c.id, c.username)}
                className="opacity-0 group-hover:opacity-100 bg-rpg-blood/10 hover:bg-red-900/80 text-red-400 p-2 rounded border border-red-900/50 transition-all"
                title="Desterrar del Gremio"
              >
                <UserMinus className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        {compañeros.length === 0 && (
          <div className="col-span-full text-center p-8 text-rpg-silver italic border border-dashed border-rpg-blood/30 rounded-lg">
            Parece que eres el único lobo solitario en esta sede... o aún no
            tienes gremio.
          </div>
        )}
      </div>
    </div>
  );
}
