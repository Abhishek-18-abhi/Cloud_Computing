import "dotenv/config";
import mysql from "mysql2/promise";
import pg from "pg";

const client = (process.env.DB_CLIENT || "postgres").toLowerCase();
const isPostgres = client === "postgres" || client === "postgresql";

if (!isPostgres && client !== "mysql") {
  throw new Error("DB_CLIENT must be postgres or mysql.");
}

const config = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || (isPostgres ? 5432 : 3306)),
  database: process.env.DB_NAME || (isPostgres ? "postgres" : "electronic_store"),
  user: process.env.DB_USER || (isPostgres ? "postgres" : "root"),
  password: process.env.DB_PASSWORD || "",
};

// Supabase requires SSL when SSL enforcement is enabled. `rejectUnauthorized: false`
// is suitable for local development when the Supabase CA certificate is not installed.
const pool = isPostgres
  ? new pg.Pool({
      ...config,
      ssl: process.env.DB_SSL === "false"
        ? false
        : { rejectUnauthorized: false },
      max: Number(process.env.DB_POOL_MAX || 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })
  : mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 10,
    });

function compile(sql) {
  if (!isPostgres) return sql;
  let position = 0;
  return sql.replace(/\?/g, () => `$${++position}`);
}

export async function query(sql, params = [], connection = pool) {
  if (isPostgres) {
    const result = await connection.query(compile(sql), params);
    return { rows: result.rows, affectedRows: result.rowCount };
  }

  const [result] = await connection.execute(sql, params);
  return Array.isArray(result)
    ? { rows: result, affectedRows: result.length }
    : { rows: [], affectedRows: result.affectedRows, insertId: result.insertId };
}

export async function transaction(work) {
  if (isPostgres) {
    const connection = await pool.connect();
    try {
      await connection.query("BEGIN");
      const result = await work(connection);
      await connection.query("COMMIT");
      return result;
    } catch (error) {
      await connection.query("ROLLBACK");
      throw error;
    } finally {
      connection.release();
    }
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await work(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function closeDatabase() {
  await pool.end();
}

export { isPostgres };
