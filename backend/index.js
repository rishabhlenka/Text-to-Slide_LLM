import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import documentRoutes from "./src/routes/documentRoutes.js";

config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST"],
  })
);

app.use(json());

// Routes
app.use("/api", documentRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send(
    "Welcome to the Gamma Backend API! Use /api/split-document for processing."
  );
});
