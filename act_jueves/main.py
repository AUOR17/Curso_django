from core_engine.models import Lead
# import core_engine.database as database
from core_engine.database import *

def main():
    iniciaizar_db()

    lead_1 = Lead("Elon", "Musk", "elon@tesla.com", 80000)
    lead_2 = Lead("Bill", "Gates", "bill@microsoft.com", 4500)
    lead_3 = Lead("AnGEL", "MarTINez", "angel@test.com", 15000)

    guardar_lead(lead_1)
    guardar_lead(lead_2)
    guardar_lead(lead_3)

    # duplicado
    guardar_lead(lead_1)

if __name__ == '__main__':
    main()

