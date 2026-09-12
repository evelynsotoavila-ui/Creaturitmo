import { supabase } from "../../config/supabase.js";
import { AppError } from "../../middleware/errorHandler.js";
import { USER_SELECT } from "../../utils/http.js";

export async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select(USER_SELECT + ", password_hash")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return data;
}

export async function findUserById(id) {
  const { data, error } = await supabase
    .from("users")
    .select(USER_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return data;
}

export async function listUsers({ search, role, isActive, page = 1, limit = 20 }) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("users")
    .select(USER_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    const term = String(search).replace(/[,()%]/g, "").trim();
    if (term) {
      query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`);
    }
  }

  if (role) {
    const { data: roleRow, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", role)
      .maybeSingle();

    if (roleError) throw new AppError(500, "DB_ERROR", roleError.message);
    if (!roleRow) {
      return { users: [], total: 0, page, limit };
    }

    query = query.eq("role_id", roleRow.id);
  }

  if (isActive === "true" || isActive === "false") {
    query = query.eq("is_active", isActive === "true");
  }

  const { data, error, count } = await query;
  if (error) throw new AppError(500, "DB_ERROR", error.message);

  return { users: data || [], total: count || 0, page, limit };
}

export async function createUserRecord({ email, passwordHash, fullName, roleId, isActive = true }) {
  const { data, error } = await supabase
    .from("users")
    .insert({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      full_name: fullName,
      role_id: roleId,
      is_active: isActive,
    })
    .select(USER_SELECT)
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new AppError(409, "EMAIL_TAKEN", "Ya existe un usuario con ese correo.");
    }
    throw new AppError(500, "DB_ERROR", error.message);
  }

  return data;
}

export async function updateUserRecord(id, fields) {
  const { data, error } = await supabase
    .from("users")
    .update(fields)
    .eq("id", id)
    .select(USER_SELECT)
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      throw new AppError(409, "EMAIL_TAKEN", "Ya existe un usuario con ese correo.");
    }
    throw new AppError(500, "DB_ERROR", error.message);
  }

  if (!data) throw new AppError(404, "USER_NOT_FOUND", "Usuario no encontrado.");
  return data;
}

export async function deleteUserRecord(id) {
  const { data, error } = await supabase.from("users").delete().eq("id", id).select("id").maybeSingle();

  if (error) throw new AppError(500, "DB_ERROR", error.message);
  if (!data) throw new AppError(404, "USER_NOT_FOUND", "Usuario no encontrado.");
  return data;
}

export async function countUsers() {
  const { count, error } = await supabase.from("users").select("id", { count: "exact", head: true });
  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return count || 0;
}

export async function countUsersByStatus() {
  const [{ count: active, error: activeError }, { count: inactive, error: inactiveError }] =
    await Promise.all([
      supabase.from("users").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("is_active", false),
    ]);

  if (activeError) throw new AppError(500, "DB_ERROR", activeError.message);
  if (inactiveError) throw new AppError(500, "DB_ERROR", inactiveError.message);

  return { active: active || 0, inactive: inactive || 0 };
}

export async function markLastLogin(_id) {
  return;
}
