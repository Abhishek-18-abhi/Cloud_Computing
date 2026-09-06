# ElectroHub backend connection

The project uses:

React -> Supabase Auth -> Express API -> Supabase PostgreSQL

Backend database tables:
- public.users
- public.products
- public.orders
- public.order_items

Supabase Auth users are mapped to `public.users.auth_user_id`.

The Express PostgreSQL pool uses Supabase's Session Pooler on port 5432 with SSL enabled.
