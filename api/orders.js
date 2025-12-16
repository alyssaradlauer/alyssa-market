import express from "express";
import getUserFromToken from "../middleware/getUserFromToken.js";
import { getOrdersByUserId, getOrderById } from "../db/queries/orders.js";
import requireUser from "#middleware/requireUser";
import { getProductsByOrderId } from "../db/queries/orders_products.js";

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

router.get(
  "/:id/products",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    const orderId = req.params.id;

    const order = await getOrderById(orderId);
    if (!order) {
      return res.status(404).send("Order not found.");
    }
    if (order.user_id !== req.user.id) {
      return res.status(403).send("Unauthorized access to order.");
    }

    const products = await getProductsByOrderId(orderId);
    res.send(products);
  }
);

export default router;
