import db from "#db/client";

export async function createOrder({ user_id, date }) {
  const SQL = `
    INSERT INTO orders (user_id, date)
    VALUES ($1, $2)
    RETURNING *
    `;
  const response = await db.query(SQL, [user_id, date]);
  return response.rows[0];
}
