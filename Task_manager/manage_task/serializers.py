from rest_framework import serializers
from manage_task.models import Tasks
from django.contrib.auth.models import User

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tasks
        fields = "__all__"
        read_only_fields = ['user']

#serialiser for user Resgistration
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create( self, validated_data):
        user = User.objects.create_user(
            username = validated_data["username"],
            email = validated_data.get("email", ""),
            password = validated_data["password"],
        )
        return user

