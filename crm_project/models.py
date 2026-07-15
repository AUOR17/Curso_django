from abc import ABC, abstractmethod

class Persona:
    def __init__(self, nombre:str, apellido:str, email:str) -> None:
        self.nombre = nombre
        self.apellido = apellido
        self.email = email

    def get_full_name(self) -> str:
        return f"{self.nombre} {self.apellido}".title()
    
class Lead(Persona):
    def __init__(self, nombre, apellido:str, email:str, presupuesto_estimado:float):
        super().__init__(nombre, apellido, email)
        self.estado = "Prospecto"
        self.__presupuesto_estimado = 0
        self.presupuesto_estimado = presupuesto_estimado

    @property
    def presupuesto_estimado(self):
        return self.__presupuesto_estimado
    
    @presupuesto_estimado.setter
    def presupuesto_estimado(self,valor:float):
        if valor < 0:
            print(f"Error: el presupuesto no puede ser negativo. Seteando a 0")
            self.__presupuesto_estimado = 0
        else:
            self.__presupuesto_estimado = valor
    
    def convert_to_customer(self):
        self.estado = "Cliente"
        print(f"Felicidades {self.get_full_name()} ahora es un Cliente")

class Vendedor(Persona):

    def __init__(self, nombre:str, apellido:str, email:str, n_empleado:str):
        super().__init__(nombre, apellido, email)
        self.n_empleado = n_empleado
        self.ventas_totales = 0

    def registrar_venta(self,monto:float):
        self.ventas_totales += monto
        print(f"{self.get_full_name()} registró una vental. Total acumulado: $ {self.ventas_totales}")

def imprimir_gafete_evento(persona:Persona) -> None:
    print(f"Imprimiendo gafete de entrada para: {persona.get_full_name()}")

class IRepositorioEscritura(ABC):
    @abstractmethod
    def guardar(self,entidad):
        pass

class IRepositorioLectura(ABC):
    @abstractmethod
    def obtener_datos(self):
        pass

class LeadRepositoryMemoria(IRepositorioEscritura, IRepositorioLectura):
    def __init__(self):
        self._db_simulada = []

    def guardar(self, lead:Lead):
        self._db_simulada.append(lead)
        print(f"[DB Leads] Guardando a {lead.email}")

    def obtener_datos(self) -> list:
        return self._db_simulada
    
class VendedorRepositoryMemoria(IRepositorioEscritura, IRepositorioLectura):
    def __init__(self):
        self._db_simulada = []

    def guardar(self, vendedor:Vendedor):
        self._db_simulada.append(vendedor)
        print(f"[DB Vendedores] Guardando a {vendedor.n_empleado}")

    def obtener_datos(self) -> list:
        return self._db_simulada
    
class LeadService:
    def __init__(self, repositorio_escritura: IRepositorioEscritura) -> Lead:
        self.repo_escritura = repositorio_escritura
        # self.repo_lectura = self.repo_lectura
        
    def registrar_nuevo_lead(self,nombre:str,apellido:str,email:str,presupuesto:float):
        print(f"[Servicio] Iniciando registro para: {email}")

        if "@" not in email:
            print (f"Error: El email '{email}' no tiene un formato valido")
            return None
        
        nuevo_lead = Lead(nombre, apellido, email, presupuesto)
        self.repo_escritura.guardar(nuevo_lead)
        self.enviar_email_bienvenida(nuevo_lead)
        return nuevo_lead

    def enviar_email_bienvenida(self, lead:Lead) -> None:
        print(f"[Email] Mandando correo de bienvenida a {lead.email}")

class VendedorService:
    def __init__(self, repositorio_escritura: IRepositorioEscritura) -> Vendedor:
        self.repo_escritura = repositorio_escritura
        
    def contratar_vendedor(self,nombre:str,apellido:str,email:str,n_emleado:float):
        print(f"[RRHH] Iniciando contratacion para: {nombre} {apellido}")

        if not str(n_emleado).startswith("V-"):
            print(f"Error en el gafete: {n_emleado} es invalido")
            return None
        
        nuevo_vendedor = Vendedor(nombre, apellido, email, n_emleado)
        self.repo_escritura.guardar(nuevo_vendedor)

        print(f"[RRHH] {nuevo_vendedor.get_full_name()} ha sido contratado")
        self.enviar_email_bienvenida(nuevo_vendedor)
        return nuevo_vendedor

    def enviar_email_bienvenida(self, vendedor:Vendedor) -> None:
        print(f"[Email] Mandando correo de bienvenida a {vendedor.email}")

if __name__ == "__main__":

    repo_lead_memoria = LeadRepositoryMemoria()
    repo_vendedores_memoria = VendedorRepositoryMemoria()

    servicio_leads = LeadService(repo_lead_memoria)
    servicio_vendedores = VendedorService(repo_vendedores_memoria)

    lead_valido = servicio_leads.registrar_nuevo_lead("Ana", "Gómez", "ana@ejemplo.com", 2500.0)
    vendedor_estrella = servicio_vendedores.contratar_vendedor("Luis", "Pérez", "luis@ventas.com", "V-001")

    if vendedor_estrella and lead_valido:
        lead_valido.convert_to_customer()
        vendedor_estrella.registrar_venta(lead_valido.presupuesto_estimado)
