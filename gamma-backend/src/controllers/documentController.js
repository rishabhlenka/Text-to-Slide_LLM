import { processWithLLM } from "../services/llmService.js";

const splitDocument = async (req, res) => {
  try {
    const { document, slideCount, model } = req.body;

    if (!document || !slideCount || slideCount < 1 || slideCount > 50) {
      return res.status(400).json({
        error: "Invalid input. Ensure document and slide count are valid.",
      });
    }

    const sections = await processWithLLM(document, slideCount, model);
    res.json({ sections });
  } catch (error) {
    console.error("Error splitting document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { splitDocument };
