import { config } from "dotenv";
config();

const LLM_ENDPOINTS = {
  "gpt-4o-mini": "https://api.openai.com/v1/chat/completions",
};

const API_KEYS = {
  "gpt-4o-mini": process.env.OPENAI_API_KEY,
};

const splitDocumentForBatchingWithOverlap = (
  document,
  chunkSize,
  overlapSize
) => {
  const regex = /(?=\n##? |(?<=\n)\s*[-*]\s|\n\n)/g;
  const sections = document.split(regex);

  let batches = [];
  let currentBatch = "";

  sections.forEach((section) => {
    if ((currentBatch + section).length > chunkSize) {
      batches.push(currentBatch.trim());
      currentBatch = section.slice(-overlapSize); // Ensure overlap
    } else {
      currentBatch += section;
    }
  });

  if (currentBatch) batches.push(currentBatch.trim());
  return batches;
};

const fetchLLMSplitSlides = async (document, slideCount, model) => {
  const prompt = `You are given a markdown document.

- Divide the given document into exactly ${slideCount} sections in a meaningful way.
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
    response_format: { type: "json_object" },
  };

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

const processWithLLM = async (document, slideCount, model = "gpt-4o-mini") => {
  console.log("Processing document with LLM...");

  const chunkSize = 3000; // Increase chunk size to capture more content
  const chunks = splitDocumentForBatchingWithOverlap(document, chunkSize, 500); // Increase overlap

  let allSlides = [];

  for (const chunk of chunks) {
    console.log(`Processing chunk of size: ${chunk.length}`);
    try {
      const slides = await fetchLLMSplitSlides(chunk, slideCount, model);
      allSlides.push(...slides);
    } catch (error) {
      console.error("Error processing chunk:", error);
      throw new Error("Failed to process document in batches.");
    }
  }

  console.log("Final Slides:", allSlides);

  // If missing slides, append remaining document
  if (allSlides.join("\n").length < document.length) {
    console.warn("Some content was missing; appending remaining text.");
    allSlides.push(document.slice(allSlides.join("\n").length).trim());
  }

  return { slides: allSlides };
};

export { processWithLLM };
