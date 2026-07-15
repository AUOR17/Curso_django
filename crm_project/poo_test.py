class Personaje:

    def __init__(self,nombre, salud_maxima):
        self.nombre = nombre
        self._salud = salud_maxima
        self.salud_maxima = salud_maxima
        self.inventario = ['Pocion chica', 'Pan seco']

    @property
    def salud(self):
        return self._salud
    
    @salud.setter
    def salud(self,nueva_salud):
        if nueva_salud <= 0:
            self._salud = 0
            print(f"{self.nombre} ha caido en la batalla :( )")
        elif nueva_salud > self.salud_maxima:
            self._salud = self.salud_maxima
            print(f"No se le puede subir mas de {self.salud_maxima} HP")
        else:
            self._salud = nueva_salud
            print(f"Salud de {self.nombre} actualizada a: {self._salud}/{self.salud_maxima}")

    @salud.deleter
    def salud(self):
        print(f"Aleta, No se puede borrar la salud de: {self.nombre}")

    def _efecto_sonido_curacion(self):
        print("Efecto de sonido: glug glug")

    def tomar_pocion(self, cantidad_curacion):

        print(f"{self.nombre} intenta tomar una pocion de +{cantidad_curacion} HP")

        self._efecto_sonido_curacion()

        self.salud = self.salud + cantidad_curacion

    def __str__(self):
        # Se utiliza por ejemplo en: print(Personaje)
        return f"Personaje: {self.nombre} | HP: {self.salud}/{self.salud_maxima}"
    
    def __repr__(self):
        # Se utilzan por ejemplo en: repr(Personaje)
        return f"Personaje('{self.nombre}', {self.salud_maxima})"
    
    def __gt__(self, otro_personaje):
        """Se activa al usar (>)"""
        return self.salud_maxima > otro_personaje.salud_maxima
    
    def __add__(self,otro_personaje):
        """Se activa al usar +"""
        print(f"Fusion iniciada: {self.nombre} + {otro_personaje.nombre}")

        nuevo_nombre = f"{self.nombre[:3]}{otro_personaje.nombre[3:]}"
        nueva_salud = self.salud_maxima + otro_personaje.salud_maxima

        return Personaje(nuevo_nombre,nueva_salud)
    
    def __len__(self):
        "Se activa al usar len(objeto)"
        return len(self.inventario)
    
    @staticmethod
    def mostrar_manual_juego():
        print("Manual del juego")
        print("Aui va un menu")

    @classmethod
    def crear_npc_basico(cls):
        print("[Sistema] Generando NPC basico sin pedir datos")
        return cls(nombre="Aldeano generico", salud_maxima=10)

class Guerrero(Personaje):

    def __init__(self, nombre, salud_maxima, puntos_armadura):
        super().__init__(nombre, salud_maxima)
        self.puntos_armadura = puntos_armadura

    def recibir_dano(self, dano_enemigo):
        print(f" Un enemigo ataca a {self.nombre} con {dano_enemigo} de daño")

        dano_real = dano_enemigo - self.puntos_armadura
        if dano_real < 0:
            dano_real = 0

        print(f"La armadra bloquea {self.puntos_armadura} puntos. Daño real: {dano_real}")

        self.salud = self.salud - dano_real
        # self.salud -= dano_real

    def __str__(self):
        ficha_base = super().__str__()
        return f"{ficha_base} | Armadura: {self.puntos_armadura}"
    
    @classmethod
    def crear_espartano_elite(cls):
        print(f"[Sistema] Creando Espartano de elite")
        return cls(nombre="Espartano", salud_maxima=200, puntos_armadura=50)
    
class Mago(Personaje):

    def __init__(self, nombre, salud_maxima, mana):
        super().__init__(nombre, salud_maxima) 
        self.mana = mana

    def lanzar_hechizo(self, objetivo:Personaje, costo_mana=15) -> None:

        print(f"{self.nombre} prepara un hezhico contra {objetivo.nombre}")

        if self.mana >= costo_mana:
            self.mana -= costo_mana
            dano=25

            print(f"{objetivo.nombre} recibe {dano} de daño magico")
            print(f"Mana restante de {self.nombre}: {self.mana}")
            objetivo.salud -= dano
        else:
            print(f"Fallo: {self.nombre} no tiene suficiente mana")
            print(f"Requiee: {costo_mana}, Actual: {self.mana}")

    def __str__(self):
        ficha_base =super().__str__()
        return f"{ficha_base} | Mana: {self.mana}"
    
    def __call__(self):
        print(f"[__call__] {self.nombre} entra en modo meditacion")
        self.mana += 20
        print(f"Mana restaurado. Mana actual: {self.mana}")

