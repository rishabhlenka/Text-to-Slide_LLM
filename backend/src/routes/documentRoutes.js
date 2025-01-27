import { Router } from "express";
import { splitDocument } from "../controllers/documentController.js";

// Create a new router instance to handle document-related routes
const router = Router();

// Define a POST route to handle document splitting requests
// When a POST request is made to "/split-document", the `splitDocument`
// controller function is triggered
router.post("/split-document", splitDocument);

export default router;
