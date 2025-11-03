import express from "express"

const router = express.Router();

// public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// protected route (get user's profile)
router.get("/me", authMiddleware, async (req, res) => {

});

export default router;

