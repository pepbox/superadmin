import { Router } from "express";
import { GameControllers } from "../controllers/game.controller";
import { authenticateUser } from "../../../middlewares/authMiddleware";
const router = Router();

router.post("/create", authenticateUser, GameControllers.createGame);
router.get("/fetch-all", authenticateUser, GameControllers.fetchAllGames);

export default router;
