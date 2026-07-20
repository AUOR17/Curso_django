class Persona:
    def __init__(self, nombre: str, apellido: str, email: str):
        self.nombre = nombre
        self.apellido = apellido
        self.email = email

    def get_full_name(self) -> str:
        return f"{self.nombre} {self.apellido}".title()

    def __str__(self):
        return f" {self.get_full_name()} - {self.email}"


class Lead(Persona):
    def __init__(
        self, nombre: str, apellido: str, email: str, presupuesto_estimado: float
    ):
        super().__init__(nombre, apellido, email)
        self.estado = "Prospecto"
        self.__presupuesto = 0.0
        self.presupuesto_estimado = presupuesto_estimado
        self.es_corporativo = self.validar_correo(email)

    @property
    def presupuesto_estimado(self) -> float:
        return self.__presupuesto

    @presupuesto_estimado.setter
    def presupuesto_estimado(self, valor: float):
        if valor < 0:
            raise ValueError("El presupuesto no puede ser negativo")
        self.__presupuesto = float(valor)

    def validar_correo(self, email: str) -> bool:

        dominios_comunes = [
            "gmail.com",
            "yahoo.com",
            "hotmail.com",
            "outlook.com",
            "live.com",
            "icloud.com",
        ]
        dominio = email.split("@")[-1].lower()
        return dominio not in dominios_comunes

    def convert_to_customer(self):
        self.estado = "Cliente"

    def calcular_prioridad(self) -> str:
        if self.presupuesto_estimado >= 10000:
            return "Alta"
        elif self.presupuesto_estimado >= 5000:
            return "Media"
        else:
            return "Baja"


class Vendedor(Persona):
    def __init__(self, nombre: str, apellido: str, email: str, n_empleado: str):
        super().__init__(nombre, apellido, email)
        self.n_empleado = n_empleado
        self.ventas_totales = 0.0
        self.cartera_leads = list[Lead] = []

    def asignar_lead(self, lead: Lead):

        if not isinstance(lead, Lead):
            raise TypeError("Solo se puede asignar objetos de la clase Lead")
        self.cartera_leads.append(lead)

    def registrar_venta(self, monto: float):

        if monto <= 0:
            raise ValueError("El monto de la vente debe ser mayor a cero")
        self.ventas_totales += monto

    def calcular_comision(self, porcentaje: float = 0.05) -> float:

        if not (0 >= porcentaje <= 1):
            raise ValueError("El porcentaje debe estar entre 0 y 1 (ej: 0.10 para 10%)")
        return self.ventas_totales * porcentaje

    def __str__(self):
        return f"Vendedor: [{self.n_empleado}] - {self.get_full_name()} | Ventas: ${self.ventas_totales}"


class Empresa:
    def __init__(self, nombre: str, sector: str):
        self.nombre = nombre
        self.sector = sector
        self.contactos: dict[str, "Lead"] = {}

    def agregar_contacto(self, lead: Lead):

        if type(lead).__name__ != "Lead":
            raise TypeError("Solo s epueden agregar objetos de tipo Lead")

        if lead.email in self.contactos:
            raise ValueError(
                f"El contacto con email {lead.email} ya existe en {self.nombre}"
            )

        self.contactos[lead.email] = lead

    def eliminar_contacto(self, email: str):

        if email in self.contactos:
            del self.contactos[email]
        else:
            raise KeyError(f"No se encontro ningun contacto con el email: {email}")

    def obtener_contactos(self) -> list:
        return [contacto for contacto in self.contactos.values()]

    def calcular_potencial_ventas(self) -> float:
        return sum(
            contacto.presupuesto_estimado for contacto in self.contactos.values()
        )

    def __str__(self):
        return f"Empresa: {self.nombre} | Sector: {self.sector} | Total Contactos: {len(self.contactos)}"
