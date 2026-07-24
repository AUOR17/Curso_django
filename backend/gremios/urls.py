from django.urls import path
from .views import (
    GremioListView,
    GremioListCreateView,
    NombrarMaestroView,
    GremiosDisponiblesView,
    AsignarGremioView,
    MiGremioView,
    SedeMiembrosView, 
    GremioDetailView
)

urlpatterns = [
    path('gremio/', GremioListView.as_view(), name='lista_gremio'),
    path('sedes/', GremioListCreateView.as_view(), name='lista_crea_gremios'),
    path('nombrar-maestro/', NombrarMaestroView.as_view(), name='nombrar_maestro'),
    path('gremios-disponibles/', GremiosDisponiblesView.as_view(), name='gremios_disponibles'),
    path('asignar-gremio/', AsignarGremioView.as_view(), name='asignar_gremio'),
    path('mi-gremio/', MiGremioView.as_view(), name='mi_gremio'),
    path('sedes/<int:pk>/', GremioDetailView.as_view(), name='editar_sede'),
    path('sedes/<int:gremio_id>/miembros/', SedeMiembrosView.as_view(), name='sede_miembros'),
]

# pagina.com/gremios/sedes/12/miembros