import db from "#db/client";

export async function addProductToOrder({ order_id, product_id, quantity }) {
  const SQL = `
    INSERT INTO order_products (order_id, product_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
  const response = await db.query(SQL, [order_id, product_id, quantity]);
  return response.rows[0];
}
