from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Tasks(models.Model):
    task_id = models.AutoField(primary_key = True)
    title = models.CharField(max_length = 100)
    description = models.CharField(max_length = 500)
    created_At = models.DateTimeField(auto_now_add = True)
    due_date = models.DateField(blank = True, null = True)
    user = models.ForeignKey(User, on_delete = models.CASCADE)

    class TaskStatus(models.TextChoices):
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED','completed'
        HALTED = 'HALTED','halted'

    status = models.CharField(
        max_length = 20,
        choices = TaskStatus.choices,
        default = TaskStatus.IN_PROGRESS
    )    

    def __str__(self):
        return self.title

