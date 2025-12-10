import { Router } from "express";
import { logout, refreshToken } from "../controllers/auth.controller";

const router = Router();

router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

export default router;
