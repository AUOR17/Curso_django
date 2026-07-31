from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import generics
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.conf import settings
from django.db import transaction
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiExample,
    OpenApiTypes,
)

from .serializers import RegisterSerializer
from core.permissions import EsMaestroDelGremio
from quests.models import Quest
from quests.serializers import QuestSerializer
from .models import User
from decimal import Decimal
from gremios.models import Gremio

User = get_user_model()


def set_jwt_cookies(response):
    if response.status_code == 200:
        access_token = response.data.get("access")
        refresh_token = response.data.get("refresh")

    if access_token:
        response.set_cookie(
            key=settings.SIMPLE_JWT["AUTH_COOKIE"],
            value=access_token,
            max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds(),
            httponly=True,
            samesite="Lax",
        )

    if refresh_token:
        response.set_cookie(
            key=settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"],
            value=refresh_token,
            max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds(),
            httponly=True,
            samesite="Lax",
        )

    response.data.pop("access", None)
    response.data.pop("refresh", None)
    response.data["message"] = "Login exitoso, los tokens se encuentran en las galletas"


@extend_schema_view(
    post=extend_schema(
        summary="Iniciar sesión (Login)",
        description="Autentica al usuario. Los tokens JWT no se devuelven en el JSON, sino que se guardan en cookies HTTP-only de forma segura.",
        responses={200: OpenApiTypes.OBJECT},
    )
)
class CookieTokenObtainPairView(TokenObtainPairView):
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        set_jwt_cookies(response)
        return response


@extend_schema_view(
    post=extend_schema(
        summary="Refrescar Token JWT",
        description="Utiliza la cookie del refresh_token para emitir y guardar un nuevo access_token en las cookies.",
        responses={200: OpenApiTypes.OBJECT},
    )
)
class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"])

        if isinstance(request.data, dict):
            request.data["refresh"] = refresh_token
        else:
            request.data._mutable = True
            request.data["refresh"] = refresh_token
            request.data._mutable = False

        response = super().post(request, *args, **kwargs)
        set_jwt_cookies(response)
        return response


@extend_schema_view(
    post=extend_schema(
        summary="Registrar un nuevo cazador",
        description="Crea un usuario. Si la petición la hace un Maestro, el recluta se asigna automáticamente a su gremio.",
    )
)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        nuevo_cazador = serializer.save()
        creador = self.request.user

        if creador.is_authenticated and creador.role == "MAESTRO":
            nuevo_cazador.gremio = creador.gremio
            nuevo_cazador.save()


class BovedaSecretaView(APIView):
    permission_classes = [EsMaestroDelGremio]

    @extend_schema(
        summary="Ver Bóveda Secreta",
        description="Devuelve el catálogo completo de misiones. Exclusivo para Maestros de Gremio.",
        responses={200: QuestSerializer(many=True)},
    )
    def get(self, request):
        misiones = Quest.objects.all()
        serializer = QuestSerializer(misiones, many=True)
        return Response(serializer.data)


class PerfilUsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Ver mi perfil",
        description="Devuelve los atributos básicos e información del gremio del usuario autenticado.",
        responses={200: OpenApiTypes.OBJECT},
    )
    def get(self, request):
        return Response(
            {
                "id": request.user.id,
                "username": request.user.username,
                "role": request.user.role,
                "level": request.user.level,
                "gremio_id": request.user.gremio_id,
                "gremio_nombre": (
                    request.user.gremio.nombre if request.user.gremio else None
                ),
            }
        )


class LogoutView(APIView):
    authentication_classes = []
    permission_classes = []

    @extend_schema(
        summary="Cerrar sesión (Logout)",
        description="Destruye las cookies que contienen los tokens de acceso y refresco del sistema.",
        request=None,
        responses={200: OpenApiTypes.OBJECT},
    )
    def post(self, request):
        response = Response(
            {"mensaje": "Haz abandonado el gremio, se destruyen las cookies"}
        )
        response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE"])
        response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"])
        return response


class CandidatosView(APIView):
    permission_classes = [EsMaestroDelGremio]

    @extend_schema(
        summary="Listar candidatos libres",
        description="Muestra todos los cazadores que no son líderes y aún no pertenecen a ningún gremio.",
        responses={200: OpenApiTypes.OBJECT},
    )
    def get(self, request):
        candidatos = User.objects.filter(gremio__isnull=True).exclude(
            role__in=["MAESTRO", "GRAN_MAESTRO"]
        )
        datos = [
            {"id": c.id, "username": c.username, "role": c.role} for c in candidatos
        ]
        return Response(datos)


