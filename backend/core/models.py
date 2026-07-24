from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):

    class Role(models.TextChoices):
        GRAN_MAESTRO = 'GRAN_MAESTRO', 'Gran Maestro (Dios del sistema)'
        MAESTRO = 'MAESTRO', 'Maestro del gremio (Amin)'
        GUERRERO = 'GUERRERO', 'Guerrero (Ventas)'
        MAGO = 'MAGO', 'Mago (Marketing)'
        PICARO = 'PICARO', 'Picaro (Operaciones)'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.GUERRERO)
    level = models.IntegerField(default=1)
    experience = models.IntegerField(default=0)
    gold = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    gremio = models.ForeignKey(
        'gremios.Gremio', 
        on_delete = models.SET_NULL,
        null = True,
        blank = True,
        related_name = 'miembros'
    )

    def __str__(self):
        gremio_nombre = self.gremio.nombre if  hasattr(self, 'gremio') and self.gremio else 'Sin Gremio'
        return f"[{gremio_nombre}] {self.username} - Nivel {self.level} {self.role}"

    