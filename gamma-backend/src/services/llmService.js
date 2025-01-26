import { config } from "dotenv";
import { splitTextIntoChunks } from "../utils/textSplitter.js";
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

// Clean unwanted LLM-generated artifacts
const cleanSections = (sections) => {
  return sections
    .map((section) =>
      section
        .replace(/^\[|\]$/g, "") // Remove JSON-like array brackets
        .replace(/^"/, "") // Remove leading double quote
        .replace(/"$/, "") // Remove trailing double quote
        .replace(/\\n/g, "\n") // Convert escaped newlines to actual newlines
        .replace(/```.*?\n?/g, "") // Remove leading/trailing code block tags
        .replace(/\n```$/, "")
        .replace(/\n+/g, "\n") // Remove excessive newlines
        .trim()
    )
    .filter(Boolean); // Remove empty sections
};

// Adjust section count to match the required slides
const adjustSectionCount = (sections, slideCount) => {
  if (sections.length < slideCount) {
    // Fill empty slides if needed
    while (sections.length < slideCount) {
      sections.push("");
    }
  }

  if (sections.length > slideCount) {
    // Instead of truncating, consider merging logically
    let mergedSections = [];
    const mergeFactor = Math.ceil(sections.length / slideCount);
    for (let i = 0; i < sections.length; i += mergeFactor) {
      mergedSections.push(sections.slice(i, i + mergeFactor).join("\n\n"));
    }
    sections = mergedSections.slice(0, slideCount);
  }

  return sections;
};

const processWithLLM = async (document, slideCount, model = "gpt-4o-mini") => {
  console.log("Processing document with LLM...");
  console.log("Document content:", document);
  console.log("Target slides:", slideCount);
  console.log("Using model:", model);

  let preSplitSections = splitTextIntoChunks(document, slideCount);
  console.log("Pre-split sections:", preSplitSections);

  const prompt = `You are given a markdown document.

- Your task is to split the given markdown document into exactly ${slideCount} sections.
- Ensure each section contains meaningful content while preserving the original document structure.
- Retain markdown elements such as headers (e.g., #, ##), bullet points, and code blocks.
- Do NOT summarize, truncate, or modify content.
- Provide the response as a valid JSON array of strings without additional formatting.

Here is the document:

${document}

Please provide the output as a JSON array of plain text sections.`;

  console.log("Generated Prompt:", prompt);

  // Define the payload correctly and include the prompt
  const payload = {
    "gpt-4o-mini": {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert in markdown document structuring.",
        },
        { role: "user", content: prompt },
      ],
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

  console.log("Sending request to LLM...");
  const response = await fetch(LLM_ENDPOINTS[model], {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEYS[model]}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload[model]), // Using the correct model-specific payload
  });

  if (!response.ok) {
    console.error(
      "Error: LLM API request failed with status:",
      response.status
    );
    throw new Error(`LLM API request failed with status: ${response.status}`);
  }

  const data = await response.json();
  console.log("Raw LLM Response:", JSON.stringify(data, null, 2));

  let responseText;
  if (model === "gpt-4o-mini") {
    responseText = data.choices[0].message.content;
  } else if (model === "claude-3-haiku") {
    responseText = data.content;
  } else {
    responseText = data.candidates[0].content.parts[0].text;
  }

  console.log("Raw Content Before Parsing:", responseText);

  let sections;
  try {
    sections = JSON.parse(responseText);
    console.log("Parsed JSON Sections:", sections);
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    throw new Error("Invalid JSON response received from LLM.");
  }

  sections = cleanSections(sections);
  console.log("Cleaned Sections:", sections);

  sections = adjustSectionCount(sections, slideCount);
  console.log("Final Sections Adjusted to Slide Count:", sections);

  return sections;
};

export { processWithLLM };
