import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_ROOT_PASSWORD || "example",
  database: process.env.DB_NAME || "sistema_de_votacao_api",
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
});

export async function getConnection() {
  return await pool.getConnection();
}

export async function executeQuery(sql: string, params: any[] = []) {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, params);
    return result;
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export default pool;
