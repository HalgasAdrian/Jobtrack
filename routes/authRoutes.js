import express from "express"
import {login, register, getUser} from "../controllers/authController.js";

const router = express.Router();

// public routes
router.post("/register", register);
router.post("/login", login);
// router.post("/logout", logout);

// protected route (get user's profile)
router.get("/me", authMiddleware, getUser);

export default router;

