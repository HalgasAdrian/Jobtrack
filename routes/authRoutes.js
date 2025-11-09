import express from "express";
import {
  login,
  register,
  getUser,
  updateUser,
  updatePassword,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// public routes
router.post("/register", register);
router.post("/login", login);

// protected routes
router.get("/me", authMiddleware, getUser);
router.put("/me", authMiddleware, updateUser);
router.put("/me/password", authMiddleware, updatePassword);

export default router;
