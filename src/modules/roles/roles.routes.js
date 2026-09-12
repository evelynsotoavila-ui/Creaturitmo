import { Router } from "express";
import { requireAuth, requireRoles } from "../../middleware/auth.js";
import { requireFields } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, ok } from "../../utils/http.js";
import { AppError } from "../../middleware/errorHandler.js";
import {
  createRoleRecord,
  deleteRoleRecord,
  findRoleById,
  listRoles,
  updateRoleRecord,
} from "./roles.service.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  requireRoles("admin", "empleado"),
  asyncHandler(async (req, res) => ok(res, await listRoles()))
);

router.get(
  "/:id",
  requireRoles("admin", "empleado"),
  asyncHandler(async (req, res) => {
    const role = await findRoleById(req.params.id);
    if (!role) throw new AppError(404, "ROLE_NOT_FOUND", "Rol no encontrado.");
    return ok(res, role);
  })
);

router.post(
  "/",
  requireRoles("admin"),
  requireFields(["name"]),
  asyncHandler(async (req, res) => {
    const role = await createRoleRecord({
      name: req.body.name,
      description: req.body.description,
    });
    return created(res, role);
  })
);

router.put(
  "/:id",
  requireRoles("admin"),
  asyncHandler(async (req, res) => {
    const fields = {};
    if (req.body.name) fields.name = String(req.body.name).trim().toLowerCase();
    if (req.body.description !== undefined) fields.description = req.body.description;
    if (Object.keys(fields).length === 0) {
      throw new AppError(400, "VALIDATION_ERROR", "No hay campos para actualizar.");
    }
    return ok(res, await updateRoleRecord(req.params.id, fields));
  })
);

router.delete(
  "/:id",
  requireRoles("admin"),
  asyncHandler(async (req, res) => ok(res, await deleteRoleRecord(req.params.id)))
);

export default router;
