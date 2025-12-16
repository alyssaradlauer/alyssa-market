import db from "#db/client";

export async function addProductToOrder({ order_id, product_id, quantity }) {
  const SQL = `
    INSERT INTO orders_products (order_id, product_id, quantity)
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
    FROM orders_products
    JOIN products
      ON orders_products.product_id = products.id
    WHERE orders_products.order_id = $1;
    `;
  const response = await db.query(SQL, [orderId]);
  return response.rows;
}
