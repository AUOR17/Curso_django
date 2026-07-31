from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.db import transaction
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiExample,
    OpenApiTypes,
)

from .models import Quest, Lead
from .serializers import QuestSerializer, LeadSerializer
from decimal import Decimal


@extend_schema_view(
    list=extend_schema(
        summary="Listar misiones del tablero",
        description="Muestra las misiones. Un Gran Maestro ve todas; los demás ven las públicas o las de su gremio.",
    ),
    retrieve=extend_schema(summary="Detalle de una misión"),
    update=extend_schema(summary="Actualizar misión (Completo)"),
    partial_update=extend_schema(summary="Actualizar misión (Parcial)"),
    destroy=extend_schema(summary="Eliminar misión"),
)
class QuestViewSet(viewsets.ModelViewSet):
    serializer_class = QuestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "GRAN_MAESTRO":
            return Quest.objects.all().select_related("assigned_to", "gremio")

        return Quest.objects.filter(
            Q(gremio__isnull=True) | Q(gremio=user.gremio)
        ).select_related("assigned_to", "gremio")

    def perform_create(self, serializer):
        user = self.request.user

        if user.role == "GRAN_MAESTRO":
            gremio_id = self.request.data.get("gremio_id")
            serializer.save(gremio_id=gremio_id)
        elif user.role == "MAESTRO":
            serializer.save(gremio=user.gremio)
        else:
            serializer.save()

    @extend_schema(
        summary="Crear una nueva misión",
        description="Crea una misión. Si el creador no es un Gran Maestro, se descontará el oro equivalente a la recompensa de su cuenta personal de forma automática.",
        responses={201: QuestSerializer, 400: OpenApiTypes.OBJECT},
        examples=[
            OpenApiExample(
                "Sin fondos suficientes",
                value={
                    "error": "Presupuesto insuficiente. Necesitas más oro para respaldar este contrato."
                },
                response_only=True,
                status_codes=["400"],
            )
        ],
    )
    def create(self, request, *args, **kwargs):
        user = request.user
        recompensa = Decimal(request.data.get("potential_reward", 0))

        if user.role != "GRAN_MAESTRO":
            oro_actual = user.gold if user.gold is not None else 0
            if oro_actual < recompensa:
                return Response(
                    {
                        "error": "Presupuesto insuficiente. Necesitas más oro para respaldar este contrato."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        with transaction.atomic():
            if user.role != "GRAN_MAESTRO":
                user.gold -= recompensa
                user.save()

            return super().create(request, *args, **kwargs)

    @extend_schema(
        summary="Reclamar recompensa de misión",
        description="Transfiere el oro de la recompensa al cazador asignado y cambia el estado de la misión a CEMENTERIO. Operación exclusiva para líderes.",
        request=None,  # No requiere cuerpo en la petición (POST vacío)
        responses={
            200: OpenApiTypes.OBJECT,
            400: OpenApiTypes.OBJECT,
            403: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample(
                "Éxito",
                value={"mensaje": "Recompensa entregada con éxito a cazador_x"},
                status_codes=["200"],
            ),
            OpenApiExample(
                "Error de Estado",
                value={"error": "La misión aún no llega al tesoro."},
                status_codes=["400"],
            ),
            OpenApiExample(
                "Error de Asignación",
                value={"error": "Nadie fue asignado a esta misión."},
                status_codes=["400"],
            ),
            OpenApiExample(
                "Permisos Insuficientes",
                value={
                    "error": "¡Alto ahí, mortal! Solo los líderes pueden autorizar el pago."
                },
                status_codes=["403"],
            ),
        ],
    )
    @action(detail=True, methods=["post"])
    def reclamar_recompensa(self, request, pk=None):
        if request.user.role not in ["GRAN_MAESTRO", "MAESTRO"]:
            return Response(
                {
                    "error": "¡Alto ahí, mortal! Solo los líderes pueden autorizar el pago."
                },
                status=403,
            )

        quest = self.get_object()

        if quest.status != "TESORO":
            return Response({"error": "La misión aún no llega al tesoro."}, status=400)

        if not quest.assigned_to:
            return Response({"error": "Nadie fue asignado a esta misión."}, status=400)

        cazador = quest.assigned_to

        if cazador.gold is None:
            cazador.gold = 0

        cazador.gold += quest.potential_reward

        limite_maximo = Decimal("99999999.99")
        if cazador.gold > limite_maximo:
            cazador.gold = limite_maximo

        with transaction.atomic():
            cazador.save()
            quest.status = "CEMENTERIO"
            quest.save()

        return Response(
            {"mensaje": f"Recompensa entregada con éxito a {cazador.username}"}
        )


@extend_schema_view(
    list=extend_schema(
        summary="Listar prospectos (Leads)",
        description="Muestra los leads. Líderes ven el listado general, cazadores estándar (Guerreros, Magos) solo ven los leads que tienen asignados.",
    ),
    retrieve=extend_schema(summary="Detalle de un prospecto"),
    create=extend_schema(
        summary="Crear un nuevo prospecto",
        description="Registra un Lead. Si lo crea un cazador estándar, se le auto-asigna de inmediato.",
    ),
    update=extend_schema(summary="Actualizar prospecto (Completo)"),
    partial_update=extend_schema(summary="Actualizar prospecto (Parcial)"),
    destroy=extend_schema(summary="Eliminar prospecto"),
)
class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all().order_by("-created_at")
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ["MAESTRO", "GRAN_MAESTRO"]:
            return Lead.objects.all().order_by("-created_at")
        return Lead.objects.filter(assigned_hunter=user).order_by("-created_at")

    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ["GRAN_MAESTRO", "MAESTRO"]:
            serializer.save(assigned_hunter=user)
        else:
            serializer.save()
