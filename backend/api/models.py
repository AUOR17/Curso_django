from django.db import models

# Create your models here.
class Guild(models.Model):
    name = models.CharField(max_length=100, unique=True)
    kingdom = models.CharField(max_length=100)
    max_capacity = models.IntegerField(default=50)

    def __str__(self):
        return f"{self.name} ({self.kingdom})"
    
class Adventurer(models.Model):

    CLASS_CHOICES = [
        ('MAGE','Mago'),
        ('WARRIOR', 'Guerrero'),
        ('ROGUE', 'Picaro'),
        ('Cleric', 'Clerigo')
    ]

    STATUS_CHOICES = [
        ('ACTIVE', 'Activo'),
        ('MISSION', 'En Mision'), 
        ('DEAD', 'Muerto en combate')
    ]

    name = models.CharField(max_length=100)
    class_type = models.CharField(max_length=20, choices=CLASS_CHOICES)
    level = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')

    guild = models.ForeignKey(Guild, related_name='adventurers', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} (Lv. {self.level}) {self.class_type}"