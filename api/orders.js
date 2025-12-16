import express from "express";
import getUserFromToken from "../middleware/getUserFromToken.js";
import {
  createOrder,
  getOrdersByUserId,
  getOrderById,
} from "../db/queries/orders.js";
import requireUser from "../middleware/requireUser.js";
import {
  getProductsByOrderId,
  addProductToOrder,
} from "../db/queries/orders_products.js";
import { getProductById } from "../db/queries/products.js";

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

router.post("/", getUserFromToken, requireUser, async (req, res, next) => {
  const { date, note } = req.body;

  if (!date) return res.status(400).send("Date is required.");

  const order = await createOrder({
    user_id: req.user.id,
    date,
    note: note ?? null,
  });
  res.status(201).send(order);
});

router.post(
  "/:id/products",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    const orderId = req.params.id;
    const { productId, quantity } = req.body;

    const order = await getOrderById(orderId);
    if (!order) return res.status(404).send("Order not found.");
    if (order.user_id !== req.user.id)
      return res.status(403).send("Unauthorized access to order.");
    if (!productId || quantity == null)
      return res.status(400).send("Product ID and quantity are required.");

    const product = await getProductById(productId);
    if (!product) return res.status(400).send("Product does not exist");

    const row = await addProductToOrder({
      order_id: orderId,
      product_id: productId,
      quantity,
    });

    res.status(201).send(row);
  }
);
export default router;
