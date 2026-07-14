import json

with open('users.json', 'r', encoding='utf-8') as archivo:
    usuarios = json.load(archivo)

usuarios_limpios = []

for u in usuarios:

    nombre = u['name']
    correo = u['email']
    empresa = u['company']['name']
    ciudad = u['address']['city']
    cp = u['address']['zipcode']

    perfil_marketing = {
        "Nombre Completo": nombre, 
        "Email de contacto": correo, 
        "Compañia": empresa, 
        "Ubicacion": ciudad, 
        "CP":cp
    }

    usuarios_limpios.append(perfil_marketing)

# print(f"Vistazo del primer registro: \n{usuarios_limpios[0]}")

with open('marketing_profile.json', 'w', encoding='utf-8') as archivo_nuevo:
    json.dump(usuarios_limpios, archivo_nuevo, indent=2, ensure_ascii=False)
