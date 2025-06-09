'use client';

import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FiSend, FiLogOut } from 'react-icons/fi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

const ChatInterface = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', title: 'New Chat', messages: [] }
  ]);
  const [currentConversationId, setCurrentConversationId] = useState('1');
  const [input, setInput] = useState('');
  const { user } = useUser();

  const currentConversation = conversations.find(conv => conv.id === currentConversationId);

  const generateResponse = (userMessage: string): string => {
    // Convert message to lowercase for easier matching
    const message = userMessage.toLowerCase();

    // Simple response patterns
    if (message.includes('hello') || message.includes('hi')) {
      return 'Hello! How can I help you today?';
    }
    
    if (message.includes('how are you')) {
      return "I'm doing well, thank you for asking! How can I assist you?";
    }

    if (message.includes('bye') || message.includes('goodbye')) {
      return 'Goodbye! Have a great day!';
    }

    if (message.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with?";
    }

    if (message.includes('help')) {
      return 'I can help you with various tasks. Just let me know what you need!';
    }

    if (message.includes('name')) {
      return "I'm Chatbot, your friendly AI assistant!";
    }

    if (message.includes('weather')) {
      return "I'm sorry, I don't have access to real-time weather data. You might want to check a weather service for that information.";
    }

    if (message.includes('time')) {
      return `The current time is ${new Date().toLocaleTimeString()}`;
    }

    if (message.includes('date')) {
      return `Today's date is ${new Date().toLocaleDateString()}`;
    }

    // Default response for unknown queries
    return "I'm not sure I understand. Could you please rephrase your question or ask something else?";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, messages: [...conv.messages, newMessage] }
        : conv
    ));
    setInput('');

    // Generate and send response
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response
      };
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { ...conv, messages: [...conv.messages, assistantMessage] }
          : conv
      ));
    }, 1000);
  };

  const startNewChat = () => {
    const newId = (conversations.length + 1).toString();
    setConversations(prev => [...prev, { id: newId, title: 'New Chat', messages: [] }]);
    setCurrentConversationId(newId);
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(conversations[0]?.id || '1');
    }
  };

  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <div className="d-flex flex-column h-100">
          <div className="mb-4">
            <h5 className="mb-3">Chat History</h5>
            {/* Add chat history here */}
          </div>
          
          <div className="mt-auto">
            {user && (
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  {user.picture && (
                    <img 
                      src={user.picture} 
                      alt={user.name || 'User'} 
                      className="rounded-circle me-2"
                      style={{ width: '32px', height: '32px' }}
                    />
                  )}
                  <span className="text-truncate">{user.name || 'User'}</span>
                </div>
                <a 
                  href="/api/auth/logout" 
                  className="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <FiLogOut />
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow-1 d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
        {/* Messages */}
        <div className="flex-grow-1 p-3 overflow-auto">
          {currentConversation?.messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-[#202124] mb-2">Gemini</h1>
                <p className="text-[#5f6368]">How can I help you today?</p>
              </div>
            </div>
          )}
          {currentConversation?.messages.map((message, index) => (
            <div
              key={index}
              className={`d-flex mb-3 ${
                message.role === 'user' ? 'justify-content-end' : 'justify-content-start'
              }`}
            >
              <div
                className={`p-3 rounded-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white border'
                }`}
                style={{ maxWidth: '80%' }}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-3 border-top bg-white">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <FiSend />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface; 