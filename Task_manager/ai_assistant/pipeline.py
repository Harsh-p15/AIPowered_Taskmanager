import requests
import json
from django.conf import settings  #Import Django settings

# 💡 paste your copied Groq API key here (Keep it in quotes)
GROQ_API_KEY = settings.GROQ_API_KEY
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

def generate_ai_response(chat_history_list, new_message_text, task_context):
    """
    Sends the conversation and task data to Groq's high-speed cloud endpoint.
    """
    # 1. Build the baseline system prompt providing the model with its identity and context
    system_prompt = (
        "You are jarvis, a highly efficient AI project assistant. "
        "Your goal is to help the user manage, break down, and execute their tasks effectively.\n\n"
        f"Current Task Context:\n{task_context}"
    )
    
    # 2. Compile the full messaging payload layout matching OpenAI specification standards
    messages = [{"role": "system", "content": system_prompt}]
    
    # Append the historical logs we pulled from Django DB
    for msg in chat_history_list:
        messages.append({"role": msg["role"], "content": msg["content"]})
        
    # Append the brand new message incoming from the frontend drawer panel
    messages.append({"role": "user", "content": new_message_text})
    
    # 3. Formulate payload targeting a fast open-source model like llama-3.3-70b or qwen variants available
    payload = {
        "model": "openai/gpt-oss-120b", # Or llama3-8b-8192" / qwen-2.5-coder-32b depending on availability
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1024
    }
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(GROQ_URL, headers=headers, data=json.dumps(payload), timeout=15)
        
        if response.status_code == 200:
            response_data = response.json()
            return response_data['choices'][0]['message']['content']
        else:
            print(f"Groq API Error Status: {response.status_code} - {response.text}")
            return "Error: The cloud AI service encountered an issue processing the request."
            
    except requests.exceptions.RequestException as e:
        print(f"Connection exception hitting Groq Cloud: {e}")
        return "Error: Could not establish a connection out to the cloud AI server pipeline."