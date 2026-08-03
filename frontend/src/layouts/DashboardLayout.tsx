// frontend_spa/src/layouts/DashboardLayout.tsx
import { Link, useLocation, Outlet } from "react-router-dom";
/**
 -> Link:
      Es el reemplazo superpoderoso de la etiqueta clásica <a> de HTML.
      Cuando usas <Link to="/tablero">Ir al Tablero</Link>, le estás diciendo a React: "Cuando el 
      usuario haga clic aquí, cambia la URL de arriba y dibuja el componente del Tablero, pero 
      por favor no recargues la página entera, solo actualiza el pedazo de pantalla que cambió". 
      Esto hace que tu app se sienta rápida como un videojuego.

  ->useLocation:
      Es un gancho (hook) que funciona como un GPS o un radar.
      Te devuelve un objeto con información sobre en qué URL exacta está el usuario en ese momento. 
      Si el usuario está en tusitio.com/codice, useLocation sabrá que la ruta actual es /codice.
      ¿Para qué se usa mucho en un menú? ¡Para pintar el botón activo! Usas este radar para decirle 
      a React: "Si la ubicación actual es /codice, pinta el botón del Códice de color morado 
      brillante para que el usuario sepa dónde está parado; si no, déjalo gris".
 */
import { Map, ScrollText, Users, ShieldAlert, Tent } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import BotonSalida from "../components/botones/BotonSalida";

// Users (Usuarios): Dibuja la silueta de dos personas juntas.
// ShieldAlert (Escudo con Alerta):

// Users (Usuarios): Dibuja la silueta de dos personas juntas.
// ShieldAlert (Escudo con Alerta):

