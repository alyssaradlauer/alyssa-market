import express from "express";
import { getAllProducts, getProductById } from "../db/queries/products.js";
import getUserFromToken from "../middleware/getUserFromToken.js";
import requireUser from "../middleware/requireUser.js";
import { getOrdersByProductIdForUser } from "../db/queries/orders.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  const products = await getAllProducts();
  res.send(products);
});

router.get("/:id", async (req, res, next) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).send("Product not found.");
  res.send(product);
});

router.get(
  "/:id/orders",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).send("Product not found.");

    const orders = await getOrdersByProductIdForUser(
      req.params.id,
      req.user.id
    );
    res.send(orders);
  }
);

export default router;
