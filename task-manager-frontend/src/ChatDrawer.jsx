import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function ChatDrawer({ isOpen, onClose, taskId, taskTitle, token }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Automatically scroll to the bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && taskId) {
      fetchChatHistory();
    }
  }, [isOpen, taskId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/ai/chat/${taskId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.messages || []);
    } catch (err) {
      console.error("Failed to load chat history", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setInputValue('');
    
    // Optimistically update the UI with the user's message immediately
    setMessages((prev) => [...prev, { role: 'USER', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/ai/chat/${taskId}/`,
        { message: userMsg },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Backend returns the updated list of messages containing the AI reply
      setMessages(response.data.messages);
    } catch (err) {
      console.error("Failed to send message to AI", err);
      setMessages((prev) => [
        ...prev,
        { role: 'AI', content: "Error: Could not get a response from your local model server." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.drawer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ flex: 1 }}>
            <h3 style={styles.headerTitle}>AI Assistant</h3>
            <p style={styles.headerSubtitle}>Discussing: {taskTitle}</p>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>

        {/* Messages Body */}
        <div style={styles.messageList}>
          {messages.length === 0 && !isLoading && (
            <p style={styles.emptyState}>No conversation history yet. Ask a question to start analyzing this task!</p>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageWrapper,
                justifyContent: msg.role === 'USER' ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  ...styles.bubble,
                  backgroundColor: msg.role === 'USER' ? '#1E88E5' : '#424242',
                  color: '#ffffff'
                }}
              >
                <strong>{msg.role === 'USER' ? 'You' : 'Jarvis'}</strong>
                <p style={{ margin: '5px 0 0 0', whiteSpace: 'pre-line' }}>{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ ...styles.messageWrapper, justifyContent: 'flex-start' }}>
              <div style={{ ...styles.bubble, backgroundColor: '#333333', color: '#aaa' }}>
                <em>Jarvis is thinking...</em>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSendMessage} style={styles.footer}>
          <input
            type="text"
            placeholder="Type your question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={styles.input}
            disabled={isLoading}
          />
          <button type="submit" style={styles.sendBtn} disabled={isLoading}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  drawer: {
    width: '450px',
    height: '100%',
    backgroundColor: '#232323',
    boxShadow: '-5px 0 15px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    color: '#fff',
    animation: 'slideIn 0.3s ease-out'
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #3d3d3d',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1a1a1a'
  },
  headerTitle: { margin: 0, fontSize: '1.2rem', color: '#90CAF9' },
  headerSubtitle: { margin: '4px 0 0 0', fontSize: '0.85rem', color: '#aaa' },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#aaa',
    fontSize: '2rem',
    cursor: 'pointer',
    padding: '0 10px'
  },
  messageList: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  emptyState: {
    color: '#888',
    textAlign: 'center',
    marginTop: '40px',
    fontSize: '0.95rem'
  },
  messageWrapper: { display: 'flex', width: '100%' },
  bubble: {
    maxWidth: '75%',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '0.95rem',
    lineHeight: '1.4'
  },
  footer: {
    padding: '15px',
    borderTop: '1px solid #3d3d3d',
    display: 'flex',
    gap: '10px',
    backgroundColor: '#1a1a1a'
  },
  input: {
    flex: 1,
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: '#2c2c2c',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none'
  },
  sendBtn: {
    backgroundColor: '#1E88E5',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default ChatDrawer;