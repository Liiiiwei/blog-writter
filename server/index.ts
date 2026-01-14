import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import articleRoutes from "./routes/articleRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", articleRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("🔑 API Key Status:", process.env.GEMINI_API_KEY ? "Configured" : "MISSING");
});
