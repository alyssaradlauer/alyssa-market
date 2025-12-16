import db from "#db/client";
import express from "express";
const router = express.Router();
export default router;
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";

import { createToken } from "#utils/jwt";
import { createUser } from "#db/queries/users";

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
  const token = await authenticate(req.body);
  console.log(token);
  res.send({ token });
});

router.get("/me", getUserFromToken, requireUser, (req, res, next) => {
  res.send(req.user);
});

router.post("/register", async (req, res, next) => {
  const user = await createUser(req.body);
  const token = createToken({ id: user.id });
  res.status(201).send({ token });
});
