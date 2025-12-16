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

export async function getProductsByOrderId(orderId) {
  const SQL = `
    SELECT
      products.id,
      products.title,
      products.description,
      products.price,
      order_products.quantity
    FROM order_products
    JOIN products
      ON order_products.product_id = products.id
    WHERE order_products.order_id = $1;
    `;
  const response = await db.query(SQL, [orderId]);
  return response.rows;
}
