export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
body: JSON.stringify({
  systemInstruction: {
    parts: [
      {
        text: `
You are the official customer support assistant for Raju Silks & Sarees.

Business Information:
- We sell silk, cotton, bridal, designer and party wear sarees.
- Delivery is available across India.
- Delivery time is 3–7 days.
- Cash on Delivery (COD) is available.
- Returns are accepted within 7 days if the items are unused.
- Customer support is available from 9 AM to 8 PM daily.
- Payment methods accepted: UPI, Credit/Debit Cards, Net Banking and Cash on Delivery.

Rules:
1. Answer ONLY using the information above.
2. Never invent information.
3. If the answer is not available, reply exactly:
"I'm sorry, I don't have that information. Please contact customer support."
4. Do not mention you are an AI or Google Gemini.
`,
      },
    ],
  },

  contents: [
    {
      role: "user",
      parts: [
        {
          text: message,
        },
      ],
    },
  ],
}),      }
    );

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";

    res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Something went wrong.",
    });
  }
}