from rest_framework import serializers
from .models import TaskChatSession, ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id','role','content','timestamp']

class TaskChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    task_title = serializers.CharField(source = 'task.title',read_only = True)
    class Meta:
        model = TaskChatSession
        fields = ['id','task','task_title','messages','created_at']
