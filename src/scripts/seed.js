import { env } from "../config/env.js";
import { supabase } from "../config/supabase.js";
import { hashPassword } from "../utils/password.js";

const email = process.env.ADMIN_EMAIL || "admin@local.test";
const password = process.env.ADMIN_PASSWORD || "Admin1234";
const fullName = process.env.ADMIN_NAME || "Administrador";

async function seed() {
  if (!env.supabaseServiceRoleKey) {
    throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY");
  }

  const { data: adminRole, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("name", "admin")
    .maybeSingle();

  if (roleError) throw roleError;
  if (!adminRole) {
    throw new Error("No existe el rol admin. Ejecuta sql/schema.sql en el SQL Editor de Supabase.");
  }

  const { data: existing, error: existingError } = await supabase
    .from("users")
    .select("id, email")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    console.log(`El usuario ${email} ya existe. No se creó otro.`);
    return;
  }

  const passwordHash = await hashPassword(password);
  const { error: insertError } = await supabase.from("users").insert({
    email: email.toLowerCase(),
    password_hash: passwordHash,
    full_name: fullName,
    role_id: adminRole.id,
    is_active: true,
  });

  if (insertError) throw insertError;

  console.log("Administrador inicial creado:");
  console.log(`  email:    ${email}`);
  console.log(`  password: ${password}`);
  console.log("Cambia esta contraseña después del primer inicio de sesión.");
}

seed().catch((error) => {
  console.error("Error al sembrar datos:", error.message);
  process.exit(1);
});
