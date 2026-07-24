from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Quest, Lead

User = get_user_model()

class UserRPGSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'level']

class QuestSerializer(serializers.ModelSerializer):

    assigned_to_details = UserRPGSerializer(source='assigned_to', read_only =True)
    gremio_nombre = serializers.CharField(source='gremio.nombre', read_only=True)

    class Meta:
        model = Quest
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class LeadSerializer(serializers.ModelSerializer):

    hunter_name = serializers.CharField(source='assigned_hunter.username', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
            model = Lead
            fields = '__all__'
