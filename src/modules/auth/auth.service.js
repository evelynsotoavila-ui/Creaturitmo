import { AppError } from "../../middleware/errorHandler.js";
import { isValidEmail, validatePassword } from "../../middleware/validate.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { signToken } from "../../utils/jwt.js";
import { publicUser } from "../../utils/http.js";
import {
  countUsers,
  createUserRecord,
  findUserByEmail,
  findUserById,
  markLastLogin,
  updateUserRecord,
} from "../users/users.service.js";
import { findRoleByName } from "../roles/roles.service.js";

function authPayload(user) {
  return {
    user: publicUser(user),
    token: signToken({
      sub: user.id,
      email: user.email,
      role: user.roles?.name,
    }),
  };
}

export async function bootstrapAdmin({ email, password, fullName }) {
  if (!isValidEmail(email)) {
    throw new AppError(400, "VALIDATION_ERROR", "El correo no es válido.");
  }

  const passwordError = validatePassword(password);
  if (passwordError) throw new AppError(400, "VALIDATION_ERROR", passwordError);

  const existingCount = await countUsers();
  if (existingCount > 0) {
    throw new AppError(
      403,
      "BOOTSTRAP_LOCKED",
      "El registro inicial ya se usó. Pide a un administrador que cree tu cuenta."
    );
  }

  const adminRole = await findRoleByName("admin");
  if (!adminRole) {
    throw new AppError(500, "SETUP_ERROR", "No existe el rol admin. Ejecuta sql/schema.sql en Supabase.");
  }

  const passwordHash = await hashPassword(password);
  const user = await createUserRecord({
    email,
    passwordHash,
    fullName: fullName.trim(),
    roleId: adminRole.id,
    isActive: true,
  });

  return authPayload(user);
}

export async function login({ email, password }) {
  if (!isValidEmail(email) || !password) {
    throw new AppError(400, "VALIDATION_ERROR", "Correo y contraseña son obligatorios.");
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Correo o contraseña incorrectos.");
  }

  const matches = await verifyPassword(password, user.password_hash);
  if (!matches) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Correo o contraseña incorrectos.");
  }

  if (!user.is_active) {
    throw new AppError(403, "INACTIVE_USER", "La cuenta está desactivada.");
  }

  await markLastLogin(user.id);
  const fresh = await findUserById(user.id);
  return authPayload(fresh || user);
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const passwordError = validatePassword(newPassword);
  if (passwordError) throw new AppError(400, "VALIDATION_ERROR", passwordError);

  const profile = await findUserById(userId);
  if (!profile) throw new AppError(404, "USER_NOT_FOUND", "Usuario no encontrado.");

  const user = await findUserByEmail(profile.email);
  if (!user) throw new AppError(404, "USER_NOT_FOUND", "Usuario no encontrado.");

  const matches = await verifyPassword(currentPassword, user.password_hash);
  if (!matches) {
    throw new AppError(401, "INVALID_CREDENTIALS", "La contraseña actual no es correcta.");
  }

  const passwordHash = await hashPassword(newPassword);
  const updated = await updateUserRecord(userId, { password_hash: passwordHash });
  return publicUser(updated);
}
