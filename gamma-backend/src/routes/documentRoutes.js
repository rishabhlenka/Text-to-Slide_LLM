import { Router } from "express";
import { splitDocument } from "../controllers/documentController.js";

const router = Router();

router.post("/split-document", splitDocument);

export default router;
