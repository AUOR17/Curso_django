from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Gremio

User = get_user_model()

class GremioSerializer(serializers.ModelSerializer):

    class Meta:
        model = Gremio
        fields = ['id', 'nombre', 'descripcion']

class MaestroSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'password', 'gremio']
        extra_kwargs = {'password':{'write_only': True}}

    def create(self, validated_data):
        user = User(
            username = validated_data['username'],
            role = 'MAESTRO', 
            gremio = validated_data['gremio']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class CazadorSerializer(serializers.ModelSerializer):
    gremio_nombre = serializers.CharField(source = 'gremio.nombre', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'leve', 'gold', 'gremio_id', 'gremio_nombre']