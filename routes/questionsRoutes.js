// server/questionsRoutes.js
import express from "express";
import { ObjectId } from "mongodb";
import authMiddleware from "./authMiddleware.js"; // make sure path matches your project

const router = express.Router();

/**
 * CREATE — Add a question
 * POST /api/questions
 * Requires auth. Server sets userEmail from req.user.email to avoid spoofing.
 */
router.post("/", authMiddleware, async (req, res) => {
    try {
        const db = req.db;
        const question = req.body || {};

        // Ensure required fields exist (company and questionTitle at least)
        if (!question.company || !question.questionTitle) {
            return res.status(400).json({ error: "company and questionTitle required" });
        }

        // Attach server-controlled metadata
        question.userEmail = req.user?.email || null;
        question.createdAt = Date.now();

        const result = await db.collection("questions").insertOne(question);
        res.status(201).json({ insertedId: result.insertedId });
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
