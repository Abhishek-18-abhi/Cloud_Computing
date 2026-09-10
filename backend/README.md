# ElectroHub Express API + Supabase PostgreSQL

## 1. Configure environment

Copy `.env.example` to `.env` and set:

- `DB_PASSWORD` to your Supabase database password.
- `SUPABASE_PUBLISHABLE_KEY` to the same publishable key used by the React app.

Do not commit `.env`.

## 2. Install and run

```bash
npm install
npm start
```

The API runs at `http://localhost:5000`.

## 3. Verify the database connection

Open:

`http://localhost:5000/api/health`

Expected:

```json
{"status":"ok","database":"postgres"}
```

## 4. Test products

Open:

`http://localhost:5000/api/products`

## Authentication flow

React uses Supabase Auth. The browser sends the Supabase access token as a Bearer token to Express. Express verifies the token with Supabase Auth and maps the Auth user to `public.users.auth_user_id` before allowing protected order requests.
