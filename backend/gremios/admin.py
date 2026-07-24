from django.contrib import admin
from .models import Gremio

# Register your models here.

@admin.register(Gremio)
class GremioAdmin(admin.ModelAdmin):

    list_display = ('id', 'nombre', 'descripcion')
    search_fields = ('nombre',)