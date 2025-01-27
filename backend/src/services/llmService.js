import { config } from "dotenv";
config();

// Define LLM API endpoints
const LLM_ENDPOINTS = {
  "gpt-4o-mini": "https://api.openai.com/v1/chat/completions",
};

// Load keys from .env file
const API_KEYS = {
  "gpt-4o-mini": process.env.OPENAI_API_KEY,
};

/**
 * Splits a document into smaller chunks with overlap to maintain context between sections.
 *
 * @param {string} document - The input markdown document.
 * @param {number} chunkSize - Maximum size of each chunk.
 * @param {number} overlapSize - Overlapping characters to include at the beginning of the next chunk for continuity.
 * @returns {string[]} An array of document chunks with overlap.
 */
const splitDocumentForBatchingWithOverlap = (
  document,
  chunkSize,
  overlapSize
) => {
  // Regex to split at markdown boundaries like headers, bullet points, etc.
  const regex = /(?=\n##? |(?<=\n)\s*[-*]\s|\n\n)/g;
  const sections = document.split(regex);

  let batches = [];
  let currentBatch = "";

  sections.forEach((section) => {
    if ((currentBatch + section).length > chunkSize) {
      // Store the current bath and add an overlap to maintain context for LLM
      batches.push(currentBatch.trim());
      currentBatch = section.slice(-overlapSize);
    } else {
      currentBatch += section;
    }
  });

  if (currentBatch) batches.push(currentBatch.trim());
  return batches;
};

/**
 * Calls the LLM API to split the document chunk into slide sections.
 *
 * @param {string} document - The document chunk to process.
 * @param {number} slidesPerChunk - Number of slides to generate for this chunk.
 * @param {string} model - The LLM model to use for processing.
 * @returns {Promise<string[]>} A promise resolving to an array of slide sections.
 */
const fetchLLMSplitSlides = async (document, slidesPerChunk, model) => {
  const prompt = `You are given a markdown document.

- Divide the given document into exactly ${slidesPerChunk} sections in a meaningful way.
- Prioritize split points at logical breaks such as:
  - At the beginning of major sections or sub-sections marked by headers (e.g., #, ##, ###)
  - Before significant bullet points (e.g., - or *)
  - At natural paragraph breaks (double line breaks \\n\\n)
  - At the end of sentences (periods followed by a newline).
- **Ensure all content is included and nothing is omitted, even if slides exceed the requested count.**

---

**Now analyze the following markdown document and provide the slides for only this section of text:**

${document}

--- DO NOT INCLUDE BELOW TEXT ---

### Important Output Format:
You MUST respond with a valid JSON object that contains:

\`\`\`json
{
  "slides": ["string", "string", "string", "..."]
}
\`\`\`

Do NOT include explanations, headers, or any additional text before or after the JSON output.
`;

  const payload = {
    model: model,
    messages: [
      {
        role: "system",
        content:
          "You are an assistant trained to analyze markdown documents and suggest optimal slides strictly following the given format.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 3000,
    response_format: { type: "json_object" }, // Force LLM to output JSON
  };

  // Call the LLM, can be modified to be model agnostic
  const response = await fetch(LLM_ENDPOINTS[model], {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEYS[model]}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`LLM API request failed with status: ${response.status}`);
  }

  const data = await response.json();
  const responseText = data.choices[0].message.content;

  console.log("Raw Content Before Parsing:", responseText);

  let parsedData;
  try {
    parsedData = JSON.parse(responseText.trim());

    if (!Array.isArray(parsedData.slides)) {
      throw new Error("Invalid JSON format received.");
    }

    return parsedData.slides;
  } catch (error) {
    console.error("JSON Parsing Error:", error, "Received Text:", responseText);
    throw new Error("Invalid JSON response received from LLM.");
  }
};

/**
 * Processes the entire document by splitting it into chunks and using the LLM to generate slides.
 *
 * @param {string} document - The complete markdown document.
 * @param {number} slideCount - The target number of slides to produce.
 * @param {string} model - The LLM model to use (default is "gpt-4o-mini").
 * @returns {Promise<{slides: string[]}>} A promise resolving to an object containing the slides.
 */
const processWithLLM = async (document, slideCount, model = "gpt-4o-mini") => {
  // console.log("Processing document with LLM...");

  const chunkSize = 3000; // Maximum chunk size to fit within LLM token limits
  const chunks = splitDocumentForBatchingWithOverlap(document, chunkSize, 700);

  // Determine the number of slides to request per chunk to distribute evenly
  const slidesPerChunk = Math.max(1, Math.floor(slideCount / chunks.length));

  let allSlides = [];

  for (const chunk of chunks) {
    // console.log(`Processing chunk of size: ${chunk.length}`);
    try {
      const slides = await fetchLLMSplitSlides(chunk, slidesPerChunk, model);
      allSlides.push(...slides);
    } catch (error) {
      console.error("Error processing chunk:", error);
      throw new Error("Failed to process document in batches.");
    }
  }

  // console.log("Final Slides:", allSlides);

  // Trim the slides if we received more than requested
  if (allSlides.length > slideCount) {
    allSlides = allSlides.slice(0, slideCount);
  }

  // If missing slides, append remaining document
  const combinedSlidesText = allSlides.join("\n").trim();
  if (combinedSlidesText.length < document.trim().length) {
    const remainingText = document
      .trim()
      .substring(combinedSlidesText.length)
      .trim();
    if (remainingText.length > 0) {
      console.warn("Appending remaining text that was not included in slides.");
      allSlides.push(remainingText);
    }
  }
  return { slides: allSlides };
};

export { processWithLLM };
