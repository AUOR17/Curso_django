import json

with open('users.json', 'r', encoding='utf-8') as archivo:
    usuarios = json.load(archivo)

usuarios_limpios = []

for u in usuarios:

    nombre = u['name']
    latitud = u['address']['geo']['lat']
    longitud = u['address']['geo']['lng']
    ciudad = u['address']['city']
    telefono = u['phone']
    pagina = u['website']

    perfil_marketing = {
        "Nombre Completo": nombre, 
        "Latitud": latitud, 
        "Longitud": longitud, 
        "Ubicacion": ciudad, 
        "Telefono": telefono, 
        "Pagina Web": pagina
    }

    usuarios_limpios.append(perfil_marketing)

# print(f"Vistazo del primer registro: \n{usuarios_limpios[0]}")

with open('Geolocalizacion.json', 'w', encoding='utf-8') as archivo_nuevo:
    json.dump(usuarios_limpios, archivo_nuevo, indent=2, ensure_ascii=False)
