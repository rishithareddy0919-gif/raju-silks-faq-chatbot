import React, { useState } from "react";
import { BUSINESS_CONTEXT } from "../utils/gemini";

export default function MessageItem({ message }) {
  const { sender, text, timestamp, isError } = message;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const isBot = sender === "bot";

  return (
    <div className={`message-row ${sender} ${isError ? "error" : ""}`}>
      {isBot && (
        <div className="message-avatar-circle bot" aria-hidden="true">
          {BUSINESS_CONTEXT.initials}
        </div>
      )}
      
      <div className="message-bubble-wrapper">
        <div className="message-bubble">
          {text}
        </div>
        
        <div className="message-meta">
          <span className="message-time">{timestamp}</span>
          
          {isBot && !isError && (
            <button
              onClick={handleCopy}
              className={`copy-button ${copied ? "copied" : ""}`}
              title="Copy message to clipboard"
              aria-label={copied ? "Copied response to clipboard" : "Copy response to clipboard"}
            >
              {copied ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {!isBot && (
        <div className="message-avatar-circle user" aria-hidden="true">
          U
        </div>
      )}
    </div>
  );
}
