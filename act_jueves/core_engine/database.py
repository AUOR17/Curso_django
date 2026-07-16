import sqlite3

from core_engine.models import Lead

DB_NAME = "crm_motor.db"

def iniciaizar_db():

    conexion = sqlite3.connect(DB_NAME)
    cursor = conexion.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            apellido TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            presupuesto REAL NOT NULL,
            estado TEXT NOT NULL,
            es_corporativo BOOLEAN NOT NULL,
            prioridad TEXT NOT NULL
        )
    ''')

    conexion.commit()
    conexion.close()

def guardar_lead(lead: Lead):

    conexion = sqlite3.connect(DB_NAME)
    cursor = conexion.cursor()

    try:
        cursor.execute('''
            INSERT INTO leads (nombre, apellido, email, presupuesto, estado, es_corporativo, prioridad)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''',(
            lead.nombre, 
            lead.apellido, 
            lead.email, 
            lead.presupuesto_estimado, 
            lead.estado, 
            lead.es_corporativo,
            lead.calcular_prioridad()
        ))
        conexion.commit()
        print(f"Exito al registrar al lead: {lead.email}")
    except sqlite3.IntegrityError:
        print(f"Aviso, el lead con email {lead.email} ya existe en la DB o BD")
        conexion.rollback()
    finally:
        conexion.close()