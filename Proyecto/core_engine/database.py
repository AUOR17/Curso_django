import sqlite3

def obtener_conexion():

    conexion = sqlite3.connect("partida_guardada.db")

    conexion.execute("PRAGMA foreign_keys = ON")
    return conexion

def iniciaizar_db():

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS gremios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre_gremio TEXT UNIQUE NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS personajes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT UNIQUE NOT NULL,
            salud_maxima INTEGER NOT NULL,
            tipo_clase TEXT NOT NULL, 

            puntos_armadura INTEGER DEFAULT 0,
            mana_maximo INTEGER DEFAULT 0,
            multiplicador_dano REAL DEFAULT 1.0,

            gremio_id INTEGER,
            FOREIGN KEY (gremio_id) REFERENCES gremios (id)          
        )
    ''')

    conexion.commit()
    conexion.close()