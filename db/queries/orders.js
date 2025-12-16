import db from "../client.js";

export async function createOrder({ user_id, date, note }) {
  const SQL = `
    INSERT INTO orders (user_id, date, note)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
  const response = await db.query(SQL, [user_id, date, note]);
  return response.rows[0];
}

export async function getOrdersByUserId(user_id) {
  const SQL = `
    SELECT *
    FROM orders
    WHERE user_id = $1;
    `;
  const response = await db.query(SQL, [user_id]);
  return response.rows;
}

export async function getOrderById(id) {
  const SQL = `
    SELECT id, date, note, user_id
    FROM orders
    WHERE id = $1
    `;
  const response = await db.query(SQL, [id]);
  return response.rows[0];
}

export async function getOrdersByProductIdForUser(productId, userId) {
  const SQL = `
    SELECT orders.*
    FROM orders
    JOIN orders_products
    ON orders_products.order_id = orders.id
    WHERE orders_products.product_id = $1
    AND orders.user_id = $2
    ORDER BY orders.id
    `;
  const response = await db.query(SQL, [productId, userId]);
  return response.rows;
}
