import { Router } from "express";
import { requireAuth, requireRoles } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ok } from "../../utils/http.js";
import { countUsers, countUsersByStatus } from "../users/users.service.js";
import { listRoles } from "../roles/roles.service.js";

const router = Router();

router.get(
  "/stats",
  requireAuth,
  requireRoles("admin", "empleado"),
  asyncHandler(async (req, res) => {
    const [total, byStatus, roles] = await Promise.all([countUsers(), countUsersByStatus(), listRoles()]);

    return ok(res, {
      users: {
        total,
        active: byStatus.active,
        inactive: byStatus.inactive,
      },
      roles: roles.length,
    });
  })
);

export default router;
