from core_engine.database import iniciaizar_db, obtener_conexion
from core_engine.models import Guerrero, Mago, Gremio

def fundar_gremio():

    nombre = input("Ingresa el nombre dle nuevo gremio: ")
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        cursor.execute("INSERT INTO gremios (nombre_gremio) VALUES (?)", (nombre,))
        conexion.commit()
        print(f"El gremio {nombre} ha sido fundado correctamente")
    except Exception as e:
        print(f"Error al fundar gremio: {e}")
    finally:
        conexion.close()

def reclutar_aventurero():

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:

        hay_gremios = mostrar_gremios_disponibles(cursor)

        if not hay_gremios:
            print(f"Se debe de fundar un gremio")
            return
        
        gremio_id = input("\n Ingresa el ID del gremio elegido: ")
        nombre = input("Nombre del aventurero: ")
        clase = input("Elige la clase del aventurero (! para Guerrero y 2 para Mago)")

        if clase == "1":
            armadura = int(input("Ingresa los puntos de armadura"))
            nuevo_pj = Guerrero(nombre, salud_maxima=150, puntos_armadura=armadura)
            cursor.execute('''
                INSERT INTO personajes (nombre, salud_maxima, tipo_clase, puntos_armadura, gremio_id)
                VALUES (?, ?, ?, ?, ?)
            ''', (nuevo_pj.nombre, nuevo_pj.salud_maxima, "Guerrero", nuevo_pj.puntos_armadura, gremio_id))
        elif clase == "2":
            mana = int(input("Puntos de mana maximo: "))
            nuevo_pj = Mago(nombre, salud_maxima=80, mana_maximo=mana)
            cursor.execute('''
                INSERT INTO personajes (nombre, salud_maxima, tipo_clase, mana_maximo, gremio_id)
                VALUES (?, ?, ?, ?, ?)
            ''', (nuevo_pj.nombre, nuevo_pj.salud_maxima, "Mago", nuevo_pj.mana_maximo, gremio_id))
        else:
            print(f"No se reconoce la clase, cancelando reclutamienti")
            return
        
        conexion.commit()
        print(f"Nuevo personaje {nuevo_pj.nombre} ha sido creado y reclutado")
    
    except Exception as e:
        print(f"Error en reclitar: {e}")
    finally:
        conexion.close()

def mostrar_gremios_disponibles(cursor) -> bool:

    cursor.execute("SELECT id, nombre_gremio FROM gremios")
    gremios = cursor.fetchall()

    if not gremios:
        print("No existe ningun gremio, se debe fundar uno")
        return False
    
    for gremio in gremios:
        print(f"[{gremio[0]}] {gremio[1]}")
    return True

def ver_taberna():

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:
        hay_gremios = mostrar_gremios_disponibles(cursor)

        if not hay_gremios:
            print(f"Se debe de fundar un gremio")
            return
        
        gremio_id = input("\n Ingresa el ID del gremio elegido para ver sus miembros: ")

        cursor.execute('''
            SELECT p.nombre, p.salud_maxima, p.tipo_clase, p.puntos_armadura, p.mana_maximo, g.nombre_gremio
            FROM personajes p
            JOIN gremios g ON p.gremio_id = g.id
           WHERE g.id = ?
        ''', (gremio_id,))

        resultados = cursor.fetchall()
        print(resultados)

        if not resultados:
            print("La taberna esta vacia")
            return
        
        nombre_gremio = resultados[0][5]
        mi_gremio = Gremio(nombre_gremio)

        for fila in resultados:
            nombre, salud, tipo, armadura, mana, _ = fila

            if tipo == Guerrero:
                pj = Guerrero(nombre, salud, armadura)
            elif tipo == "Mago":
                pj = Mago(nombre, salud, mana)

            mi_gremio.reclutar(pj)

        mi_gremio.listar_miembros()

    except Exception as e:
        print(f"Error al leer la base de datos: {e}")

    finally:
        conexion.close()

if __name__ == '__main__':

    try:
        while True:
            print("\n" + "="*50)
            print("Consola interactiva")
            print("="*50)

            print("1. Crear la base de datos desde 0 (Oprima 1)")
            print("2. Fundar un gremio (Oprima 2)")
            print("3. Reclutar Aventurero (Oprima 3)")
            print("4. Entrar a la taberna (Oprima 4)")
            print("5. Salir del juego (Oprima 5)")
            print("="*50)

            opcion = input("Elegie una opcion: ")

            match opcion:
                case '1':
                    iniciaizar_db()
                    print("La base de datos ha sido inicializada")
                case '2':
                    fundar_gremio()
                case '3':
                    reclutar_aventurero()
                case '4':
                    ver_taberna()
                case '5':
                    print(f"Guardando partida")
                    print(f"Cerrando aplicacion")
                    break
                case _:
                    print("Opcion no valida")

    except KeyboardInterrupt:
        print("Programa detenido por el usuario")