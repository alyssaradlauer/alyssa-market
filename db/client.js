import pg from "pg";
const db = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/market"
);
export default db;
