import fs from "fs";
import pdfParse from "pdf-parse";

export async function readPDF() {
  const dataBuffer = fs.readFileSync("./data/Raju_Silks_Catalog.pdf");

  const data = await pdfParse(dataBuffer);

  return data.text;
}