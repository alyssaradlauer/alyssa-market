import express from "express";
const app = express();
export default app;
import apiRouter from "#api";

app.use(express.json());
app.use("/api", apiRouter);
