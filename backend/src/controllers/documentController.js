import { processWithLLM } from "../services/llmService.js";

// Controller function to handle document splitting requests
const splitDocument = async (req, res) => {
  try {
    // Extract document content, slide count, and model from request body
    const { document, slideCount, model } = req.body;

    // Validate input: document must exist, slide count must be within the allowed range
    if (!document || !slideCount || slideCount < 1 || slideCount > 50) {
      return res.status(400).json({
        error: "Invalid input. Ensure document and slide count are valid.",
      });
    }

    // Call the LLM processing service to split the document into slides
    const sections = await processWithLLM(document, slideCount, model);

    // Respond with the generated sections as JSON
    res.json({ sections });
  } catch (error) {
    // Log error details to the console for debugging purposes
    console.error("Error splitting document:", error);

    // Respond with a 500 Internal Server Error if something goes wrong
    res.status(500).json({ error: "Internal server error" });
  }
};

export { splitDocument };
