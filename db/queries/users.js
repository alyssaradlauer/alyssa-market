import db from "../client.js";
import bcrypt from "bcrypt";

export async function createUser(user) {
  if (!user.username.trim() || !user.password.trim()) {
    throw Error("must have username and password");
  }
  user.password = await bcrypt.hash(user.password, 5);
  const SQL = `
        INSERT INTO users(username, password) VALUES ($1, $2) RETURNING *;
    `;
  const response = await db.query(SQL, [user.username, user.password]);
  return response.rows[0];
}

export async function getUserById(id) {
  const SQL = `
    SELECT id, username
    FROM users
    WHERE id = $1
    `;
  const response = await db.query(SQL, [id]);
  return response.rows[0];
}
