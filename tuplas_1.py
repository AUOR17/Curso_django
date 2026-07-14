"""
Crear una tupla de estados de Leads donde se puedan agregar elementos a la tupla.

asi mismo, usen un ciclo for para recorrer la tupla y mostrar los elementos de la misma.

Usen los metodos de sort() y reverse() para ordenar la tupla y mostrarla en orden inverso.
Usen los slices para mostrar los primeros 3 elementos de la tupla y los ultimos 3 elementos de la tupla.
Desempaquetar tuplas
"""

estados_leads = ("Nuevo", "Contactado", "Calificado", "Propuesta", "Cerrado")

estados_leads = estados_leads + ("Perdido", "Rechazado")

print("Ordenamiento por ciclo for:")
for estado in estados_leads:
    print(estado)

print("Ordenamiento por comprension de tuplas:")
[print(x) for x in estados_leads]

print("Primeros 3 elementos:", estados_leads[:3])
print("Ultimos 3 elementos:", estados_leads[-3:])

print("Desempaquetando tuplas:")
nuevo, contactado, calificado, *_ = estados_leads
print("Nuevo:", nuevo)
print("Contactado:", contactado)
print("Calificado:", calificado)
print("Resto de estados:", _)
