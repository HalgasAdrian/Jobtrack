// routes/companyRoutes.js
import express from "express";
import { connectDB } from "../db/connect.js";

const router = express.Router();

// GET /api/companies
router.get("/", async (req, res) => {
    try {
        const db = await connectDB();
        const questionsCollection = db.collection("questions");

        const companies = await questionsCollection
            .aggregate([
                {
                    $group: {
                        _id: "$company",
                        resourcesCount: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        name: "$_id",
                        resourcesCount: 1,
                    },
                },
            ])
            .toArray();

        const withLogos = companies.map((c) => ({
            ...c,
            logo: `https://logo.clearbit.com/${c.name.toLowerCase()}.com`,
        }));

        res.status(200).json(withLogos);
    } catch (err) {
        console.error("Error fetching companies:", err);
        res
            .status(500)
            .json({ message: "Server error while fetching companies" });
    }
});

export default router;
