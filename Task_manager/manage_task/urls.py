from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('signup/', views.signup, name = 'signup'),
   
   path('tasks/<int:pk>/',views.TasksDetailView.as_view(), name = 'task_detail'),
   path('tasks/', views.TasksListCreateView.as_view(), name = 'task_list_create'),
]
