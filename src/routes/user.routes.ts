import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getProfile,
  updateProfile,
  changePassword,
  loginUserController,
  registerUserController,
} from "../controllers/user.controller";

const router = Router();

router.post("/login", loginUserController);
router.post("/register", registerUserController);

// Protected Routes.
router.get("/me", authMiddleware, getProfile);
router.put("/update", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

export default router;
