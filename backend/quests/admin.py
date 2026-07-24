from django.contrib import admin
from .models import Quest, Lead

@admin.register(Quest)
class QuestAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'difficulty_level', 'assigned_to')
    list_filter = ('status', 'difficulty_level')
    search_fields = ('title', 'description')

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('name', 'race_class', 'threat_level', 'estimated_reward', 'status', 'assigned_hunter')
    list_filter = ('status', 'threat_level')
    search_fields = ('name', 'race_class')