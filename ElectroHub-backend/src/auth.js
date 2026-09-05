import "dotenv/config";
import { query } from "./db.js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

async function getSupabaseUser(token) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are required.");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;
  return response.json();
}

export async function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization || "").split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Sign in is required." });
  }

  try {
    const supabaseUser = await getSupabaseUser(token);

    if (!supabaseUser?.id || !supabaseUser.email) {
      return res.status(401).json({ message: "Your session is invalid or has expired." });
    }

    const email = supabaseUser.email.toLowerCase();
    const metadata = supabaseUser.user_metadata || {};
    const name = String(metadata.full_name || email.split("@")[0]).slice(0, 100);
    const phone = String(metadata.phone || "").slice(0, 20);

    // Find the application user by Supabase Auth ID first, then by email for
    // users created before Supabase Auth was connected.
    let user = (
      await query(
        `SELECT user_id, auth_user_id, name, email, phone, created_at
         FROM users
         WHERE auth_user_id = ? OR LOWER(email) = LOWER(?)
         ORDER BY CASE WHEN auth_user_id = ? THEN 0 ELSE 1 END
         LIMIT 1`,
        [supabaseUser.id, email, supabaseUser.id]
      )
    ).rows[0];

    if (!user) {
      const inserted = await query(
        `INSERT INTO users (auth_user_id, name, email, phone, password)
         VALUES (?, ?, ?, ?, NULL)${process.env.DB_CLIENT?.toLowerCase() === "postgres" || process.env.DB_CLIENT?.toLowerCase() === "postgresql" ? " RETURNING user_id" : ""}`,
        [supabaseUser.id, name, email, phone]
      );

      const userId = process.env.DB_CLIENT?.toLowerCase() === "postgres" || process.env.DB_CLIENT?.toLowerCase() === "postgresql"
        ? inserted.rows[0].user_id
        : inserted.insertId;

      user = (
        await query(
          "SELECT user_id, auth_user_id, name, email, phone, created_at FROM users WHERE user_id = ?",
          [userId]
        )
      ).rows[0];
    } else if (user.auth_user_id !== supabaseUser.id) {
      // Link an existing application account to the Supabase Auth account.
      await query(
        "UPDATE users SET auth_user_id = ?, name = ?, phone = ? WHERE user_id = ?",
        [supabaseUser.id, name || user.name, phone || user.phone, user.user_id]
      );
      user.auth_user_id = supabaseUser.id;
    }

    req.auth = {
      userId: user.user_id,
      supabaseUserId: supabaseUser.id,
      email: user.email,
    };

    return next();
  } catch (error) {
    console.error("Supabase auth error:", error);
    return res.status(401).json({ message: "Unable to verify your session." });
  }
}
