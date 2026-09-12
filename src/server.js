import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`API de administración escuchando en http://localhost:${env.port}`);
  console.log(`Entorno: ${env.nodeEnv}`);
});