class UsuarioViewSet(viewsets.ViewSet):
    permission_classes = [EsMaestroDelGremio]

    @extend_schema(
        summary="Liquidar fondos de un cazador",
        description="Resta una cantidad específica de oro del inventario del cazador seleccionado.",
        request={
            "application/json": {
                "type": "object",
                "properties": {"monto": {"type": "number", "format": "float"}},
                "required": ["monto"],
            }
        },
        responses={200: OpenApiTypes.OBJECT, 400: OpenApiTypes.OBJECT},
    )
    @action(detail=True, methods=["post"])
    def liquidar(self, request, pk=None):
        monto = Decimal(request.data.get("monto", 0))

        if monto <= 0:
            return Response({"error": "El monto debe ser positivo"}, status=400)

        user = get_object_or_404(User, id=pk)

        if user.gold is None:
            user.gold = Decimal("0.00")

        if user.gold < monto:
            return Response(
                {"error": "El cazador no tiene suficiente fondos para el retiro"},
                status=400,
            )

        with transaction.atomic():
            user.gold -= monto
            user.save()

        return Response(
            {"mensaje": f"Se liquidaron {monto} de la cuenta de {user.username}."}
        )

    @extend_schema(
        summary="Reclutar a un cazador",
        description="Asigna un gremio a un cazador. Un Maestro lo añade directamente a su sede; un Gran Maestro debe especificar el ID del gremio.",
        request={
            "application/json": {
                "type": "object",
                "properties": {"gremio_id": {"type": "integer"}},
            }
        },
        responses={
            200: OpenApiTypes.OBJECT,
            400: OpenApiTypes.OBJECT,
            403: OpenApiTypes.OBJECT,
        },
    )
    @action(detail=True, methods=["post"])
    def reclutar(self, request, pk=None):
        # Corrección: request.role -> request.user.role
        if request.user.role not in ["MAESTRO", "GRAN_MAESTRO"]:
            return Response({"error": "No tienes el rango suficiente"}, status=403)

        cazador = get_object_or_404(User, id=pk)

        if cazador.gremio is not None:
            return Response(
                {"error": "Este cazador ya pertenece a un gremio"}, status=400
            )

        if cazador.role in ["MAESTRO", "GRAN_MAESTRO"]:
            return Response({"error": "No puedes reclutar a un líder."}, status=400)

        if request.user.role == "MAESTRO":
            if not request.user.gremio:
                return Response(
                    {
                        "error": "No puedes reclutar: primero debes fundar o ser asignado a una Sede"
                    },
                    status=400,
                )
            # Corrección: request.gremio -> request.user.gremio
            cazador.gremio = request.user.gremio
        else:
            gremio_id = request.data.get("gremio_id")
            if not gremio_id:
                return Response(
                    {"error": "Se debe especificar un gremio_id"}, status=400
                )
            cazador.gremio = get_object_or_404(Gremio, id=gremio_id)

        cazador.save()
        return Response(
            {"mensaje": f"{cazador.username} se unió al gremio {cazador.gremio.nombre}"}
        )

    @extend_schema(
        summary="Expulsar a un cazador",
        description="Remueve a un cazador de su gremio actual. Los Maestros solo pueden expulsar miembros de su propia sede.",
        request=None,
        responses={
            200: OpenApiTypes.OBJECT,
            400: OpenApiTypes.OBJECT,
            403: OpenApiTypes.OBJECT,
        },
    )
    @action(detail=True, methods=["post"])
    def expulsar(self, request, pk=None):
        # Corrección: request.role -> request.user.role
        if request.user.role not in ["MAESTRO", "GRAN_MAESTRO"]:
            return Response({"error": "No tienes rango suficiente"}, status=403)

        cazador = get_object_or_404(User, id=pk)

        if cazador.gremio is None:
            return Response(
                {"error": "Este cazador no pertenece a ningún gremio"}, status=400
            )

        if cazador.role in ["MAESTRO", "GRAN_MAESTRO"]:
            return Response({"error": "No puedes expulsar al líder"}, status=400)

        if request.user.role == "MAESTRO" and cazador.gremio != request.user.gremio:
            return Response(
                {"error": "Solo puedes expulsar cazadores de tu propio gremio"},
                status=403,
            )

        nombre_gremio = cazador.gremio.nombre
        cazador.gremio = None
        cazador.save()

        return Response(
            {"mensaje": f"{cazador.username} fue expulsado de {nombre_gremio}"}
        )
