import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
});

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL,
      content TEXT NOT NULL,
      embedding JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log("База данных и таблица готовы");
}
