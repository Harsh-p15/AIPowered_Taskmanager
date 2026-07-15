from ai_assistant.views import TaskChatView
from django.urls import path, include

urlpatterns = [
    path("chat/<int:task_id>/", TaskChatView.as_view(), name = 'task-ai-chat)')
]