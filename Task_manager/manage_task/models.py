from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Tasks(models.Model):
    task_id = models.AutoField(primary_key = True)
    title = models.CharField(max_length = 100)
    description = models.CharField(max_length = 500)
    created_At = models.DateTimeField(auto_now_add = True)
    user = models.ForeignKey(User, on_delete = models.CASCADE)
