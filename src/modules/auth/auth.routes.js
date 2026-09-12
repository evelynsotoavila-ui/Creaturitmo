import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireFields } from "../../middleware/validate.js";
import {
  changePasswordController,
  loginController,
  meController,
  registerFirstAdmin,
} from "./auth.controller.js";

const router = Router();

router.post("/register", requireFields(["email", "password", "fullName"]), registerFirstAdmin);
router.post("/login", requireFields(["email", "password"]), loginController);
router.get("/me", requireAuth, meController);
router.post(
  "/change-password",
  requireAuth,
  requireFields(["currentPassword", "newPassword"]),
  changePasswordController
);

export default router;
