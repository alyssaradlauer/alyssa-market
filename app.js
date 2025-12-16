import express from "express";

import apiRouter from "./api.js";

const app = express();

app.use(express.json());

//api router is at the root, dont need "/api" here
app.use(apiRouter);

export default app;
