import psycopg2
from core_engine.database import inicializar_db, obtener_conexion
from core_engine.models import Guerrero, Mago, Gremio

def mostrar_gremios(cursor) -> bool:

    cursor.execute("SELECT id, nombre_gremio from gremios")
    gremios = cursor.fetchall()

    if not gremios:
        print("No existe ningun gremio.")
        return False
    
    for gremio  in gremios:
        print(f"{gremio[0]}, {gremio[1]}")
    return True

def fundar_gremio():
    nombre = input("Ingresa el nombre del gremio")
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    try:

        cursor.execute("INSERT INTO gremios (nombre_gremio) VALUES (%s)", (nombre,))
        conexion.commit()
        print(f"El gremio '{nombre}' fue creado.")
    except psycopg2.IntegrityError:
        print(f"Ya existe el gremio con el nombre '{nombre}'")
    except Exception as e:
        print(F"Error descnocido al fundar el gremio: {e}")
    finally:
        cursor.close()
        conexion.close()

def reclutar_aventurero():

    conexion = obtener_conexion()
    cursor = conexion.cursor()
    
    try:
        hay_gremios = mostrar_gremios(cursor)
        if not hay_gremios:
            print("Debes fundar un gremio antes de reclutar")
            return
        
        gremio_id = input("\nIngresa el ID del Gremio elegido: ")
        nombre = input("Nombre del aventurero: ")
        clase = input("Elige la clase (1 para Guerrero, 2 para Mago): ")

        if clase == '1':
            armadura = int(input("Puntos de armadura: "))
            nuevo_pj = Guerrero(nombre, salud_maxima=150, puntos_armadura=armadura)
            cursor.execute('''
                INSERT INTO personajes (nombre, salud_maxima, tipo_clase, puntos_armadura, gremio_id)
                VALUES (%s, %s, %s, %s, %s)
            ''', (nuevo_pj.nombre, nuevo_pj.salud_maxima, "Guerrero", nuevo_pj.puntos_armadura, gremio_id))
        elif clase == '2':
            mana = int(input("Puntos de maná máximo: "))
            nuevo_pj = Mago(nombre, salud_maxima=80, mana_maximo=mana)
            cursor.execute('''
                INSERT INTO personajes (nombre, salud_maxima, tipo_clase, mana_maximo, gremio_id)
                VALUES (%s, %s, %s, %s, %s)
            ''', (nuevo_pj.nombre, nuevo_pj.salud_maxima, "Mago", nuevo_pj.mana_maximo, gremio_id))
        else:
            print("Clase no reconocida. Cancelando reclutamiento.")
            return
        
        conexion.commit()

        print(f"{nuevo_pj.nombre} ha sido reclutado")

    except psycopg2.IndentationError:
        print(f"Ya existe un personaje llamado: {nombre}")
    except Exception as e:
        print(f"Error en el reclutamiento: {e}")
    finally:
        cursor.close()
        conexion.close()

def ver_taberna():
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    
    try:
        hay_gremios = mostrar_gremios(cursor)
        if not hay_gremios:
            return

        gremio_id = input("\n Ingresa el ID del Gremio para ver a sus miembros: ")

        cursor.execute('''
            SELECT p.nombre, p.salud_maxima, p.tipo_clase, p.puntos_armadura, p.mana_maximo, g.nombre_gremio
            FROM personajes p
            JOIN gremios g ON p.gremio_id = g.id
            WHERE g.id = %s
        ''', (gremio_id,))
        
        resultados = cursor.fetchall()
        
        if not resultados:
            print("La taberna está vacía o el ID del gremio es incorrecto.")
            return

        nombre_gremio = resultados[0][5]
        mi_gremio = Gremio(nombre_gremio)
        
        for fila in resultados:
            nombre, salud, tipo, armadura, mana, _ = fila
            
            if tipo == "Guerrero":
                pj = Guerrero(nombre, salud, armadura)
            elif tipo == "Mago":
                pj = Mago(nombre, salud, mana)
                
            mi_gremio.reclutar(pj)
            
        mi_gremio.listar_miembros()
    
    except Exception as e:
        print(f"Error al leer la base de datos: {e}")
    finally:
        cursor.close()
        conexion.close()

if __name__ == "__main__":
    try:
        while True:
            print("\n" + "="*50)
            print("GESTOR DE GREMIOS RPG (Conectado a Docker/Postgres)")
            print("="*50)
            print("1. Forjar el Mundo (Inicializar Base de Datos en el Servidor)")
            print("2. Fundar un nuevo Gremio (INSERT)")
            print("3. Reclutar Aventurero (INSERT con Llave Foránea)")
            print("4. Entrar a la Taberna del Gremio (SELECT y Reconstrucción POO)")
            print("5. Salir del Juego")
            print("="*50)
            
            opcion = input("Elige tu destino, viajero: ")

            if opcion == '1':
                inicializar_db()
            elif opcion == '2':
                fundar_gremio()
            elif opcion == '3':
                reclutar_aventurero()
            elif opcion == '4':
                ver_taberna()
            elif opcion == '5':
                print("\n[Sistema] Desconectando del servidor multijugador...")
                print(" Cerrando los portones de la taberna. ¡Hasta la próxima aventura! ")
                break
            else:
                print("Opción no válida en este reino.")
    except KeyboardInterrupt:
        print(f"Programa detenido por el usuario")

# docker exec -it rpg_python python main.py