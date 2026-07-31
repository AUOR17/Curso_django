from django.db import models
from django.conf import settings


class Quest(models.Model):

    class Status(models.TextChoices):
        TABERNA = "TABERNA", "Taberna (Nuevo)"
        EXPLORACION = "EXPLORACION", "Exploracion (En Proceso)"
        COMBATE = "COMBATE", "Combate (Negociacion)"
        TESORO = "TESORO", "Tesoro (Cerrado o Ganado)"
        CEMENTERIO = "CEMENTERIO", "Cementerio (Cerrado Perdido)"

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    difficulty_level = models.IntegerField(default=1)
    potential_reward = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.TABERNA
    )

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="quests",
    )

    gremio = models.ForeignKey(
        "gremios.Gremio",
        on_delete=models.SET_NULL,
        related_name="quests",
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"[{self.status}] {self.title}"


class Lead(models.Model):

    ESTADOS_CAZA = [
        ("AVISTAMIENTO", "Avistamiento (Nuevo Lead)"),
        ("INVESTIGACION", "Investigación (Calificando)"),
        ("EMBOSCADA", "Emboscada (Propuesta)"),
        ("COMBATE", "En Combate (Negociación)"),
        ("ABATIDO", "Abatido (Ganado/Closed Won)"),
        ("ESCAPO", "Escapó (Perdido/Closed Lost)"),
    ]

    name = models.CharField(max_length=200, verbose_name="Nombre del Objetivo")
    race_class = models.CharField(max_length=100, verbose_name="Raza/Clase (Job Title)")
    contact_email = models.EmailField(
        blank=True, null=True, verbose_name="Email de Contacto"
    )
    contact_phone = models.CharField(
        max_length=20, blank=True, null=True, verbose_name="Teléfono"
    )

    threat_level = models.IntegerField(
        default=10, verbose_name="Nivel de Amenaza (Confidence %)"
    )
    estimated_reward = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        verbose_name="Recompensa (Contract Value)",
    )
    days_in_funnel = models.IntegerField(default=0, verbose_name="Días de Rastreo")
    emails_sent = models.IntegerField(
        default=0, verbose_name="Cuervos Enviados (Emails)"
    )
    calls_made = models.IntegerField(
        default=0, verbose_name="Ataques Físicos (Llamadas)"
    )

    status = models.CharField(
        max_length=20, choices=ESTADOS_CAZA, default="AVISTAMIENTO"
    )

    assigned_hunter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="hunted_leads",
    )

    gremio = models.ForeignKey(
        "gremios.Gremio",
        on_delete=models.SET_NULL,
        related_name="leads",
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - Rango {self.threat_level}% ({self.status})"
