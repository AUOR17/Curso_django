import pytest
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),"..")))

from core_engine.models import Guerrero,Mago, JefeFinal, Gremio
from core_engine.database import iniciaizar_db, obtener_conexion

@pytest.fixture
def db_limpia():

    ruta_db ="partida_guardada.db"
    if os.path.exists(ruta_db):
        os.remove(ruta_db)

    iniciaizar_db()

    yield

    if os.path.exists(ruta_db):
        os.remove(ruta_db)

def test_encapsulamiento():

    kratos = Guerrero("Kratos", salud_maxima=100, puntos_armadura=20)

    kratos.salud = -5000
    assert kratos.salud == 0

    kratos.salud = 9999999
    assert kratos.salud == 100

@pytest.mark.parametrize("clase_personaje, nombre, salud_max, atributo_extra", [
    (Guerrero, "Arthur", 120, 50),
    (Mago, "Merlin", 80, 200),
    (JefeFinal, "Browser", 500, 1.5)
])
def test_creacion_personajes(clase_personaje, nombre, salud_max, atributo_extra):

    personaje_creado = clase_personaje(nombre, salud_max, atributo_extra)

    assert personaje_creado.nombre == nombre
    assert personaje_creado.salud_maxima == salud_max

    if isinstance(personaje_creado, Guerrero):
        assert personaje_creado.puntos_armadura == 50
    elif isinstance(personaje_creado, Mago):
        assert personaje_creado.mana_maximo == 200
    elif isinstance(personaje_creado, JefeFinal):
        assert personaje_creado.enfurecido == False
        assert personaje_creado.multiplicador_dano == 1.5

def test_guardar_cargar(db_limpia):

    gremio_nuevo = Gremio("Fairy Tail")
    natsu = Mago("Natsu", salud_maxima=150, mana_maximo=300)

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("INSERT INTO gremios (nombre_gremio) VALUES (?)", (gremio_nuevo.nombre_gremio,))
    gremio_id = cursor.lastrowid

    cursor.execute('''
        INSERT INTO personajes (nombre, salud_maxima, tipo_clase, mana_maximo, gremio_id)
        VALUES (?, ?, ?, ?, ?)
    ''', (natsu.nombre, natsu.salud_maxima, "Mago", natsu.mana_maximo, gremio_id))
    
    conexion.commit()

    cursor.execute('''
        SELECT p.nombre, g.nombre_gremio 
        FROM personajes p
        JOIN gremios g ON p.gremio_id = g.id
        WHERE p.nombre = 'Natsu'
    ''')
    resultado = cursor.fetchone()

    assert resultado is not None, "El personaje no se guardó en la DB"
    assert resultado[0] == "Natsu", "El nombre guardado es incorrecto"
    assert resultado[1] == "Fairy Tail", "La relación de Llave Foránea (Gremio) falló"
    
    conexion.close()