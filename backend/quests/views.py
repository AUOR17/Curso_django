from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action 
from rest_framework.response import Response 
from django.db.models import Q
from django.db import transaction
from .models import Quest, Lead
from .serializers import QuestSerializer, LeadSerializer
from decimal import Decimal

class QuestViewSet(viewsets.ModelViewSet):
    serializer_class = QuestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'GRAN_MAESTRO':
            return Quest.objects.all().select_related('assigned_to', 'gremio')

        return Quest.objects.filter(
            Q(gremio__isnull=True) | Q(gremio=user.gremio)
        ).select_related('assigned_to', 'gremio')

    def perform_create(self, serializer):
        user = self.request.user

        if user.role == 'GRAN_MAESTRO':
            gremio_id = self.request.data.get('gremio_id')
            serializer.save(gremio_id=gremio_id)
        elif user.role == 'MAESTRO':
            serializer.save(gremio=user.gremio)
        else:
            serializer.save()

    def create(self, request, *args, **kwargs):
        user = request.user
        recompensa = Decimal(request.data.get('potential_reward', 0))

        if user.role != 'GRAN_MAESTRO':
            oro_actual = user.gold if user.gold is not None else 0
            if oro_actual < recompensa:
                return Response(
                    {'error': 'Presupuesto insuficiente. Necesitas más oro para respaldar este contrato.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        with transaction.atomic():
            if user.role != 'GRAN_MAESTRO':
                user.gold -= recompensa
                user.save()

            return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def reclamar_recompensa(self, request, pk=None):
        if request.user.role not in ['GRAN_MAESTRO', 'MAESTRO']:
            return Response({'error': '¡Alto ahí, mortal! Solo los líderes pueden autorizar el pago.'}, status=403)

        quest = self.get_object()

        if quest.status != 'TESORO':
            return Response({'error': 'La misión aún no llega al tesoro.'}, status=400)
            
        if not quest.assigned_to:
            return Response({'error': 'Nadie fue asignado a esta misión.'}, status=400)

        cazador = quest.assigned_to

        if cazador.gold is None:
            cazador.gold = 0
            
        cazador.gold += quest.potential_reward 

        limite_maximo = Decimal('99999999.99')
        if cazador.gold > limite_maximo:
            cazador.gold = limite_maximo
        
        with transaction.atomic():
            cazador.save()
            quest.status = 'CEMENTERIO'
            quest.save()

        return Response({
            'mensaje': f'Recompensa entregada con éxito a {cazador.username}'
        })

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all().order_by('-created_at')
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['MAESTRO', 'GRAN_MAESTRO']:
            return Lead.objects.all().order_by('-created_at')
        return Lead.objects.filter(assigned_hunter=user).order_by('-created_at')
    
    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ['GRAN_MAESTRO', 'MAESTRO']:
            serializer.save(assigned_hunter=user)
        else:
            serializer.save()