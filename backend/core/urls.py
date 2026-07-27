"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import (
    CookieTokenObtainPairView, 
    CookieTokenRefreshView, 
    RegisterView,
    BovedaSecretaView,
    PerfilUsuarioView,
    LogoutView,
    CandidatosView, 
    UsuarioViewSet
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/quests/', include('quests.urls')), 
    path('api/', include('gremios.urls')), 

    path('api/register/', RegisterView.as_view(), name='auth_register'),
    path('api/token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', LogoutView.as_view(), name='auth_logout'),

    path('api/me/', PerfilUsuarioView.as_view(), name='user_profile'), 
    path('api/boveda/', BovedaSecretaView.as_view(), name='boveda_secreta'),
    path('api/candidatos/', CandidatosView.as_view(), name='lista_candidatos'),
    path('api/', include(router.urls)),

]
