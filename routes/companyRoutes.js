// routes/companyRoutes.js
import express from "express";
// Use `req.db` provided by the server instead of opening a new connection.
// This avoids the overhead of reconnecting to MongoDB on every request and
// ensures proper connection pooling.

const router = express.Router();

// GET /api/companies
router.get("/", async (req, res) => {
    try {
        const questionsCollection = req.db.collection("questions");

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
            // generate a simple placeholder logo path or keep existing clearbit call
            logo: `https://logo.clearbit.com/${c.name.toLowerCase()}.com`,
        }));
        return res.status(200).json(withLogos);
    } catch (err) {
        console.error("Error fetching companies:", err);
        res
            .status(500)
            .json({ message: "Server error while fetching companies" });
    }
});

export default router;
