class Personaje:
    def __init__(self, nombre, salud_maxima):
        self.nombre = nombre
        self._salud = salud_maxima 
        self.salud_maxima = salud_maxima
        self.inventario = ["Poción chica", "Pan seco"]

    @property
    def salud(self):
        return self._salud

    @salud.setter
    def salud(self, nueva_salud):
        if nueva_salud <= 0:
            self._salud = 0
            print(f"{self.nombre} ha caído en batalla...")
        elif nueva_salud > self.salud_maxima:
            self._salud = self.salud_maxima
        else:
            self._salud = nueva_salud
            
    def __str__(self):
        return f"{self.nombre} | HP: {self.salud}/{self.salud_maxima}"
    
class Guerrero(Personaje):
    def __init__(self, nombre, salud_maxima, puntos_armadura):
        super().__init__(nombre, salud_maxima)
        self.puntos_armadura = puntos_armadura 

    def __str__(self):
        ficha_base = super().__str__()
        return f"Guerrero: {ficha_base} | Armadura: {self.puntos_armadura}"

class Mago(Personaje):
    def __init__(self, nombre, salud_maxima, mana_maximo):
        super().__init__(nombre, salud_maxima)
        self.mana_maximo = mana_maximo
        self._mana = mana_maximo

    def lanzar_hechizo(self, coste_mana):
        """Simula una acción propia de la clase Mago"""
        if self._mana >= coste_mana:
            self._mana -= coste_mana
            print(f"¡{self.nombre} lanza una bola de fuego! (-{coste_mana} MP)")
        else:
            print(f"{self.nombre} no tiene suficiente maná para atacar. Necesita descansar.")

    def __str__(self):
        ficha_base = super().__str__()
        return f"Mago: {ficha_base} | Maná: {self._mana}/{self.mana_maximo}"
    

class JefeFinal(Personaje):
    def __init__(self, nombre, salud_maxima, multiplicador_dano):
        super().__init__(nombre, salud_maxima)
        self.multiplicador_dano = multiplicador_dano
        self.enfurecido = False 

    def recibir_dano_critico(self, cantidad):
        """Si la salud cae bajo el 30%, el jefe entra en Fase 2"""
        self.salud -= cantidad
        if 0 < self.salud <= (self.salud_maxima * 0.3) and not self.enfurecido:
            self.enfurecido = True
            self.multiplicador_dano *= 2
            print(f"\n¡ALERTA! ¡El cielo se oscurece! {self.nombre} ha entrado en FASE 2.")
            print(f"¡Su multiplicador de daño subió a {self.multiplicador_dano}x!\n")

    def __str__(self):
        ficha_base = super().__str__()
        estado = "ENFURECIDO" if self.enfurecido else "Acechando"
        return f"JEFE: {ficha_base} | Daño: {self.multiplicador_dano}x | Estado: {estado}"
    
class Gremio:
    def __init__(self, nombre_gremio):
        self.nombre_gremio = nombre_gremio
        self.miembros = []

    def reclutar(self, nuevo_personaje):
        """Añade un objeto Personaje a la lista del Gremio"""
        self.miembros.append(nuevo_personaje)
        print(f"¡{nuevo_personaje.nombre} ha jurado lealtad al gremio '{self.nombre_gremio}'!")

    def listar_miembros(self):
        """Imprime la ficha de todos los miembros"""
        print(f"\n --- GREMIO: {self.nombre_gremio.upper()} ---")
        if not self.miembros:
            print("El gremio está vacío. ¡Recluta a alguien!")
        else:
            for miembro in self.miembros:
                print(miembro) 
        print("---------------------------------------\n")