import express from "express";
import getUserFromToken from "../middleware/getUserFromToken.js";
import { getOrdersByUserId, getOrderById } from "../db/queries/orders.js";
import requireUser from "#middleware/requireUser";

const router = express.Router();

router.get("/", getUserFromToken, requireUser, async (req, res) => {
  const orders = await getOrdersByUserId(req.user.id);
  res.send(orders);
});

router.get("/:id", getUserFromToken, requireUser, async (req, res, next) => {
  const order = await getOrderById(req.params.id);

  if (!order) return res.status(404).send("Order not found.");

  if (order.user_id !== req.user.id)
    return res.status(403).send("Unauthorized access to order.");

  res.send(order);
});

export default router;
