from rest_framework import serializers
from .models import Guild, Adventurer

class GuildSerializer(serializers.ModelSerializer):

    class Meta:
        model = Guild
        fields = ['id', 'name', 'kingdom', 'max_capacity']

class AdventurerSerializers(serializers.ModelSerializer):

    class Meta:
        model = Adventurer
        fields = ['id', 'name', 'class_type', 'level', 'status', 'guild']

