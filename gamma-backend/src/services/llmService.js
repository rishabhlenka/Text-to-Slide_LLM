import { config } from "dotenv";
import {
  splitTextIntoChunks,
  splitForBatchProcessing,
} from "../utils/textSplitter.js";
config();

const LLM_ENDPOINTS = {
  "gpt-4o-mini": "https://api.openai.com/v1/chat/completions",
  "claude-3-haiku": "https://api.anthropic.com/v1/messages",
  "gemini-1.5-flash":
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
};

const API_KEYS = {
  "gpt-4o-mini": process.env.OPENAI_API_KEY,
  "claude-3-haiku": process.env.ANTHROPIC_API_KEY,
  "gemini-1.5-flash": process.env.GEMINI_API_KEY,
};

// Function to process LLM call
const fetchLLMResponse = async (document, slideCount, model) => {
  const prompt = `You are given a markdown document.

- Split the document into exactly ${slideCount} sections.
- Ensure each section contains meaningful content while preserving the original document structure.
- Retain markdown elements such as headers (e.g., #, ##), bullet points (-, *), and numbered lists (1., 2.).
- Return the result as a plain JSON array with no formatting, code blocks, or additional text.
- Do NOT include markdown formatting like \`**\`, \`*\`, \`###\` in the output.
- Do NOT summarize, truncate, or modify content. 

Here is the document:

${document}

Please provide the output as a clean JSON array of plain text sections.`;

  const payload = {
    "gpt-4o-mini": {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    },
    "claude-3-haiku": {
      model: "claude-3-haiku",
      prompt,
      max_tokens: 2000,
    },
    "gemini-1.5-flash": {
      contents: [{ parts: [{ text: prompt }] }],
    },
  };

  const response = await fetch(LLM_ENDPOINTS[model], {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEYS[model]}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload[model]),
  });

  if (!response.ok) {
    throw new Error(`LLM API request failed with status: ${response.status}`);
  }

  const data = await response.json();
  let responseText;
  if (model === "gpt-4o-mini") {
    responseText = data.choices[0].message.content;
  } else if (model === "claude-3-haiku") {
    responseText = data.content;
  } else {
    responseText = data.candidates[0].content.parts[0].text;
  }

  console.log("Raw Content Before Parsing:", responseText);

  responseText = responseText
    .replace(/```json/g, "") // Remove markdown code block
    .replace(/```/g, "") // Remove closing code block
    .replace(/\\n/g, "\n") // Convert escaped newlines
    .replace(/\s+\n/g, "\n") // Remove leading spaces before newlines
    .replace(/\n\s+/g, "\n") // Remove trailing spaces after newlines
    .replace(/\n{2,}/g, "\n\n") // Ensure consistent paragraph breaks
    .replace(/"\s*,\s*"/g, '","') // Fix JSON array spacing issues
    .replace(/,\s*]/g, "]") // Remove trailing commas in arrays
    .replace(/\s{2,}/g, " ") // Collapse multiple spaces into one
    .trim();

  let parsedData;
  try {
    parsedData = JSON.parse(responseText);
  } catch (error) {
    console.error("JSON Parsing Error:", error, "Received Text:", responseText);
    throw new Error(
      "Invalid JSON response received. Please check LLM response."
    );
  }
  return parsedData;
};

// Main processing function with batch handling
const processWithLLM = async (document, slideCount, model = "gpt-4o-mini") => {
  console.log("Processing document with LLM...");

  const chunks = splitForBatchProcessing(document);
  console.log(`Processing ${chunks.length} chunks separately...`);

  let allSections = [];

  for (const chunk of chunks) {
    console.log("Processing chunk:", chunk.substring(0, 100) + "...");
    try {
      const responseSections = await fetchLLMResponse(chunk, slideCount, model);
      allSections = allSections.concat(responseSections);
    } catch (error) {
      console.error("Error processing chunk:", error);
      throw error;
    }
  }

  // Post-process and split into required slide count
  let preSplitSections = splitTextIntoChunks(
    allSections.join("\n\n"),
    slideCount
  );

  if (preSplitSections.length < slideCount) {
    while (preSplitSections.length < slideCount) {
      preSplitSections.push("");
    }
  }

  console.log("Final Sections Adjusted to Slide Count:", preSplitSections);
  return preSplitSections;
};

export { processWithLLM };
