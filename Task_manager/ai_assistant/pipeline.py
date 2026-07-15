import requests
import json

LLAMA_SERVER_URL = "http://localhost:8080/v1/chat/completions"

def generate_ai_response(chat_history_list, new_message_text, task_context=""):
    """
    Sends the conversation history and a new prompt directly to the running 
    llama.cpp server using an OpenAI-compatible completion request payload.
    """
    # 1. Structure the foundational system prompt
    system_prompt = (
        "You are an intelligent project management assistant. Help the user break down, "
        f"understand, and plan their tasks. Current task focus context: {task_context}"
    )
    
    messages = [{"role": "system", "content": system_prompt}]
    
    # 2. Append the historic message objects 
    # chat_history_list should pass objects/dicts matching: {"role": "user"|"assistant", "content": "..."}
    for msg in chat_history_list:
        messages.append(msg)
        
    # 3. Append the newest message
    messages.append({"role": "user", "content": new_message_text})
    
    payload = {
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 400
    }
    
    try:
        response = requests.post(
            LLAMA_SERVER_URL, 
            headers={"Content-Type": "application/json"}, 
            data=json.dumps(payload),
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content'].strip()
        else:
            return f"Error from Llama server: Status {response.status_code}"
            
    except requests.exceptions.RequestException as e:
        return "Could not connect to the local Llama server. Ensure llama-server is running on port 8080."