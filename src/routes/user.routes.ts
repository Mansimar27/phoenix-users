import { Router } from "express";
import {
  loginUserController,
  registerUserController,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", loginUserController);
router.post("/register", registerUserController);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Access granted",
    user: (req as any).user,
  });
});

export default router;
