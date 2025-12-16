import db from "../db/client.js";
import express from "express";
const router = express.Router();
export default router;
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import getUserFromToken from "../middleware/getUserFromToken.js";
import requireUser from "../middleware/requireUser.js";

import { createToken } from "../utils/jwt";
import { createUser } from "../db/queries/users.js";

export async function authenticate(credentials) {
  const SQL = `
        SELECT id, password
        FROM users
        WHERE username = $1
    `;
  const response = await db.query(SQL, [credentials.username]);
  if (!response.rows.length) {
    const error = Error("bad credentials");
    error.status = 401;
    throw error;
  }
  const user = response.rows[0];
  const valid = await bcrypt.compare(
    credentials.password,
    response.rows[0].password
  );
  if (!valid) {
    const error = Error("bad credentials");
    error.status = 401;
    throw error;
  }
  const token = createToken({ id: user.id });
  return token;
}

router.post("/login", async (req, res, next) => {
  try {
    const token = await authenticate(req.body);
    res.send({ token });
  } catch (err) {
    next(err);
  }
});

router.get("/me", getUserFromToken, requireUser, (req, res, next) => {
  res.send(req.user);
});

router.post("/register", async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    const token = createToken({ id: user.id });
    res.status(201).send({ token });
  } catch (err) {
    next(err);
  }
});
