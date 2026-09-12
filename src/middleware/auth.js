import { verifyToken } from "../utils/jwt.js";
import { fail } from "../utils/http.js";
import { findUserById } from "../modules/users/users.service.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return fail(res, 401, "UNAUTHORIZED", "Se requiere un token Bearer.");
    }

    const payload = verifyToken(token);
    const user = await findUserById(payload.sub);

    if (!user) {
      return fail(res, 401, "UNAUTHORIZED", "El usuario del token ya no existe.");
    }

    if (!user.is_active) {
      return fail(res, 403, "INACTIVE_USER", "La cuenta está desactivada.");
    }

    req.user = user;
    req.tokenPayload = payload;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    const roleName = req.user?.roles?.name;

    if (!roleName || !allowedRoles.includes(roleName)) {
      return fail(res, 403, "FORBIDDEN", "No tienes permisos para esta acción.");
    }

    next();
  };
}
