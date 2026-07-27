from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):

    # Columnas que se muestran en la lista principal de usuarios.
    list_display = ('username', 'email', 'role', 'level', 'gremio', 'gold','is_staff')

    # Filtros lterales para buscar el rol
    list_filter = ('role', 'gremio', 'level', 'is_staff')

    # Añadir los campos al formulario de edicion
    fieldsets = UserAdmin.fieldsets + (
        ('Atributos de Heroe', {
            'fields': ('role', 'level', 'experience', 'gold', 'gremio'),
        }),
    )

    # Añadir los campos al formulario de creacion "Crear Usuario"
    add_fieldsets = UserAdmin.add_fieldsets + (
            ('Atributos de Heroe', {
                'fields': ('role', 'level', 'experience', 'gold', 'gremio'),
            }),
        )