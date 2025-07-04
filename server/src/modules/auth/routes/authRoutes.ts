import { Router } from "express";
import { AuthControllers } from "../controllers/auth.controller";
import { authenticateUser } from "../../../middlewares/authMiddleware";

const router = Router();

router.post("/login", AuthControllers.login);
router.post("/logout", AuthControllers.logout);
router.post("/create-admin", AuthControllers.createAdmin);
router.post("/refresh-token", AuthControllers.refreshToken);

router.get("/fetch", authenticateUser, AuthControllers.fetch);

export default router;
