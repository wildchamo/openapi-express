import express from "express";
import usersRouter from "./users.js";
import productsRouter from "./products.js";

const router = express.Router();

// GET /
router.get("/", (req, res) => {
  res.json({ message: "Hello Jose" });
});

// GET /hello
router.get("/hello", (req, res) => {
  res.json({ message: "Hello World" });
});

router.use(usersRouter);
router.use(productsRouter);

export default router;
