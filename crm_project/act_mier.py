from poo_test import Asesino, Guerrero, Clerigo, Mago

def simular_combate():
    print(f"Bienvenido al Coliseo")

    gandalf = Mago('Gandalf', salud_maxima=80, mana=60)
    guts = Clerigo('Guts', salud_maxima=90, deidad='Thorfin')
    enzio = Asesino('Enzio', salud_maxima=70)

    jefe_final = Guerrero.crear_espartano_elite()

    print("Turno del Mago")
    gandalf.lanzar_hechizo(objetivo=jefe_final)

    print("Turno del Asesino")
    enzio*3
    jefe_final.salud -= 45

    dano_jefe = 60

    print("Turno del jefe")
    print(f"El espartano golea al mago: {gandalf.nombre} con {dano_jefe} puntos de daño")
    gandalf.salud -= dano_jefe

    print("Turno dle Clerigo")
    guts >> gandalf

    guts >> enzio

    print(f"Final de la ronda")
    print(gandalf)
    print(enzio)
    print(guts)
    print(jefe_final)

if __name__ == '__main__':

    simular_combate()

