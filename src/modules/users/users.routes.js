import { Router } from "express";
import { requireAuth, requireRoles } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, ok } from "../../utils/http.js";
import { requireFields } from "../../middleware/validate.js";
import {
  createUser,
  getUser,
  getUsers,
  removeUser,
  setUserStatus,
  updateUser,
} from "./users.controller.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  requireRoles("admin", "empleado"),
  asyncHandler(async (req, res) => ok(res, await getUsers(req.query)))
);

router.get(
  "/:id",
  requireRoles("admin", "empleado"),
  asyncHandler(async (req, res) => ok(res, await getUser(req.params.id)))
);

router.post(
  "/",
  requireRoles("admin"),
  requireFields(["email", "password", "fullName", "roleId"]),
  asyncHandler(async (req, res) => created(res, await createUser(req.body, req.user)))
);

router.put(
  "/:id",
  requireRoles("admin"),
  asyncHandler(async (req, res) => ok(res, await updateUser(req.params.id, req.body, req.user)))
);

router.patch(
  "/:id/status",
  requireRoles("admin"),
  asyncHandler(async (req, res) => {
    if (typeof req.body.isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "isActive debe ser true o false." },
      });
    }
    return ok(res, await setUserStatus(req.params.id, req.body.isActive, req.user.id));
  })
);

router.delete(
  "/:id",
  requireRoles("admin"),
  asyncHandler(async (req, res) => ok(res, await removeUser(req.params.id, req.user.id)))
);

export default router;
