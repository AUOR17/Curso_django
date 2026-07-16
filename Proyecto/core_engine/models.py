class Personaje:

    def __init__(self, nombre:str, salud_maxima:int):
        self.nombre = nombre
        self.__salud = salud_maxima
        self.salud_maxima = salud_maxima
        self.inventario = ["Pocion chica", "Pan seco"]

    @property
    def salud(self):
        return self.__salud
    
    @salud.setter
    def salud(self, nueva_salud:int):
        if nueva_salud <= 0:
            self.__salud = 0
            print(f"{self.nombre} ha caido en la batalla")
        elif nueva_salud > self.salud_maxima:
            self.__salud = self.salud_maxima
        else:
            self.__salud = nueva_salud
    
    def __str__(self):
        return f"{self.nombre} | HP: {self.salud} / {self.salud_maxima}"
    
class Guerrero(Personaje):
    def __init__(self, nombre:str, salud_maxima:str, puntos_armadura:int):
        super().__init__(nombre, salud_maxima)
        self.puntos_armadura = puntos_armadura

    def __str__(self):
        ficha_base = super().__str__()
        return f"Guerrero: {ficha_base} | Armadura: {self.puntos_armadura}"
    
class Mago (Personaje):

    def __init__(self, nombre:str, salud_maxima:int, mana_maximo:int):
        super().__init__(nombre, salud_maxima)
        self.mana_maximo = mana_maximo
        self.__mana = mana_maximo

    def __str__(self):
        ficha_base = super().__str__()
        return f"Mago: {ficha_base} | Mana: {self.__mana} / {self.mana_maximo}"
    
    def lanzar_hechizo(self, costo_mana:int):
        if self.__mana >= costo_mana:
            self.__mana -= costo_mana
            print(f"{self.nombre} lanza bola de fuego")
        else:
            print(f"{self.nombre} no tiene suficiente mana")

class JefeFinal(Personaje):

    def __init__(self, nombre:str, salud_maxima:int, multiplicador_dano:int):
        super().__init__(nombre, salud_maxima)
        self.multiplicador_dano = multiplicador_dano
        self.enfurecido = False

    def recibir_dano_critico(self,cantidad:int):
        self.salud -= cantidad

        if 0 < self.salud <= (self.salud_maxima * 0.3) and not self.enfurecido:
            self.enfurecido = True
            self.multiplicador_dano *= 2
            print(F"Alerta, {self.nombre} ha entrado en la fase 2")
            print(f"Su multiplicador de daño subio a: {self.multiplicador_dano}")

    def __str__(self):
        ficha_base = super().__str__()
        estado = "Enfurecido" if self.enfurecido else "Acechando"
        return f"Jefe: {ficha_base} | Daño: {self.multiplicador_dano} | Estado: {estado}"
    
class Gremio:

    def __init__(self, nombre_gremio:str):
        self.nombre_gremio = nombre_gremio
        self.miembros = []
        
    def reclutar(self, nuevo_personaje:Personaje):
        self.miembros.append(nuevo_personaje)
        print(f"{nuevo_personaje.nombre} ha jurado lealtad al gremio '{self.nombre_gremio}'")

    def listar_miembros(self):

        print(f" Gremio: {self.nombre_gremio.upper()}")
        if not self.miembros:
            print("El gremio esta vacio")
        else:
            for miembro in self.miembros:
                print(miembro)