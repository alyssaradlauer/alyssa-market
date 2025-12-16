import db from "#db/client";

export async function createProduct({ title, description, price }) {
  const SQL = `
    INSERT INTO products (title, description, price)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
  const response = await db.query(SQL, [title, description, price]);
  return response.rows[0];
}
