import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import { BUSINESS_CONTEXT } from "./utils/gemini";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || isLoading) return;

    const userTime = getFormattedTime();
    const newUserMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      timestamp: userTime
    };

    // Update messages with user query
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call Gemini utility
const response = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: newUserMessage.text,
  }),
});

const data = await response.json();

const botReply = data.reply || data.message || data.error;

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botReply,
          timestamp: getFormattedTime()
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: `Error generating response: ${error.message}. Please verify your API key and connection, then try again.`,
          timestamp: getFormattedTime(),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the conversation?")) {
      setMessages([]);
    }
  };

  return (
    <div className="app-container">
      {/* Visual background blobs */}
      <div className="bg-blobs" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="chatbot-card">
        {/* Header */}
        <header className="chat-header">
          <div className="header-brand">
            <div className="brand-avatar">
              {BUSINESS_CONTEXT.initials}
            </div>
            <div className="brand-info">
              <span className="brand-name">{BUSINESS_CONTEXT.name}</span>
              <div className="brand-status">
                <span className="status-dot" />
                <span>Online Assistant</span>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button 
              onClick={handleClearChat} 
              className="action-btn"
              title="Clear entire conversation"
              aria-label="Clear chat"
              disabled={messages.length === 0}
              style={{ opacity: messages.length === 0 ? 0.4 : 1, cursor: messages.length === 0 ? "not-allowed" : "pointer" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </header>

        {/* Messages Frame */}
        <ChatWindow 
          messages={messages} 
          isLoading={isLoading} 
          onSelectChip={handleSendMessage} 
        />

        {/* Input Bar */}
        <div className="chat-input-container">          
          <form onSubmit={handleSubmit} className="chat-input-form">
            <input
              type="text"
              placeholder="Ask a question about sarees, delivery, returns..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="chat-input-field"
              disabled={isLoading}
              aria-label="Message Input"
            />
            <button
              type="submit"
              className="send-btn"
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