export default function DashboardLayout() {
  const location = useLocation();
  const { user } = useAuth();

  const baseMenuItems = [
    { name: "Tablero de Misiones", path: "/tablero", icon: Map },
    { name: "Códice (Leads)", path: "/leads", icon: ScrollText },
  ];

  /* 
  ¿Qué es? Es un arreglo ([]) que contiene una lista de objetos ({}). 
  Cada objeto representa un botón de tu menú de navegación.

  Las propiedades: Adentro de cada objeto defines el texto que verá el usuario (name), 
    la URL a la que lo vas a mandar cuando le dé clic (path, que se conecta directo con el 
    Link que vimos hace rato) y el componente visual que lo acompaña (icon, pasándole directamente 
    los íconos de Lucide que importaste).
  
  ¿Por qué es const? Porque estos son los botones "universales". Son las opciones mínimas a las 
  que absolutamente todos los usuarios de tu aplicación (sin importar si son novatos o maestros del 
  gremio) van a tener acceso. Esta lista base no se debe modificar.
   * 
   */

  let menuItems = [...baseMenuItems];

  /*
  Aquí es donde ocurre la magia de JavaScript.
    Ese símbolo de tres puntos ... se llama Operador de Propagación (Spread Operator).

  Imagina que baseMenuItems es una caja con dos libros. Al escribir [...baseMenuItems], le estás 
  diciendo a JavaScript: "Saca todos los libros de la caja original y mételos en esta nueva caja 
  llamada menuItems".

  ¿Por qué usar let? A diferencia de const (que es inmutable), let te permite modificar la variable 
  más adelante.

  El motivo real de todo esto: Estoy casi 100% seguro de que, justo debajo de esta línea en tu 
  código, tienes una validación (un if) que revisa qué tipo de usuario inició sesión.

  Al haber creado esta "copia de trabajo" modificable (menuItems), preparaste el terreno para hacer 
  algo como esto:

  "Si el usuario es el Líder del Gremio (Admin), agrégale a la caja de menuItems el botón de 
  'Configuración' y el botón de 'Usuarios'. Si es un jugador normal, no le agregues nada y 
  déjale solo los botones base".

Si hubieras trabajado directamente sobre baseMenuItems, habrías modificado el menú original para 
todos. Al usar [...baseMenuItems], haces un clon seguro que puedes manipular libremente dependiendo 
de quién esté usando la app en ese momento. ¡Es una práctica excelente de seguridad e interfaz de 
usuario!
  */

  // Si NO es el Gran Maestro, le damos su vista privada de "Mi Gremio"
  if (user?.role !== "GRAN_MAESTRO") {
    menuItems.push({
      name: "Mi Gremio",
      path: "/mi-gremio",
      icon: ShieldAlert,
    });
  }

  // El directorio global se queda para los que administran
  if (user?.role === "MAESTRO" || user?.role === "GRAN_MAESTRO") {
    menuItems.push({ name: "Directorio Global", path: "/gremio", icon: Users });
  }

  // Las sedes son exclusivas del dios del sistema
  if (user?.role === "GRAN_MAESTRO") {
    menuItems.push({ name: "Sedes y Alianzas", path: "/sedes", icon: Tent });
  }

  /*
  2. Para el diseño y el jugador (UX): ¡Importa muchísimo!
    El orden en el que escribiste tus if y tus .push() es el orden exacto de arriba hacia abajo 
    (o de izquierda a derecha) en el que van a aparecer los botones en la pantalla.

    Como el método .push() empuja los elementos al final de la lista, tu menú actualmente se 
    dibujaría en este orden exacto:

    * Tablero de Misiones (Viene del arreglo base)

    * Códice (Leads) (Viene del arreglo base)

    * Mi Gremio (Si es un jugador normal)

    * Directorio Global (Si es Maestro o Gran Maestro)

    * Sedes y Alianzas (Si es Gran Maestro)

  La Regla de Oro para ordenar menús:
  En el desarrollo de interfaces (UI/UX), siempre se recomienda seguir esta lógica visual:

  Lo más usado va arriba: El "Tablero de Misiones" es seguramente la pantalla principal donde los 
  usuarios van a pasar el 80% de su tiempo, por eso es perfecto que sea el número 1.

  Lo administrativo va al final: Opciones como "Sedes", "Configuración" o "Seguridad" suelen ir 
  hasta abajo porque no se usan todos los días.

  ¿Qué pasaría si quisieras cambiar el orden?
  Si algún día decides que, para el Gran Maestro, el botón de "Sedes y Alianzas" deba aparecer 
  hasta arriba del menú (antes que el Tablero), no podrías usar .push(). Tendrías que usar otro 
  método llamado .unshift(), el cual sirve para empujar un elemento al principio de la lista en 
  lugar de al fina
  */

  const iniciales = user?.username
    ? user.username.substring(0, 2).toUpperCase()
    : "TR";

  /* 
  El operador ternario se llama así porque tiene tres partes: 
  -> Condición ? Qué hacer si es Verdad : Qué hacer si es Falso.

    Vamos a desarmar tu línea pieza por pieza:

    La Condición (user?.username): Aquí le estás preguntando al sistema: "¿Existe el usuario Y 
    además tiene un nombre de usuario registrado?". (Ese signo de interrogación ?. es una red de 
    seguridad para que la app no explote si user llega a ser nulo).

    Si es VERDADERO (?):
    Si el jugador se llama "alucard", el código ejecuta la parte del medio: 
    user.username.substring(0, 2).toUpperCase().
      substring(0, 2): Toma la palabra "alucard" y la corta desde la posición 0 hasta la 2 
      (es decir, agarra las letras "al").

    toUpperCase(): Convierte esas letras a mayúsculas ("AL").

    Si es FALSO (:):
    Si por alguna razón el usuario no cargó, o su nombre está vacío, el código se salta la parte 
    del medio y ejecuta lo que está después de los dos puntos :. En este caso, devuelve el texto 
    por defecto 'TR' (que imagino usas como un avatar genérico).

    En resumen, esta línea sirve para generar el circulito del avatar en tu menú de navegación. 
    Si entra Alucard, dice AL; si entra Drácula, dice DR; y si algo falla, dice TR.
  */

  return (
    <div className="flex h-screen bg-rpg-dark text-rpg-parchment font-sans">
      <aside className="w-64 bg-[#141614] border-r border-rpg-blood/30 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-rpg-gold font-serif flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-rpg-blood" />
            Gremio RPG
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {/**{menuItems.map((item) => { ... })}
           * En React, casi nunca escribimos listas a mano. Tienes un arreglo llamado menuItems
           * (que contiene objetos con el nombre de la ruta, el ícono y la URL). La función
           * .map() recorre ese arreglo uno por uno. Por cada item que encuentra, ejecuta el código
           * que está adentro y "escupe" un botón en la pantalla.
           */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            {
              /**
              location.pathname: Es lo que dice la barra de direcciones de 
              tu navegador en este momento (ej. /codice).

              item.path: Es hacia dónde lleva el botón que se está fabricando 
              en esta iteración.
              Si ambos coinciden (isActive se vuelve true), significa que el 
              usuario está parado exactamente en esa pantalla.
              
              */
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-rpg-blood/20 text-rpg-gold border border-rpg-blood/50 shadow-[0_0_10px_rgba(130,23,21,0.2)]"
                    : "hover:bg-rpg-dark/50 text-rpg-silver hover:text-rpg-bone"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-rpg-blood/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-rpg-dark border-2 border-rpg-gold flex items-center justify-center font-bold text-rpg-gold">
              {iniciales}
            </div>
            <div className="overflow-hidden">
              <p className="truncate font-bold text-rpg-bone">
                {user?.username || "Fantasma"}
              </p>
              <p className="text-xs text-rpg-silver truncate">
                Nivel {user?.level || "?"} - {user?.role || "Desconocido"}
              </p>
            </div>
          </div>

          <div className="flex justify-center border-t border-rpg-blood/10 pt-3">
            <BotonSalida />
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-rpg-dark p-8">
        {/* Aquí es donde React inyecta tu Tablero, Gremio, etc. */}
        <Outlet />
      </main>
    </div>
  );
}
