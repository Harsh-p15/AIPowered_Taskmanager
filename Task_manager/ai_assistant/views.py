from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from manage_task.models import Tasks
from .models import TaskChatSession, ChatMessage
from .serializers import TaskChatSessionSerializer, ChatMessageSerializer
from .pipeline import generate_ai_response

class TaskChatView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        """Retrieves the full chat history for a specific task."""
        try:
            task = Tasks.objects.get(task_id=task_id, user=request.user)
        except Tasks.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
            
        session, created = TaskChatSession.objects.get_or_create(tasks=task, user=request.user)
        serializer = TaskChatSessionSerializer(session)
        return Response(serializer.data)

    def post(self, request, task_id):
        """Sends a new message to the local Qwen model and returns the response."""
        try:
            task = Tasks.objects.get(task_id=task_id, user=request.user)
        except Tasks.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        user_message_text = request.data.get('message', '').strip()
        if not user_message_text:
            return Response({"error": "Message content cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Fetch or initialize the chat session block
        session, created = TaskChatSession.objects.get_or_create(tasks=task, user=request.user)

        # 2. Extract and format historical context for llama.cpp format compatibility
        past_messages = ChatMessage.objects.filter(session=session).order_by('-timestamp')[:8]
        past_messages = reversed(past_messages)
        history_list = []
        for msg in past_messages:
            role_name = "user" if msg.role == "USER" else "assistant"
            history_list.append({"role": role_name, "content": msg.content})

        # 3. Construct a specific context frame about the task details
        task_context = f"Title: '{task.title}'. Description: '{task.description or 'No description provided.'}'"

        # 4. Save the user's incoming message entry
        ChatMessage.objects.create(session=session, role='USER', content=user_message_text)

        # 5. Trigger the inference request to the llama.cpp server
        ai_reply = generate_ai_response(
            chat_history_list=history_list, 
            new_message_text=user_message_text, 
            task_context=task_context
        )

        # 6. Save the AI's response entry
        ChatMessage.objects.create(session=session, role='AI', content=ai_reply)

        # Return the updated chat array back up to the frontend
        updated_serializer = TaskChatSessionSerializer(session)
        return Response(updated_serializer.data, status=status.HTTP_201_CREATED)