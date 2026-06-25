import React, { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import TypingIndicator from "./TypingIndicator";
import { BUSINESS_CONTEXT } from "../utils/gemini";

export default function ChatWindow({ messages, isLoading, onSelectChip }) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on message list change or loading toggle
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const suggestedQuestions = [
    "Do you offer Cash on Delivery?",
    "What types of sarees do you sell?",
    "What is the delivery time?",
    "What is your return policy?",
    "What payment methods are accepted?"
  ];

  return (
    <div className="chat-messages">
      {messages.length === 0 ? (
        <div className="welcome-container">
          <div className="welcome-logo" aria-hidden="true">
            {BUSINESS_CONTEXT.initials}
          </div>
          <h1 className="welcome-title">Welcome to {BUSINESS_CONTEXT.name}</h1>
          <p className="welcome-subtitle">
            I am your virtual assistant. Ask me anything about our sarees, shipping, payments, returns, or support hours!
          </p>

          <h2 className="chips-title">Suggested Questions</h2>
          <div className="chips-grid">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onSelectChip(q)}
                className="chip-btn"
                aria-label={`Ask suggested question: ${q}`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={scrollRef} style={{ float: "left", clear: "both" }} />
        </>
      )}
    </div>
  );
}
