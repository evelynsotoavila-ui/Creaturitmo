import { supabase } from "../../config/supabase.js";
import { AppError } from "../../middleware/errorHandler.js";

export async function listRoles() {
  const { data, error } = await supabase.from("roles").select("id, name, description, created_at").order("name");
  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return data || [];
}

export async function findRoleById(id) {
  const { data, error } = await supabase.from("roles").select("id, name, description, created_at").eq("id", id).maybeSingle();
  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return data;
}

export async function findRoleByName(name) {
  const { data, error } = await supabase
    .from("roles")
    .select("id, name, description, created_at")
    .eq("name", name)
    .maybeSingle();

  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return data;
}

export async function createRoleRecord({ name, description }) {
  const { data, error } = await supabase
    .from("roles")
    .insert({ name: name.trim().toLowerCase(), description: description || null })
    .select("id, name, description, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new AppError(409, "ROLE_TAKEN", "Ya existe un rol con ese nombre.");
    }
    throw new AppError(500, "DB_ERROR", error.message);
  }

  return data;
}

export async function updateRoleRecord(id, fields) {
  const { data, error } = await supabase
    .from("roles")
    .update(fields)
    .eq("id", id)
    .select("id, name, description, created_at")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      throw new AppError(409, "ROLE_TAKEN", "Ya existe un rol con ese nombre.");
    }
    throw new AppError(500, "DB_ERROR", error.message);
  }

  if (!data) throw new AppError(404, "ROLE_NOT_FOUND", "Rol no encontrado.");
  return data;
}

export async function deleteRoleRecord(id) {
  const { data, error } = await supabase.from("roles").delete().eq("id", id).select("id").maybeSingle();

  if (error) {
    if (error.code === "23503") {
      throw new AppError(409, "ROLE_IN_USE", "No se puede eliminar un rol que tiene usuarios asignados.");
    }
    throw new AppError(500, "DB_ERROR", error.message);
  }

  if (!data) throw new AppError(404, "ROLE_NOT_FOUND", "Rol no encontrado.");
  return data;
}
