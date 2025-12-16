import express from "express";
import authRouter from "./api/auth.js";
import productsRouter from "./api/products.js";

const router = express.Router();

router.use("/auth", authRouter);

router.use("/products", productsRouter);

export default router;
