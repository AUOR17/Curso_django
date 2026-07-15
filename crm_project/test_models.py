from models import Lead, LeadService, LeadRepositoryMemoria, VendedorService, VendedorRepositoryMemoria
import pytest

@pytest.fixture
def servicio_leads():

    repo_leads = LeadRepositoryMemoria()
    return LeadService(repo_leads)

@pytest.fixture
def servicio_vendedores():

    repo_seller = VendedorRepositoryMemoria()
    return VendedorService(repo_seller)

def test_presupuesto_negativo():

    lead_pobre = Lead("Juan", "Pendas", "juan@test.com", -5000)

    assert lead_pobre.presupuesto_estimado == 0

def test_registrar_lead(servicio_leads):

    lead = servicio_leads.registrar_nuevo_lead("Juan", "Perez", "juan@ejemplo.com", 2500)

    assert lead is not None
    assert lead.nombre == "Juan"
    assert lead.apellido == "Perez"
    assert lead.email == "juan@ejemplo.com"
    assert lead.presupuesto_estimado == 2500
    assert lead.estado == "Prospecto"

def test_email_invalido(servicio_leads):

    lead = servicio_leads.registrar_nuevo_lead("Juan", "Perez", "juan-jemplo.com", 2500)

    assert lead is None

def test_contratar_vendedor(servicio_vendedores):

    vendedor = servicio_vendedores.contratar_vendedor("Luis", "Lopez", "luis@ventas.com", "V-001")

    assert vendedor is not None
    assert vendedor.n_empleado == "V-001"
    assert vendedor.ventas_totales == 0

def test_error_gafete(servicio_vendedores):

    vendedor = servicio_vendedores.contratar_vendedor("Luis", "Lopez", "luis@ventas.com", "!2321321")

    assert vendedor is None

def test_convertir_cliente(servicio_leads):

    lead = servicio_leads.registrar_nuevo_lead("Juan", "Perez", "juan-j@mplo.com", 2500)

    assert lead.estado == "Prospecto"

    lead.convert_to_customer()

    assert lead.estado == "Cliente"

def test_acuular_ventas(servicio_vendedores):

    vendedor = servicio_vendedores.contratar_vendedor("Luis", "Lopez", "luis@ventas.com", "V-001")

    vendedor.registrar_venta(1500)
    vendedor.registrar_venta(500)

    assert vendedor.ventas_totales == 2000

@pytest.mark.parametrize( "email_prueba, esperado_es_existoso", [
    ("juan@ejemplo",True),
    ("juan@empresa.mx", True),
    ("juan-google.com",False),
    ("angel@",True),
    ("",False)
])
def test_email_leads_many(servicio_leads,email_prueba,esperado_es_existoso):

    lead = servicio_leads.registrar_nuevo_lead("Test", "User", email_prueba, 1000)

    if esperado_es_existoso:
        assert lead is not None
        assert lead.email == email_prueba
    else:
        assert lead is None

@pytest.mark.parametrize("gafete_prueba, esperado_status", [
    ("V-001", True),
    ("V-9999", True),
    ("123431", False),
    ("v-001", False),
    ("A-001", False)
])
def test_gafetes_many(servicio_vendedores, gafete_prueba, esperado_status):

    vendedor = servicio_vendedores.contratar_vendedor("test", "ventas", "ventas@test.com", gafete_prueba)

    if esperado_status:
        assert vendedor is not None
        assert vendedor.n_empleado == gafete_prueba
    else:
        assert vendedor is None