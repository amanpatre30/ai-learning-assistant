import fs from "fs/promises";
import { parse } from "path";
import { PDFParse } from "pdf-parse";

/**
 * Exract text from PDF file
 * @param {string} filePath - Path to PDF file
 * @returns{Promise<{text: string , numPages: number}>}
 */

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    //pdf-patrse expects a Uint8Array, not a Buffer
    const parser = new PDFParse(new Uint8Array(dataBuffer));
    const data = await parser.getText();

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error("PDF parsing error :", error);
    throw new Error("Failed to eextract text from PDF");
  }
};
