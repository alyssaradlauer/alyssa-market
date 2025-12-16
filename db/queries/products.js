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

export async function getAllProducts() {
  const SQL = `
    SELECT *
    FROM products
    ORDER BY id
    `;
  const response = await db.query(SQL);
  return response.rows;
}

export async function getProductById(id) {
  const SQL = `
    SELECT *
    FROM products
    WHERE id = $1
    `;
  const response = await db.query(SQL, [id]);
  return response.rows[0];
}
