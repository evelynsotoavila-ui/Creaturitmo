# Sistema de administración — Backend REST

API en **Node.js + Express** conectada a **Supabase (PostgreSQL)** con contraseñas hasheadas con **bcrypt** y autenticación por **JWT**.

## Requisitos

- Node.js 18 o superior
- Proyecto de Supabase (el de este repo: `eolwvqrmhzmapefbmapu`)

## 1. Crear las tablas en Supabase

1. Abre [SQL Editor](https://supabase.com/dashboard/project/eolwvqrmhzmapefbmapu/sql)
2. Pega el contenido de `sql/schema.sql`
3. Ejecuta **Run**

Eso crea:

| Tabla   | Uso                                      |
|---------|------------------------------------------|
| `roles` | Roles `admin`, `manager`, `staff`        |
| `users` | Usuarios del panel (password con bcrypt) |

Row Level Security queda activo. El backend usa la **service role key**, que omite RLS. El anon/publishable key no puede leer estas tablas.

## 2. Variables de entorno

```bash
copy .env.example .env
```

Completa en `.env`:

| Variable | Dónde obtenerla |
|----------|-----------------|
| `SUPABASE_URL` | Project URL (ya viene en el ejemplo) |
| `SUPABASE_ANON_KEY` | **Publishable key** en Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | **service_role** en Project Settings → API (secreta, solo backend) |
| `JWT_SECRET` | Cadena larga y aleatoria, mínima 16 caracteres |

La service role key no se comparte ni se usa en el frontend.

## 3. Instalar y arrancar

Si PowerShell no reconoce `npm`, añade `C:\Program Files\nodejs` al PATH o usa la ruta completa:

```bash
"C:\Program Files\nodejs\npm.cmd" install
```

```bash
npm install
npm run seed
npm run dev
```

`npm run seed` crea el primer admin:

- correo: `admin@local.test`
- contraseña: `Admin1234`

También puedes crear el primer admin con REST (solo funciona si aún no hay usuarios):

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@empresa.com",
  "password": "Admin1234",
  "fullName": "Administrador"
}
```

Servidor: `http://localhost:3000`

## Autenticación

Las rutas protegidas usan:

```http
Authorization: Bearer <token>
```

El token se obtiene en `POST /api/auth/login`. Las contraseñas se comparan con `bcrypt.compare` contra `users.password_hash` (coste 12). Nunca se devuelve el hash en las respuestas.

## API REST

### Salud

| Método | Ruta | Auth |
|--------|------|------|
| GET | `/api/health` | No |

### Auth

| Método | Ruta | Auth | Notas |
|--------|------|------|--------|
| POST | `/api/auth/register` | No | Solo el primer usuario (admin) |
| POST | `/api/auth/login` | No | Devuelve `user` + `token` |
| GET | `/api/auth/me` | Bearer | Perfil del token |
| POST | `/api/auth/change-password` | Bearer | `currentPassword`, `newPassword` |

### Usuarios

| Método | Ruta | Roles |
|--------|------|--------|
| GET | `/api/users` | admin, manager |
| GET | `/api/users/:id` | admin, manager |
| POST | `/api/users` | admin |
| PUT | `/api/users/:id` | admin |
| PATCH | `/api/users/:id/status` | admin |
| DELETE | `/api/users/:id` | admin |

Query params en el listado: `search`, `role`, `isActive`, `page`, `limit`.

### Roles

| Método | Ruta | Roles |
|--------|------|--------|
| GET | `/api/roles` | admin, manager |
| GET | `/api/roles/:id` | admin, manager |
| POST | `/api/roles` | admin |
| PUT | `/api/roles/:id` | admin |
| DELETE | `/api/roles/:id` | admin |

### Dashboard

| Método | Ruta | Roles |
|--------|------|--------|
| GET | `/api/dashboard/stats` | admin, manager |

## Ejemplos

Login:

```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@local.test\",\"password\":\"Admin1234\"}"
```

Listar usuarios:

```bash
curl http://localhost:3000/api/users ^
  -H "Authorization: Bearer TU_TOKEN"
```

Crear usuario:

```bash
curl -X POST http://localhost:3000/api/users ^
  -H "Authorization: Bearer TU_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"staff@empresa.com\",\"password\":\"Staff1234\",\"fullName\":\"Ana Pérez\",\"roleId\":\"UUID_DEL_ROL\"}"
```

Respuesta de éxito:

```json
{
  "success": true,
  "data": {}
}
```

Respuesta de error:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Correo o contraseña incorrectos."
  }
}
```

## Estructura

```
src/
  config/          Supabase y variables de entorno
  middleware/      JWT, roles, validación, errores
  modules/
    auth/          Login, registro inicial, perfil
    users/         CRUD de usuarios
    roles/         CRUD de roles
    dashboard/     Conteos
  scripts/seed.js  Admin inicial
  app.js
  server.js
sql/schema.sql
```

## Roles

- **admin**: CRUD de usuarios y roles
- **manager**: consulta de usuarios, roles y estadísticas
- **staff**: autenticado, sin acceso a administración
