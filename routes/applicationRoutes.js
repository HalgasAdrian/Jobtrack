import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
   createApplication,
   getAllApplications,
   getApplication,
   updateApplication,
   deleteApplication,
} from "../controllers/applicationsController.js";

const router = express.Router();

router.post("/api/applications", authMiddleware, createApplication);
router.get("/api/applications", authMiddleware, getAllApplications);
router.get("/api/applications/:id", authMiddleware, getApplication);
router.put("/api/applications/:id", authMiddleware, updateApplication);
router.delete("/api/applications/:id", authMiddleware, deleteApplication);

export default router;
