from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db.models import Q

from .models import Gremio
from .serializers import GremioSerializer, CazadorSerializer
from core.permissions import EsGranMaestro

User = get_user_model()

class GremioListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'GRAN_MAESTRO':
            cazadores = User.objects.all().select_related('gremio').order_by('-level', '-experience')
        else:
            cazadores = User.objects.filter(
                Q(gremio=request.user.gremio) |
                Q(role__in = ['MAESTRO', 'GRAN_MAESTRO']) | 
                Q(gremio__isnull = True)
            ).select_related('gremio').distinct().order_by('-level', 'experience')

        serializer = CazadorSerializer(cazadores, many=True)
        return Response(serializer.data)

class GremioListCreateView(generics.ListCreateAPIView):
    queryset = Gremio.objects.all()
    serializer_class = GremioSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            permission_classes = [IsAuthenticated, EsGranMaestro]
        else:
            permission_classes = [IsAuthenticated]
            
        return [permission() for permission in permission_classes]

class NombrarMaestroView(APIView):
    permission_classes = [EsGranMaestro]

    def post(self, request):
        user_id = request.data.get('user_id')
        gremio_id = request.data.get('gremio_id')

        # get_object_or_404 lanza un 404 automático si no existe, ahorrando el try/except
        user = get_object_or_404(User, id=user_id)
        gremio = get_object_or_404(Gremio, id=gremio_id)

        if User.objects.filter(role='MAESTRO', gremio=gremio).exists():
            return Response({'error': 'Esta sede ya tiene Maestro.'}, status=400)
        
        user.role = 'MAESTRO'
        user.gremio = gremio
        user.save()
        
        return Response({"mensaje": f"{user.username} ahora es Maestro de {gremio.nombre}"})

class GremiosDisponiblesView(APIView):
    permission_classes = [EsGranMaestro]

    def get(self, request):
        gremios_ocupados = User.objects.filter(
            role__in=['MAESTRO', 'GRAN_MAESTRO'], 
            gremio__isnull=False
        ).values_list('gremio_id', flat=True)

        gremios_libres = Gremio.objects.exclude(id__in=gremios_ocupados)
        serializer = GremioSerializer(gremios_libres, many=True)
        return Response(serializer.data)

class MiGremioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.gremio:
            return Response([])

        cazadores = User.objects.filter(
            gremio=request.user.gremio
        ).exclude(role__in=['MAESTRO', 'GRAN_MAESTRO'])

        serializer = CazadorSerializer(cazadores, many=True)
        return Response(serializer.data)

class AsignarGremioView(APIView):
    permission_classes = [EsGranMaestro]

    def post(self, request):
        user_id = request.data.get('user_id')
        gremio_id = request.data.get('gremio_id')

        user = get_object_or_404(User, id=user_id)
        gremio = get_object_or_404(Gremio, id=gremio_id)

        if User.objects.filter(role='MAESTRO', gremio=gremio).exists():
            return Response({'error': 'Esta sede ya tiene Maestro.'}, status=400)
        
        user.gremio = gremio
        user.save()
        
        return Response({"mensaje": f"Sede {gremio.nombre} asignada a {user.username}"})

class SedeMiembrosView(APIView):
    permission_classes = [EsGranMaestro]

    def get(self, request, gremio_id):
        cazadores = User.objects.filter(gremio_id=gremio_id).order_by('-level')
        serializer = CazadorSerializer(cazadores, many=True)
        return Response(serializer.data)
    
class GremioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Gremio.objects.all()
    serializer_class = GremioSerializer
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            permission_classes = [IsAuthenticated, EsGranMaestro]
        else:
            permission_classes = [IsAuthenticated]
            
        return [permission() for permission in permission_classes]