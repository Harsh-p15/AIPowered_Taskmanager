from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from manage_task.models import Tasks
from .serializers import TaskSerializer, RegisterSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes

# Create your views here.
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def signup(request):
    if request.method == 'GET':
        return Response({"message": "Submit a POST request with username and password to register."})
    
    serializer = RegisterSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "user Registered"})
    return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
#list and create tasks
class TasksListCreateView(generics.ListCreateAPIView): 
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tasks.objects.filter(user= self.request.user)

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)  

#REtreive , update and delete tasks

class TasksDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = ( "pk" )

    def get_queryset(self):
        return Tasks.objects.filter(user= self.request.user)
            

