import express from "express";
const router = express.Router();
export default router;

import { getAllProducts, getProductById } from "#db/queries/products";

router.get("/", async (req, res, next) => {
  const products = await getAllProducts();
  res.send(products);
});

router.get("/:id", async (req, res, next) => {
  const product = await getProductById(req.params.id);
  res.send(product);
});
