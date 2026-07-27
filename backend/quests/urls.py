from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuestViewSet, LeadViewSet

router = DefaultRouter()
router.register(r'tablero', QuestViewSet, basename='quest')
router.register(r'leads', LeadViewSet, basename='lead')

urlpatterns = [
    path('', include(router.urls)),
]