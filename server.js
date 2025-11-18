import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db/connect.js";
import authRoutes from "./routes/authRoutes.js";
import questionsRoutes from "./routes/questionsRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
// security middlewares
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// apply security middlewares
// Helmet sets various HTTP headers to protect the app (e.g., `X‑Content‑Type‑Options`, `Content‑Security‑Policy`).
app.use(helmet());
// Enable CORS so that the client running on a different origin (e.g., React dev server) can access the API.
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
// Rate limit incoming requests to mitigate brute‑force attacks. Here we allow
// 100 requests per 15‑minute window per IP.
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// connect to DB
const db = await connectDB();
app.use((req, res, next) => { req.db = db; next(); });

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/companies", companyRoutes);

// serve React frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.resolve(__dirname, "frontend", "dist");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
