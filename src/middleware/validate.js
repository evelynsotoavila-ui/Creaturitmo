import { fail } from "../utils/http.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return typeof email === "string" && EMAIL_REGEX.test(email.trim().toLowerCase());
}

export function requireFields(fields) {
  return (req, res, next) => {
    const missing = fields.filter((field) => {
      const value = req.body?.[field];
      return value === undefined || value === null || String(value).trim() === "";
    });

    if (missing.length > 0) {
      return fail(
        res,
        400,
        "VALIDATION_ERROR",
        `Faltan campos obligatorios: ${missing.join(", ")}`
      );
    }

    next();
  };
}

export function validatePassword(password) {
  if (typeof password !== "string" || password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  return null;
}
