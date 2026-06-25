import React from "react";
import { BUSINESS_CONTEXT } from "../utils/gemini";

export default function TypingIndicator() {
  return (
    <div className="message-row bot" aria-live="polite" aria-label="AI is typing">
      <div className="message-avatar-circle bot">
        {BUSINESS_CONTEXT.initials}
      </div>
      <div className="message-bubble-wrapper">
        <div className="typing-bubble">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
