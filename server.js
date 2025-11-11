import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connect.js"; // new helper
import authRoutes from "./routes/authRoutes.js";
import questionsRoutes from "./routes/questionsRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve static frontend build
app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.all("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./frontend/dist")); // serve React build later
app.use("/api/companies", companyRoutes);

// --- CORS fix (manual, no external package) ---
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});


async function startServer() {
    try {
        const db = await connectDB(); // connect to Mongo once
        console.log("Database ready, starting server...");


        app.use((req, res, next) => {
            req.db = db;
            next();
        });

        app.use("/api/auth", authRoutes);
        app.use("/api/questions", questionsRoutes);
        app.use("/api/applications", applicationRoutes);
        app.use("/api/companies", companyRoutes);


        app.get("/api/health", (req, res) => {
            res.json({ status: "ok", database: "connected" });
        });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error);
    }
}

startServer();
