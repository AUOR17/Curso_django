import { useEffect, useState, useCallback } from "react";
/**
 * 1. El poder de useCallback (La memoria muscular de React)
Para entender useCallback, primero hay que entender un "problema" que tiene React.

Cada vez que un componente de React cambia (por ejemplo, cuando escribes algo en un input o abres un modal), 
el componente entero se vuelve a dibujar (re-renderiza). Cuando esto pasa, React destruye y vuelve a crear desde 
cero todas las funciones que están adentro de ese componente, aunque hagan exactamente lo mismo que hace un segundo.

Imagina que tu componente es un Herrero del gremio. Cada vez que le pides forjar una espada, él primero saca papel y pluma, 
y escribe desde cero el manual de "Cómo forjar una espada", la forja, y luego tira el manual. A la siguiente espada, vuelve 
a escribir el manual. ¡Es una pérdida de tiempo y recursos!

Aquí es donde entra useCallback:
Este gancho funciona como una libreta de apuntes. Le dice a React: "Oye, guarda esta función en tu memoria y no la vuelvas a 
crear a menos que cambien las variables que necesita para funcionar".

¿Cómo se ve en código?
Tiene una estructura muy parecida a useEffect (con su propio arreglo de dependencias [] al final):

const atacarMonstruo = useCallback(() => {
  console.log("¡Ataque con 50 de daño!");
}, []); // Ese [] significa: "Guarda esta función para siempre, nunca la vuelvas a crear"

¿Cuándo se usa?
No se usa para todas las funciones (escribir en la libreta también cuesta un poco de esfuerzo). Solo se usa cuando:

Tienes funciones muy pesadas o complejas.

Le estás pasando esa función como prop a un componente hijo (como un modal o un botón) y no quieres que el hijo se recargue a 
lo tonto cada vez que el padre hace un cambio menor

 */
