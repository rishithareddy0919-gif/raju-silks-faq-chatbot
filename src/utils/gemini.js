/**
 * Business Information Knowledge Base
 * Easily replaceable for other businesses in the future.
 */
export const BUSINESS_CONTEXT = {
  name: "Raju Silks & Sarees",
  shortName: "Raju Silks",
  initials: "RS",
  knowledge: [
    "We sell silk, cotton, bridal, designer and party wear sarees.",
    "Delivery is available across India.",
    "Delivery time is 3–7 days.",
    "Cash on Delivery (COD) is available.",
    "Returns are accepted within 7 days if the items are unused.",
    "Customer support is available from 9 AM to 8 PM daily.",
    "Payment methods accepted: UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery."
  ]
};

/**
 * Generates system instructions for the Gemini API based on business context.
 */
const getSystemInstructions = () => {
  const knowledgeBaseText = BUSINESS_CONTEXT.knowledge
    .map((item) => `- ${item}`)
    .join("\n");

  return `You are a professional customer support assistant for "${BUSINESS_CONTEXT.name}".
Your knowledge is STRICTLY limited to the following information:
${knowledgeBaseText}

Strict instructions:
1. Answer the user's questions ONLY using the information provided in the knowledge base above.
2. If the user's question cannot be fully and accurately answered using ONLY the provided knowledge base, you MUST respond with EXACTLY this text and nothing else:
"I'm sorry, I don't have that information. Please contact customer support."
3. Do NOT make up any details, policies, prices, addresses, or phone numbers. If the user asks about anything not mentioned in the knowledge base (e.g. location of the physical shop, custom discounts, other clothing items like kurtas, shirts, etc.), you must output the exact sentence in rule 2.
4. Keep the response polite, direct, and concise. Do not add conversational fluff or say "Based on my knowledge base..." or "As an AI...". Just state the facts.
5. Display formatting using standard spacing and list markers if needed, but do not use Markdown tables or complex styling.`;
};

/**
 * A client-side mock fallback that simulates the chatbot's answers offline
 * if no Gemini API Key is provided. Matches simple keywords.
 */
export const getOfflineMockResponse = (userMessage) => {
  const query = userMessage.toLowerCase().trim();

  // Match keyword checks
  const matchesSarees = /\b(saree|sarees|silk|cotton|bridal|designer|wear|product|sell|clothes|type|what do you)\b/i.test(query);
  const matchesDelivery = /\b(delivery|shipping|ship|deliver|days|how long|reach|arrive|time|delivers)\b/i.test(query);
  const matchesCod = /\b(cod|cash on delivery|cash|on delivery)\b/i.test(query);
  const matchesReturns = /\b(return|refund|exchange|returns|unused|policy|replace)\b/i.test(query);
  const matchesSupport = /\b(support|contact|help|hours|customer support|phone|call|email|time|open|9|8|pm|am)\b/i.test(query);
  const matchesPayment = /\b(payment|pay|upi|card|cards|net banking|banking|methods|method|accept)\b/i.test(query);

  // Return responses aligning strictly with the KB
  if (matchesSarees && !query.includes("delivery") && !query.includes("return")) {
    return "We sell silk, cotton, bridal, designer and party wear sarees.";
  }
  if (matchesDelivery) {
    if (query.includes("time") || query.includes("days") || query.includes("how long")) {
      return "Delivery time is 3–7 days.";
    }
    return "Delivery is available across India. The delivery time is 3–7 days.";
  }
  if (matchesCod) {
    return "Yes, Cash on Delivery is available.";
  }
  if (matchesReturns) {
    return "Returns are accepted within 7 days if the items are unused.";
  }
  if (matchesSupport) {
    return "Our customer support is available from 9 AM to 8 PM.";
  }
  if (matchesPayment) {
    return "We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery.";
  }

  // Exact fallback
  return "I'm sorry, I don't have that information. Please contact customer support.";
};

/**
 * Sends chat prompt to Gemini API
 * @param {string} promptUser - The current message from the user
 * @param {Array} history - Previous messages array [{ role: 'user' | 'model', text: string }]
 * @param {string} apiKey - Gemini API key
 */
export const askGemini = async (promptUser, history = [], apiKey) => {
  if (!apiKey) {
    // If no API key is specified, simulate network delay and return the offline mock
    await new Promise((resolve) => setTimeout(resolve, 800));
    return getOfflineMockResponse(promptUser);
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  // Formulate the contents payload including history
  // Formatted as: [{ role: 'user' | 'model', parts: [{ text: string }] }]
  const contents = [];

  // Add relevant history (keep last 10 messages for context efficiency)
  const recentHistory = history.slice(-10);
  recentHistory.forEach((msg) => {
    contents.push({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    });
  });

  // Add current message
  contents.push({
    role: "user",
    parts: [{ text: promptUser }]
  });

  const payload = {
    contents,
    systemInstruction: {
      parts: [{ text: getSystemInstructions() }]
    },
    generationConfig: {
      temperature: 0.1,
      topP: 0.95,
      maxOutputTokens: 250
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData?.error?.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Parse response text
    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error("Received an empty response from Gemini API.");
    }

    return responseText.trim();
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw error;
  }
};
