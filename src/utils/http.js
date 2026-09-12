export function ok(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function created(res, data) {
  return ok(res, data, 201);
}

export function fail(res, status, code, message) {
  return res.status(status).json({
    success: false,
    error: { code, message },
  });
}

export function publicUser(user) {
  if (!user) return null;

  const role = user.roles
    ? { id: user.roles.id, name: user.roles.name, description: user.roles.description }
    : null;

  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    isActive: user.is_active,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    role,
  };
}

export const USER_SELECT =
  "id, email, full_name, is_active, created_at, updated_at, role_id, roles(id, name, description)";