import { apiDjango } from "../api/client";
import { Users, UserPlus, Crown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import type{ Cazador } from "../types";

// Modales del Salón General
import ModalNombrarMaestro from "../components/modales/ModalNombrarMaestro";

// Nuestras nuevas Tablas Refactorizadas ✨
import TablaCandidatos from "../components/gremio/TablaCandidatos";
import TablaMaestros from "../components/gremio/TablaMaestros";

export default function Gremio() {
  const [cazadores, setCazadores] = useState<Cazador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"CANDIDATOS" | "MAESTROS">(
    "CANDIDATOS",
  );

  const { user } = useAuth();
  const { openModal, closeModal } = useModal();

  const fetchGremio = useCallback(async () => {
    try {
      const response = await apiDjango.get("/gremio/");
      setCazadores(response.data);
    } catch (err) {
      console.error("Fallo al contactar al maestro:", err);
      setError("No se pudo cargar el registro de cazadores.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 1. ¿Por qué useEffect NO puede ser asíncrono?
      La regla de oro de React es que la función que le pasas directamente a un useEffect solo tiene permiso de devolver dos cosas:

      -> Nada (undefined).

      -> Una función de limpieza (Por ejemplo, para desconectar un chat o limpiar un temporizador cuando cierras la pantalla).

      El problema es que en JavaScript, cualquier función que lleve la palabra async automáticamente devuelve una Promesa (Promise).

      Si tú escribieras useEffect(async () => { ... }, []), React recibiría una Promesa en lugar de una función de limpieza, 
      se confundiría muchísimo y tu código lanzaría una advertencia o un error en la consola.

    2. ¿Por qué useCallback SÍ puede ser asíncrono?
      Porque useCallback no ejecuta la función, solo la "guarda en la memoria".

      A useCallback no le importa qué hace tu función, ni si devuelve una Promesa, un texto o un número. Su único trabajo es 
      tomar ese bloque de código asíncrono que escribiste, anotarlo en su libreta, y decir: "Listo, aquí está tu función 
      guardada para cuando quieras usarla".

    3. El combo perfecto (Tu código)
      Lo que estás haciendo en tu fragmento de código es la forma más elegante y profesional de 
      resolver este problema en React. Así es como trabajan en equipo:

      -> Paso 1 (La memoria): Usas useCallback para crear y memorizar tu función asíncrona (fetchGremio). Gracias a esto, 
      la función puede usar await cómodamente por dentro sin romper ninguna regla.

      -> Paso 2 (El gatillo): Creas un useEffect normalito, totalmente síncrono. Por dentro, simplemente mandas a llamar a 
      tu función memorizada (fetchGremio()). Como solo la estás llamando y no le estás diciendo al useEffect que 
      la devuelva con un return, React se queda completamente feliz.

      -> Paso 3 (La dependencia): Notas que al final del useEffect pusiste [fetchGremio]. Le estás diciendo a React: 
      "Ejecuta este efecto cada vez que la pantalla cargue, o si la función fetchGremio llega a cambiar en la memoria".
   */

  useEffect(() => {
    fetchGremio();
  }, [fetchGremio]);

  // --- LÓGICA DE FILTRADO PARA LAS TABLAS ---
  const cazadoresFiltrados = cazadores.filter((cazador) => {
    if (activeTab === "CANDIDATOS") {
      return (
        cazador.role !== "MAESTRO" &&
        cazador.role !== "GRAN_MAESTRO" &&
        !cazador.gremio_nombre
      );
    } else {
      return cazador.role === "MAESTRO" || cazador.role === "GRAN_MAESTRO";
    }
  });

  // Función para expulsar (Sin Modal, solo confirmación)
  const handleExpulsar = async (cazadorId: number, cazadorNombre: string) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas expulsar a ${cazadorNombre} del gremio?`,
      )
    )
      return;

    try {
      await apiDjango.post(`/usuarios/${cazadorId}/expulsar/`);
      fetchGremio(); // Recargamos la tabla
    } catch (err) {
      console.error("Error al expulsar:", err);
      alert("Las deidades impidieron la expulsión.");
    }
  };

  // Ordenamiento para la pestaña de Maestros (Gran Maestro arriba)
  if (activeTab === "MAESTROS") {
    cazadoresFiltrados.sort((a, b) => {
      if (a.role === "GRAN_MAESTRO" && b.role !== "GRAN_MAESTRO") return -1;
      if (a.role !== "GRAN_MAESTRO" && b.role === "GRAN_MAESTRO") return 1;
      return 0;
    });
  }

  if (loading)
    return (
      <div className="text-xl text-rpg-blood animate-pulse font-serif p-8">
        Desplegando el pergamino...
      </div>
    );
  if (error)
    return (
      <div className="bg-rpg-blood/20 border border-rpg-blood text-rpg-parchment p-4 rounded-lg m-8">
        {error}
      </div>
    );

  return (
    <div className="flex flex-col h-full relative">
      {/* --- CABECERA Y BOTONES SUPERIORES --- */}
      <div className="flex justify-between items-start mb-6 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-rpg-gold font-serif flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-rpg-blood" />
            Salón del Gremio
          </h2>
          <p className="text-rpg-silver">
            Registro oficial de cazadores, rangos y botín acumulado.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {user?.role === "GRAN_MAESTRO" && (
            <button
              onClick={() =>
                openModal(
                  <ModalNombrarMaestro
                    onClose={closeModal}
                    onSuccess={() => {
                      fetchGremio();
                      closeModal();
                    }}
                  />,
                )
              }
              className="bg-rpg-blood text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors shadow-lg font-serif border border-rpg-gold/30 flex items-center gap-2 text-sm"
            >
              <Crown className="w-4 h-4" /> Nombrar Maestro
            </button>
          )}

          <div className="bg-[#141614] border border-rpg-blood/30 px-4 py-2 rounded-lg text-center ml-2">
            <p className="text-xs text-rpg-parchment">Mostrando</p>
            <p className="text-xl font-bold text-rpg-gold">
              {cazadoresFiltrados.length}
            </p>
          </div>
        </div>
      </div>

      {/* --- NAVEGACIÓN DE PESTAÑAS --- */}
      <div className="flex gap-4 mb-4 border-b border-rpg-blood/20 pb-2">
        <button
          onClick={() => setActiveTab("CANDIDATOS")}
          className={`px-4 py-2 font-serif transition-colors rounded-t-lg ${activeTab === "CANDIDATOS" ? "bg-rpg-blood/20 text-rpg-gold border-b-2 border-rpg-gold" : "text-rpg-silver hover:text-rpg-bone hover:bg-rpg-dark/50"}`}
        >
          Candidatos (Mortales)
        </button>
        <button
          onClick={() => setActiveTab("MAESTROS")}
          className={`px-4 py-2 font-serif transition-colors rounded-t-lg ${activeTab === "MAESTROS" ? "bg-rpg-blood/20 text-rpg-gold border-b-2 border-rpg-gold" : "text-rpg-silver hover:text-rpg-bone hover:bg-rpg-dark/50"}`}
        >
          Maestros y Deidades
        </button>
      </div>

      {/* --- CONTENEDOR DE LA TABLA (Mágicamente modular) --- */}
      <div className="bg-[#141614] border border-rpg-blood/30 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(130,23,21,0.1)]">
        {activeTab === "CANDIDATOS" ? (
          <TablaCandidatos
            cazadores={cazadoresFiltrados}
            onRecargar={fetchGremio}
          />
        ) : (
          <TablaMaestros
            cazadores={cazadoresFiltrados}
            onRecargar={fetchGremio}
          />
        )}
      </div>
    </div>
  );
}