class Clerigo(Personaje):

    def __init__(self, nombre, salud_maxima, deidad):
        super().__init__(nombre, salud_maxima)
        self.deidad = deidad

    def __str__(self):
        ficha_base =super().__str__()
        return f"{ficha_base} | Deidad: {self.deidad}"
    
    def rezar(self):
        print(f"{self.nombre} se arrodilla y eleva su plegaria a {self.deidad}")

    def __rshift__(self, aliado: Personaje):
        """Este metodo se activa cuando se usa el desplazamiento (>>)
        Sintaxis: clerigo >> guerrero"""
        curacion = 25
        print(f"{self.nombre} canaliza luz divina hacia {aliado.nombre}")
        aliado.salud += curacion

class Asesino(Personaje):
    def __init__(self, nombre, salud_maxima):
        super().__init__(nombre, salud_maxima)
        self.__nivel_sigilo = 100

    @property
    def sigilo(self):
        return self.__nivel_sigilo
    
    @sigilo.setter
    def sigilo(self,nuevo_valor):
        if nuevo_valor > 100:
            self.__nivel_sigilo = 100
        elif nuevo_valor <= 0:
            self.__nivel_sigilo = 0
            print(f"Alerta: {self.nombre} ha pisado una rama")

    def ocultarse(self):
        print(f"{self.nombre} lanza una bomba de humo")
        self.sigilo = 0        
        self.sigilo += 40

        print(f"Nivel de sigilo restaurando a: {self.sigilo}")

    def __str__(self):
        ficha_base =super().__str__()
        return f"{ficha_base} | Sigilo: {self.sigilo}"
    
    def __mul__(self, multiplicador_critico: int):
        """
        Se activa al usarl el simbolo del asterisco (*)
        Sintaxis: asesino * 4
        """

        costo_sigili = 35

        print(f"{self.nombre} intenta un ataque furtivo")

        if self.sigilo >= costo_sigili:
            dano_base = 15
            dano_total = dano_base * multiplicador_critico

            self.sigilo -= costo_sigili
            print(f"Se hace un ataque critico, daño total: {dano_total}")
        else:
            print("No hay suficiente sigilo")
            self.sigilo = 0
    
def demo_1_encapsulamiento():
    arthur = Personaje('Arthur', 100)
    arthur._salud = "Modo God"
    print(arthur)

    enzo = Asesino('Enzo', 100)
    print(enzo)
    enzo.__nivel_sigilo = 200
    print(enzo)
    enzo._Asesino__nivel_sigilo = 4000
    print(enzo)

def demo_2_herencia():

    arthur = Personaje('Arthur', 200)
    kratos = Guerrero('Kratos', 300, 30)

    kratos.recibir_dano(25)
    print(kratos)

    nuevo_personaje = arthur + kratos
    print(nuevo_personaje)
    # arthur.puntos_armadura = 200
    print(arthur.puntos_armadura)

def demo_magic_method():

    arthur = Personaje('Arthur', 200)
    kratos = Guerrero('Kratos', 300, 30)

    print(repr(arthur))
    print(repr(kratos))

    if kratos > arthur:
        print(f"Kratos es mas fuerte")

    kratos.inventario.append("Espadas del Caos")
    print(len(kratos))

def demo_decoradores():
    Personaje.mostrar_manual_juego()

    npc = Personaje.crear_npc_basico()
    guerrero_npc = Guerrero.crear_espartano_elite()

    print(npc)
    print(guerrero_npc)

    del npc.salud

def demo_clerigo():
    arthur = Personaje('Arthur', 200)
    shaduher = Clerigo('Shaduher', 90, 'Apolo')
    gandalg = Mago('Gandalf', 80, 40)

    print(arthur)
    print(shaduher)
    print(gandalg)

    gandalg.lanzar_hechizo(arthur)
    gandalg.lanzar_hechizo(arthur)
    gandalg.lanzar_hechizo(arthur)
    gandalg.lanzar_hechizo(arthur)
    print(arthur)
    gandalg() # -> Metodo __call__

    shaduher.rezar()

    shaduher >> arthur

    print(arthur)


if __name__ == '__main__':
    demo_clerigo()