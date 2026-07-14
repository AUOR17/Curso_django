texto_sucio = "     Hola, a     todos     "

# print(f"Texto original: {texto_sucio}")
# print(f"Uso de lstrip(): {texto_sucio.lstrip()}")
# print(f"Uso de rstrip(): {texto_sucio.rstrip()}")
# print(f"Uso de strip(): {texto_sucio.strip()}")

saludo = "Hola gatos, adios gatos"
# print(f"Texto original: {saludo}")
# print(f"Uso de replace(): {saludo.replace('gatos', 'perros')}")
# print(f"Uso de replace() con count: {saludo.replace('gatos', 'perros', 1)}")

csv = "manzana,pera,platanao,uva"
# print(f"Texto original: {csv}")

lista_frutas = csv.split(",")
# print(f"Lista de frutas: {lista_frutas}")
# print(f"Tipo de dato de lista_frutas: {type(lista_frutas)}")

conector = "-"
texto_unido = conector.join(lista_frutas)
# print(f"Texto unido: {texto_unido}")
# print(f"Tipo de dato de texto_unido: {type(texto_unido)}")

texto_lineas = "Línea 1\nLínea 2\nLínea 3"
# print(f"Texto original:\n{texto_lineas}")
lineas = texto_lineas.splitlines()
# print(f"Uso de splitlines(): {lineas}")
# print(f"Tipo de dato de lineas: {type(lineas)}")

frase = "En un lugar de la Mancha, de cuyo nombre no quiero acordarme ..."

# print(f"Texto original: {frase}")
# print(f"Uso de find(): {frase.find('lugar')}")
# print(f"Uso de count(): {frase.count('de')}")
# print(f"Uso de index(): {frase.index('Mancha')}")
# print(f"Uso de startswith(): {frase.startswith('En un lugar')}")
# print(f"Uso de endswith(): {frase.endswith('acordarme ...')}")

# print("'12345'.isdigit():", '12345'.isdigit()) # ¿Son todos los caracteres numéricos?
# print("'Hola'.isalpha():", 'Hola'.isalpha()) # ¿Son todos los caracteres letras?
# print("'Hola123'.isalnum():", 'Hola123'.isalnum()) # ¿Son todos los caracteres letras o números?
# print("'Hola mundo'.isspace():", 'Hola mundo'.isspace()) # ¿Son todos los caracteres espacios en blanco?
# print("'Hola mundo'.istitle():", 'Hola mundo'.istitle()) # ¿Está en formato de título?
# print("'Hola mundo'.isupper():", 'Hola mundo'.isupper()) # ¿Está en formato de mayúsculas?
# print("'Hola mundo'.islower():", 'Hola mundo'.islower()) # ¿Está en formato de minúsculas?


def procesar_datos(tabla: dict) -> list:
    """
    Esta funcion recibe una tabla de datos crudos y estandariza los formatos. 

    Parametros:
    tabla (list): Lista de diccionarios con los datos crudos.

    Retorna:
    list: Lista de diccionarios con los datos estandarizados.
    """
    pass

# print(f"Documentación de la función procesar_datos(): {procesar_datos.__doc__}")
STATUS = "activo"
# query_sql = F"""
# SELECT id_usuario,nombre,fecha_registro
# FROM usuarios
# WHERE estado = '{STATUS}'
# ORDER BY fecha_registro DESC;
# """
query_sql = F"""
SELECT id_usuario,nombre,fecha_registro
FROM usuarios
WHERE estado = '{STATUS}'
ORDER BY fecha_registro DESC;
"""

# print(f"Consulta SQL:\n{query_sql}")

ruta_archivo = "C:\\Users\\TRpad08\\Documents\\Codigo\\Curso_django\\data\\usuarios.csv"
# print(f"Ruta del archivo: {ruta_archivo}")

ruta_archivo_raw = r"C:\Users\TRpad08\Documents\Codigo\Curso_django"
# print(f"Ruta del archivo raw: {ruta_archivo_raw}")

id_usario = "45"
id_producto = "1642"
# print(f"ID original: {id_usario} -> ID formateado: {id_usario.zfill(7)}")
# print(f"ID original: {id_producto} -> ID formateado: {id_producto.zfill(7)}")

for i in range(1, 11):
    # print(f"Número original: {i} -> Número formateado: {str(i).zfill(3)}")
    pass

correo = "usuario@dominio.com"
usuario, arroba, dominio = correo.partition("@")

# print(f"Correo original: {correo}")
# print(f"Usuario: {usuario}")
# print(f"Arroba: {arroba}")
# print(f"Dominio: {dominio}")

correo_falso = "usuario_dominio.com"

u,a,d = correo_falso.partition("@")
print(f"Correo original: {correo_falso}")
# print(f"Usuario: {u}")
# print(f"Arroba: {a}")
# print(f"Dominio: {d}")