import { Router } from "express";
import { SessionControllers } from "../controllers/session.controller";
import { authenticateUser } from "../../../middlewares/authMiddleware";

const router = Router();

router.post("/create", authenticateUser, SessionControllers.createSession);
router.get("/", authenticateUser, SessionControllers.getSessions);
router.post("/edit", authenticateUser, SessionControllers.editSession);
router.post("/update", SessionControllers.updateSession);
router.post("/end", authenticateUser, SessionControllers.endSession);

router.post(
  "/custom-game-request",
  authenticateUser,
  SessionControllers.customGameRequest
);

export default router;
