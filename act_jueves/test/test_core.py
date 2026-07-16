import pytest

from core_engine.models import Persona, Lead, Vendedor, Empresa

def test_formato_nombre_completo():
    """1. Verifica que los nombres se formateen con mayúsculas iniciales (Title Case)."""
    persona = Persona("angel", "martínez", "angel@test.com")
    assert persona.get_full_name() == "Angel Martínez"

def test_estado_inicial_lead():
    """2. Verifica que al crear un Lead, su estado sea por defecto 'Prospecto'."""
    lead = Lead("Carlos", "Slim", "carlos@telmex.com", 50000)
    assert lead.estado == "Prospecto"

def test_conversion_lead_a_cliente():
    """3. Verifica la lógica de conversión de estado."""
    lead = Lead("Ana", "García", "ana@empresa.com", 15000)
    lead.convert_to_customer()
    assert lead.estado == "Cliente"

def test_validador_correo_corporativo():
    """4. Verifica que detecte correctamente un correo de empresa."""
    lead = Lead("Luis", "Tech", "luis@startup.io", 20000)
    assert lead.es_corporativo is True
    # assert lead.es_corporativo == "Es corporativo"

def test_validador_correo_generico():
    """5. Verifica que detecte y marque como False correos como Gmail o Hotmail."""
    lead = Lead("Pedro", "Pérez", "pedro@gmail.com", 5000)
    assert lead.es_corporativo is False

def test_presupuesto_negativo_lanza_error():
    """6. Verifica que el setter proteja la lógica bloqueando números negativos."""
    with pytest.raises(ValueError, match="El presupuesto no puede ser negativo."):
        Lead("Error", "Test", "error@test.com", -1000)

# --- PRUEBAS PARA LA ESTRUCTURA COMPLEJA (EMPRESA) ---

def test_empresa_agregar_contacto():
    """7. Verifica que un Lead se guarde correctamente en el diccionario de la empresa."""
    empresa = Empresa("TechCorp", "Tecnología")
    lead = Lead("Julia", "Dev", "julia@techcorp.com", 30000)
    empresa.agregar_contacto(lead)
    
    assert "julia@techcorp.com" in empresa.contactos
    assert len(empresa.contactos) == 1

def test_empresa_evita_contactos_duplicados():
    """8. Verifica que la lógica rechace ingresar el mismo correo dos veces."""
    empresa = Empresa("TechCorp", "Tecnología")
    lead = Lead("Julia", "Dev", "julia@techcorp.com", 30000)
    empresa.agregar_contacto(lead)
    
    with pytest.raises(ValueError):
        empresa.agregar_contacto(lead) # Intentamos meter el mismo objeto

def test_empresa_rechaza_tipos_incorrectos():
    """9. Verifica que no se puedan agregar strings o números en lugar de objetos Lead."""
    empresa = Empresa("TechCorp", "Tecnología")
    
    with pytest.raises(TypeError):
        empresa.agregar_contacto("Esto es un string, no un Lead")

def test_calculo_potencial_ventas():
    """10. Verifica el cálculo matemático sumando los presupuestos de varios Leads."""
    empresa = Empresa("Data Co", "Análisis")
    lead_1 = Lead("Alice", "Data", "alice@dataco.com", 15000)
    lead_2 = Lead("Bob", "Science", "bob@dataco.com", 25000)
    
    empresa.agregar_contacto(lead_1)
    empresa.agregar_contacto(lead_2)
    
    assert empresa.calcular_potencial_ventas() == 40000.0

# --- PRUEBAS DE LÓGICA DE NEGOCIO (PRIORIDAD Y COMISIONES) ---

def test_lead_prioridad_alta():
    """Verifica que un presupuesto >= 10,000 asigne prioridad Alta."""
    lead = Lead("Mark", "Zuckerberg", "mark@meta.com", 12000)
    assert lead.calcular_prioridad() == "Alta"

def test_lead_prioridad_baja():
    """Verifica que un presupuesto < 5,000 asigne prioridad Baja."""
    lead = Lead("Juan", "Pérez", "juan@hotmail.com", 3000)
    assert lead.calcular_prioridad() == "Baja"

def test_vendedor_registro_venta_y_comision():
    """Verifica que las ventas se acumulen y la comisión se calcule bien (5% por defecto)."""
    vendedor = Vendedor("Angel", "Martínez", "angel@empresa.com", "EMP-01")
    vendedor.registrar_venta(20000)
    # 5% de 20,000 = 1,000
    assert vendedor.calcular_comision() == 1000.0

def test_vendedor_comision_porcentaje_personalizado():
    """Verifica el cálculo de comisión si se pasa un porcentaje diferente (ej. 10%)."""
    vendedor = Vendedor("Angel", "Martínez", "angel@empresa.com", "EMP-01")
    vendedor.registrar_venta(50000)
    # 10% de 50,000 = 5,000
    assert vendedor.calcular_comision(0.10) == 5000.0