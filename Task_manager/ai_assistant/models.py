from django.db import models
from django.contrib.auth.models import User
from manage_task.models import Tasks

class TaskChatSession(models.Model):
    tasks=models.OneToOneField(Tasks, on_delete=models.CASCADE, related_name = 'chat_session')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return f"chat session for task: {self.task.title}"
     
class ChatMessage(models.Model):
    ROLE_CHOICES = [
        ('USER', 'user'),
        ('AI', 'Assistant')
    ]   
    
    session = models.ForeignKey(TaskChatSession, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=5, choices=ROLE_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']  # Keeps the conversation line in absolute order

    def __str__(self):
        return f"{self.role}: {self.content[:30]}"

# Create your models here.
