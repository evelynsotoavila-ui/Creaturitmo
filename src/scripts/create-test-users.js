import { supabase } from "../config/supabase.js";
import { hashPassword } from "../utils/password.js";

const users = [
  { email: "luna.vega@pulso.test", password: "LunaVibe1234", fullName: "Luna Vega" },
  { email: "mateo.rios@pulso.test", password: "MateoVibe1234", fullName: "Mateo Ríos" },
];

async function main() {
  const { data: role, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("name", "empleado")
    .maybeSingle();

  if (roleError) throw roleError;
  if (!role) throw new Error("Falta el rol empleado.");

  for (const user of users) {
    const { data: existing, error: existingError } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existing) {
      const passwordHash = await hashPassword(user.password);
      const { error } = await supabase
        .from("users")
        .update({
          password_hash: passwordHash,
          full_name: user.fullName,
          is_active: true,
          role_id: role.id,
        })
        .eq("id", existing.id);

      if (error) throw error;
      console.log("actualizado:", user.email);
      continue;
    }

    const passwordHash = await hashPassword(user.password);
    const { error } = await supabase.from("users").insert({
      email: user.email,
      password_hash: passwordHash,
      full_name: user.fullName,
      role_id: role.id,
      is_active: true,
    });

    if (error) throw error;
    console.log("creado:", user.email);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
