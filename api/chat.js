import { readPDF } from "./readPdf.js";

export default async function handler(req, res) {
  try {
    const pdfText = await readPDF();

    return res.status(200).json({
      reply: pdfText.substring(0, 1000), // Return first 1000 characters
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
}