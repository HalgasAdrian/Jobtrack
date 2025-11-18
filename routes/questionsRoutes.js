// server/questionsRoutes.js
import express from "express";
import { ObjectId } from "mongodb";
import { authMiddleware } from "../middlewares/authMiddleware.js";


const router = express.Router();

/**
 * CREATE — Add a question
 * POST /api/questions
 * Requires auth. Server sets userEmail from req.user.email to avoid spoofing.
 */
router.post("/", authMiddleware, async (req, res) => {
    try {
        const db = req.db;
        const payload = req.body || {};
        // Basic validation: require `company` and `questionTitle` to be present.
        // Without validation malicious users could insert unexpected fields.
        if (!payload.company || !payload.questionTitle) {
            return res.status(400).json({ error: "company and questionTitle required" });
        }
        if (!req.user || !req.user.email) {
            // When the JWT doesn't contain an email we cannot set ownership, so we fail fast.
            return res.status(401).json({ error: "Authentication required" });
        }
        // Build a new question object and only copy over fields we intend to store.
        // This whitelisting approach avoids accidentally persisting extra properties
        // sent from the client (e.g. an attempt to set `userEmail`).
        const newQuestion = {
            company: String(payload.company),
            role: payload.role ? String(payload.role) : undefined,
            questionTitle: String(payload.questionTitle),
            questionDescription: payload.questionDescription ? String(payload.questionDescription) : undefined,
            difficulty: payload.difficulty ? String(payload.difficulty) : undefined,
            tips: payload.tips ? String(payload.tips) : undefined,
            tags: Array.isArray(payload.tags) ? payload.tags.map(String) : undefined,
            userEmail: req.user.email,
            createdAt: Date.now(),
        };
        const result = await db.collection("questions").insertOne(newQuestion);
        return res.status(201).json({ insertedId: result.insertedId });
    } catch (err) {
        console.error("Failed to create question:", err);
        res.status(500).json({ error: "Failed to add a question" });
    }
});

/**
 * READ — Get questions by company (and optional role)
 * Public route
 * GET /api/questions?company=Bloomberg&role=SWE
 */
router.get("/", async (req, res) => {
    try {
        const { company, role } = req.query;

        if (!company) {
            return res.status(400).json({ error: "Company name is required." });
        }

        // case-insensitive exact match for company
        const filter = { company: { $regex: new RegExp(`^${company}$`, "i") } };

        if (role) filter.role = role;

        const questions = await req.db.collection("questions").find(filter).toArray();
        res.json(questions);
    } catch (err) {
        console.error("Failed to fetch questions:", err);
        res.status(500).json({ error: "Failed to fetch questions" });
    }
});

/**
 * READ — Get a single question by ID
 * GET /api/questions/:id
 */
router.get("/:id", async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const question = await req.db.collection("questions").findOne({ _id: id });

        if (!question) return res.status(404).json({ error: "Question not found" });

        res.json(question);
    } catch (err) {
        console.error("Failed to fetch question by ID:", err);
        res.status(500).json({ error: "Failed to fetch question by ID" });
    }
});

/**
 * UPDATE — Edit a question by ID
 * PUT /api/questions/:id
 * Must be owner. Requires auth.
 */
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const db = req.db;

        const existing = await db.collection("questions").findOne({ _id: id });
        if (!existing) return res.status(404).json({ error: "Question not found" });

        // Only owner can edit
        const requesterEmail = req.user?.email;
        if (!requesterEmail || existing.userEmail !== requesterEmail) {
            return res.status(403).json({ error: "Not authorized to edit this question" });
        }

        // Do not allow changing userEmail/createdAt by client
        const { userEmail, createdAt, ...updatable } = req.body;
        updatable.updatedAt = Date.now();

        const result = await db.collection("questions").updateOne(
            { _id: id },
            { $set: updatable }
        );

        res.json({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
    } catch (err) {
        console.error("Failed to update question:", err);
        res.status(500).json({ error: "Failed to update question" });
    }
});

/**
 * DELETE — Remove a question by ID
 * DELETE /api/questions/:id
 * Must be owner. Requires auth.
 */
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const db = req.db;

        const existing = await db.collection("questions").findOne({ _id: id });
        if (!existing) return res.status(404).json({ error: "Question not found" });

        const requesterEmail = req.user?.email;
        if (!requesterEmail || existing.userEmail !== requesterEmail) {
            return res.status(403).json({ error: "Not authorized to delete this question" });
        }

        const result = await db.collection("questions").deleteOne({ _id: id });
        res.json({ deletedCount: result.deletedCount });
    } catch (err) {
        console.error("Failed to delete question:", err);
        res.status(500).json({ error: "Failed to delete question" });
    }
});

export default router;
