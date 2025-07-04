import { Router } from "express";
import authRoutes from "../../modules/auth/routes/authRoutes";
import gameRoutes from "../../modules/games/routes/gameRoutes";
import sessionRoutes from "../../modules/sessions/routes/sessionRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/games", gameRoutes);
router.use("/sessions", sessionRoutes);

export default router;
