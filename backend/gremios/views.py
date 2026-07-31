from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db.models import Q
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiExample,
    OpenApiTypes,
)

from .models import Gremio
from .serializers import GremioSerializer, CazadorSerializer
from core.permissions import EsGranMaestro

User = get_user_model()


class GremioListView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Listar cazadores y gremios",
        description="Devuelve una lista de cazadores. La visibilidad depende del rol: el Gran Maestro ve todo, los demás ven a su gremio, líderes y novatos.",
        responses={200: CazadorSerializer(many=True)},
    )
    def get(self, request):
        if request.user.role == "GRAN_MAESTRO":
            cazadores = (
                User.objects.all()
                .select_related("gremio")
                .order_by("-level", "-experience")
            )
        else:
            cazadores = (
                User.objects.filter(
                    Q(gremio=request.user.gremio)
                    | Q(role__in=["MAESTRO", "GRAN_MAESTRO"])
                    | Q(gremio__isnull=True)
                )
                .select_related("gremio")
                .distinct()
                .order_by("-level", "experience")
            )

        serializer = CazadorSerializer(cazadores, many=True)
        return Response(serializer.data)


@extend_schema_view(
    get=extend_schema(summary="Listar todas las sedes/gremios"),
    post=extend_schema(summary="Crear una nueva sede (Requiere rol de Gran Maestro)"),
)
class GremioListCreateView(generics.ListCreateAPIView):
    queryset = Gremio.objects.all()
    serializer_class = GremioSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            permission_classes = [IsAuthenticated, EsGranMaestro]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]


class NombrarMaestroView(APIView):
    permission_classes = [EsGranMaestro]

    @extend_schema(
        summary="Nombrar a un Maestro de Sede",
        description="Otorga el rol de MAESTRO a un usuario y lo asigna como líder de una sede específica.",
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "user_id": {"type": "integer"},
                    "gremio_id": {"type": "integer"},
                },
                "required": ["user_id", "gremio_id"],
            }
        },
        responses={200: OpenApiTypes.OBJECT, 400: OpenApiTypes.OBJECT},
        examples=[
            OpenApiExample(
                "Asignación exitosa",
                value={"mensaje": "usuario_x ahora es Maestro de Los Lobos"},
                status_codes=["200"],
            ),
            OpenApiExample(
                "Error (Sede ocupada)",
                value={"error": "Esta sede ya tiene Maestro."},
                status_codes=["400"],
            ),
        ],
    )
    def post(self, request):
        user_id = request.data.get("user_id")
        gremio_id = request.data.get("gremio_id")

        user = get_object_or_404(User, id=user_id)
        gremio = get_object_or_404(Gremio, id=gremio_id)

        if User.objects.filter(role="MAESTRO", gremio=gremio).exists():
            return Response({"error": "Esta sede ya tiene Maestro."}, status=400)

        user.role = "MAESTRO"
        user.gremio = gremio
        user.save()

        return Response(
            {"mensaje": f"{user.username} ahora es Maestro de {gremio.nombre}"}
        )


class GremiosDisponiblesView(APIView):
    permission_classes = [EsGranMaestro]

    @extend_schema(
        summary="Ver gremios sin líder",
        description="Devuelve una lista de las sedes/gremios que actualmente no tienen a un Maestro o Gran Maestro asignado.",
        responses={200: GremioSerializer(many=True)},
    )
    def get(self, request):
        gremios_ocupados = User.objects.filter(
            role__in=["MAESTRO", "GRAN_MAESTRO"], gremio__isnull=False
        ).values_list("gremio_id", flat=True)

        gremios_libres = Gremio.objects.exclude(id__in=gremios_ocupados)
        serializer = GremioSerializer(gremios_libres, many=True)
        return Response(serializer.data)


class MiGremioView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Ver miembros de mi gremio",
        description="Devuelve la lista de cazadores que pertenecen al mismo gremio que el usuario autenticado (excluyendo a los líderes).",
        responses={200: CazadorSerializer(many=True)},
    )
    def get(self, request):
        if not request.user.gremio:
            return Response([])

        cazadores = User.objects.filter(gremio=request.user.gremio).exclude(
            role__in=["MAESTRO", "GRAN_MAESTRO"]
        )

        serializer = CazadorSerializer(cazadores, many=True)
        return Response(serializer.data)


class AsignarGremioView(APIView):
    permission_classes = [EsGranMaestro]

    @extend_schema(
        summary="Asignar sede a un cazador",
        description="Asigna un gremio a un usuario específico mediante sus IDs.",
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "user_id": {"type": "integer"},
                    "gremio_id": {"type": "integer"},
                },
                "required": ["user_id", "gremio_id"],
            }
        },
        responses={200: OpenApiTypes.OBJECT, 400: OpenApiTypes.OBJECT},
        examples=[
            OpenApiExample(
                "Ejemplo Exitoso",
                value={"mensaje": "Sede Los Lobos asignada a cazador_x"},
                status_codes=["200"],
            )
        ],
    )
    def post(self, request):
        user_id = request.data.get("user_id")
        gremio_id = request.data.get("gremio_id")

        user = get_object_or_404(User, id=user_id)
        gremio = get_object_or_404(Gremio, id=gremio_id)

        if User.objects.filter(role="MAESTRO", gremio=gremio).exists():
            return Response({"error": "Esta sede ya tiene Maestro."}, status=400)

        user.gremio = gremio
        user.save()

        return Response({"mensaje": f"Sede {gremio.nombre} asignada a {user.username}"})


class SedeMiembrosView(APIView):
    permission_classes = [EsGranMaestro]

    @extend_schema(
        summary="Consultar miembros de una sede",
        description="Devuelve todos los cazadores asignados a un gremio en particular, ordenados por nivel.",
        responses={200: CazadorSerializer(many=True)},
    )
    def get(self, request, gremio_id):
        cazadores = User.objects.filter(gremio_id=gremio_id).order_by("-level")
        serializer = CazadorSerializer(cazadores, many=True)
        return Response(serializer.data)


@extend_schema_view(
    get=extend_schema(summary="Detalle de una sede"),
    put=extend_schema(summary="Actualizar sede (Completo)"),
    patch=extend_schema(summary="Actualizar sede (Parcial)"),
    delete=extend_schema(summary="Eliminar una sede"),
)
class GremioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Gremio.objects.all()
    serializer_class = GremioSerializer

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            permission_classes = [IsAuthenticated, EsGranMaestro]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]
