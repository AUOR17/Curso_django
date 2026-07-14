"""
Crear una lista de Leads donde se utilicen los metodos append(), insert() y extend() para agregar elementos a la lista.

asi mismo, usen un ciclo for para recorrer la lista y mostrar los elementos de la misma.

Usen los metodos de sort() y reverse() para ordenar la lista y mostrarla en orden inverso.
Usen los slices para mostrar los primeros 3 elementos de la lista y los ultimos 3 elementos de la lista.
"""

lista_inicial = ["Carlos", "Ana", "Luis", "Marta"]
lista_inicial.append("Pedro")
lista_inicial.insert(2, "Lucia")
lista_inicial.extend(["Jorge", "Sofia"])
print("Ordenamiento por ciclo for:")
for elemento in lista_inicial:
    print(elemento)
print("Ordenamiento por comprension de listas:")
[print(x) for x in lista_inicial]

lista_inicial.sort()
lista_inicial.reverse()

print("Primeros 3 elementos:", lista_inicial[:3])
print("Ultimos 3 elementos:", lista_inicial[-3:])