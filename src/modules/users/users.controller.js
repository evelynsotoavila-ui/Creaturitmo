import { AppError } from "../../middleware/errorHandler.js";
import { isValidEmail, validatePassword } from "../../middleware/validate.js";
import { hashPassword } from "../../utils/password.js";
import { publicUser } from "../../utils/http.js";
import { findRoleById } from "../roles/roles.service.js";
import {
  createUserRecord,
  deleteUserRecord,
  findUserById,
  listUsers,
  updateUserRecord,
} from "./users.service.js";

export async function getUsers(query) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const result = await listUsers({
    search: query.search,
    role: query.role,
    isActive: query.isActive,
    page,
    limit,
  });

  return {
    items: result.users.map(publicUser),
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      pages: Math.ceil(result.total / result.limit) || 1,
    },
  };
}

export async function getUser(id) {
  const user = await findUserById(id);
  if (!user) throw new AppError(404, "USER_NOT_FOUND", "Usuario no encontrado.");
  return publicUser(user);
}

export async function createUser(body, actor) {
  if (!isValidEmail(body.email)) {
    throw new AppError(400, "VALIDATION_ERROR", "El correo no es válido.");
  }

  const passwordError = validatePassword(body.password);
  if (passwordError) throw new AppError(400, "VALIDATION_ERROR", passwordError);

  if (!body.fullName || !String(body.fullName).trim()) {
    throw new AppError(400, "VALIDATION_ERROR", "El nombre completo es obligatorio.");
  }

  if (!body.roleId) {
    throw new AppError(400, "VALIDATION_ERROR", "El rol es obligatorio.");
  }

  const role = await findRoleById(body.roleId);
  if (!role) throw new AppError(400, "INVALID_ROLE", "El rol indicado no existe.");

  if (role.name === "admin" && actor?.roles?.name !== "admin") {
    throw new AppError(403, "FORBIDDEN", "Solo un administrador puede crear otro administrador.");
  }

  const passwordHash = await hashPassword(body.password);
  const user = await createUserRecord({
    email: body.email,
    passwordHash,
    fullName: String(body.fullName).trim(),
    roleId: body.roleId,
    isActive: body.isActive !== false,
  });

  return publicUser(user);
}

export async function updateUser(id, body, actor) {
  const current = await findUserById(id);
  if (!current) throw new AppError(404, "USER_NOT_FOUND", "Usuario no encontrado.");

  const fields = {};

  if (body.email !== undefined) {
    if (!isValidEmail(body.email)) {
      throw new AppError(400, "VALIDATION_ERROR", "El correo no es válido.");
    }
    fields.email = body.email.trim().toLowerCase();
  }

  if (body.fullName !== undefined) {
    if (!String(body.fullName).trim()) {
      throw new AppError(400, "VALIDATION_ERROR", "El nombre completo no puede estar vacío.");
    }
    fields.full_name = String(body.fullName).trim();
  }

  if (body.roleId !== undefined) {
    const role = await findRoleById(body.roleId);
    if (!role) throw new AppError(400, "INVALID_ROLE", "El rol indicado no existe.");
    if (role.name === "admin" && actor?.roles?.name !== "admin") {
      throw new AppError(403, "FORBIDDEN", "Solo un administrador puede asignar el rol admin.");
    }
    fields.role_id = body.roleId;
  }

  if (body.isActive !== undefined) {
    fields.is_active = Boolean(body.isActive);
  }

  if (body.password) {
    const passwordError = validatePassword(body.password);
    if (passwordError) throw new AppError(400, "VALIDATION_ERROR", passwordError);
    fields.password_hash = await hashPassword(body.password);
  }

  if (Object.keys(fields).length === 0) {
    throw new AppError(400, "VALIDATION_ERROR", "No hay campos para actualizar.");
  }

  const updated = await updateUserRecord(id, fields);
  return publicUser(updated);
}

export async function setUserStatus(id, isActive, actorId) {
  if (id === actorId && isActive === false) {
    throw new AppError(400, "VALIDATION_ERROR", "No puedes desactivar tu propia cuenta.");
  }

  const updated = await updateUserRecord(id, { is_active: Boolean(isActive) });
  return publicUser(updated);
}

export async function removeUser(id, actorId) {
  if (id === actorId) {
    throw new AppError(400, "VALIDATION_ERROR", "No puedes eliminar tu propia cuenta.");
  }

  await deleteUserRecord(id);
  return { id };
}
