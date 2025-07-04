import { Router } from "express";
import { SessionControllers } from "../controllers/session.controller";
import { authenticateUser } from "../../../middlewares/authMiddleware";

const router = Router();

router.post("/create", authenticateUser, SessionControllers.createSession);
router.get("/", authenticateUser, SessionControllers.getSessions);

export default router;
