import express from "express";
import authRouter from "./api/auth.js";
import productsRouter from "./api/products.js";
import ordersRouter from "./api/orders.js";

const router = express.Router();

router.use("/users", authRouter);

router.use("/products", productsRouter);

router.use("/orders", ordersRouter);

export default router;
