from rest_framework.permissions import BasePermission


class EsMaestroDelGremio(BasePermission):

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ["MAESTRO", "GRAN_MAESTRO"]
        )


class EsGranMaestro(BasePermission):

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "GRAN_MAESTRO"
        )
