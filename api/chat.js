import { readPDF } from "./readPdf.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { message } = req.body;

    // Read the PDF
    const pdfText = await readPDF();

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

Rules:
1. Answer ONLY using the information provided in the business document.
2. Never invent or assume information.
3. If the answer is not present in the document, reply EXACTLY:
"I'm sorry, I don't have that information. Please contact customer support."
4. Do not mention that you are an AI, Gemini, or Google.
`,
              },
            ],
          },

          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
Business Document:

${pdfText}

User Question:

${message}
`,
                },
              ],
            },
          ],

          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 250,
          },
        }),
      }
    );

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));

console.log("Gemini API Response:");
console.log(JSON.stringify(data, null, 2));

if (!response.ok) {
  return res.status(response.status).json({
    error: data.error || data,
  });
}

const reply =
  data?.candidates?.[0]?.content?.parts?.[0]?.text ||
  "I'm sorry, I don't have that information. Please contact customer support.";

    return res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error("Chat API Error:", error);

    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
}