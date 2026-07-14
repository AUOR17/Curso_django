
calcular_comision = lambda venta: venta * 0.05

# # print(f"Comisión por venta de $1000: ${calcular_comision(1000)}")

leads = [
    {"nombre": "Empresa A", "presupuesto": 2000, "estado": "Nuevo"},
    {"nombre": "Empresa B", "presupuesto": 3000, "estado": "Contactado"},
    {"nombre": "Empresa C", "presupuesto": 1500, "estado": "Nuevo"},
    {"nombre": "Empresa D", "presupuesto": 2500, "estado": "Cerrado"}
]

leads_ordenados = sorted(leads, key=lambda lead: lead['presupuesto'], reverse=True)
# [ print(c) for c in leads_ordenados]

presupuesto = lambda lead: lead['presupuesto']*2
# [  print(f"Presupuesto duplicado para {lead['nombre']}: ${presupuesto(lead)}") for lead in leads_ordenados]

maximo = lambda x,y: x if x > y else y
# print(f"Máximo entre 10 y 20: {maximo(10, 20)}")

reverso = lambda s: s[::-1]
# print(f"Reverso de 'Python': {reverso('Python')}")
# print(f"Reverso de 'Lambda': {reverso('Lambda')}")
# print(f"Reverso de 'Funciones': {reverso('Funciones')}")

# args -> Argumentos variables POSICIONALES
suma = lambda *args: sum(args)
# print(f"Suma de 1, 2, 3, 4, 5: {suma(1, 2, 3, 4, 5)}")
# print(f"Suma de 10, 20, 30: {suma(10, 20, 30)}")
# print(f"Suma de 10 valores al azar: {suma(*[i for i in range(10)])}")

# kwargs -> Argumentos variables POR CLAVE
mostrar_info = lambda **kwargs: print(f"Información recibida: {kwargs}")
# mostrar_info(nombre="Juan", edad=30, ciudad="Madrid")
# mostrar_info(producto="Laptop", precio=1200, stock=50)
# mostrar_info(usuario="admin", permisos=["lectura", "escritura", "ejecución"])

evaluar = lambda x: "Positivo" if x > 0 else ("Negativo" if x < 0 else "Cero")
# print(f"Evaluar 10: {evaluar(10)}")
# print(f"Evaluar -5: {evaluar(-5)}")
# print(f"Evaluar 0: {evaluar(0)}")

leads_nuevos = filter(lambda lead: lead['estado'] == 'Nuevo', leads)
# print(f"Leads nuevos: {leads_nuevos}")
# print(f"Tipo de dato de leads_nuevos: {type(leads_nuevos)}")
# print(f"Tupla de leads nuevos: {tuple(leads_nuevos)}")
# print(f"Lista de leads nuevos: {list(leads_nuevos)}")
# [print(f"- Lead: {lead['nombre']}, Presupuesto: ${lead['presupuesto']}") for lead in leads_nuevos]


nombres_mayuscula = list(map(lambda lead: lead['nombre'].upper(), leads))
# print(f"Nombres de leads en mayúscula: {nombres_mayuscula}")

invetario_crudo = [
    {"sku":"A1", "producto":"LAPTOP gamer", "precio_str":"$1200.50", "moneda": "USD"},
    {"sku":"B2", "producto": "raton Inlamabrico", "precio_str":"€45.00", "moneda": "EUR"},
    {"sku":"C3", "producto":"TECLADO MECANICO", "precio_str":"$85.99", "moneda":"USD"}
]

TASA_EURO_A_USD = 1.08

def normalizar_producto(item:dict) -> dict:

    """Limpia el texto, convierte monedas y formatea a un estandar"""

    precio_limpio = float(item['precio_str'].replace("$","").replace("€",""))

    if item['moneda'] == 'EUR':
        precio_limpio = round(precio_limpio*TASA_EURO_A_USD,2)

    return {
        "sku":item["sku"],
        "producto":item['producto'].title(),
        "precio_usd": precio_limpio
    }

inventario_limpio = list(map(normalizar_producto, invetario_crudo))

# for prod in inventario_limpio:
#     print(f" -{prod['sku']} | {prod['producto']} -> ${prod['precio_usd']} USD")

logs_servidor = [
    {"ip": "192.168.1.10", "endpoint": "/home", "status": 200, "user_agent": "Chrome"},
    {"ip": "45.33.22.11", "endpoint": "/wp-admin.php", "status": 403, "user_agent": "Python-urllib"},
    {"ip": "10.0.0.5", "endpoint": "/api/v1/users", "status": 200, "user_agent": "Safari"},
    {"ip": "88.15.44.3", "endpoint": "/.env", "status": 404, "user_agent": "Curl/7.68.0"},
    {"ip": "192.168.1.12", "endpoint": "/dashboard", "status": 200, "user_agent": "Firefox"}
]

def es_amenaza(log: dict) -> bool:
    """
    Devuelve True si la petición parece maliciosa.
    Evalúa errores de permisos (403), archivos sensibles o bots automáticos.
    """
    endpoints_peligrosos = [".env", "wp-admin", "config.php"]

    if any(peligro in log['endpoint'] for peligro in endpoints_peligrosos):
        return True
    
    if log['status'] == 403 and log['user_agent'] not in ["Chrome", "Firefox", "Safari", "Edge", "Brave"]:
        return True
    
    return False

ataques_detectados = list(filter(es_amenaza, logs_servidor))

for ataque in ataques_detectados:
    print(f"Blquea la ip: {ataque['ip']} -> Intento acceder a '{ataque['endpoint']}")
