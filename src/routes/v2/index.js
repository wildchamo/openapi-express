import express from "express";

const router = express.Router();

router.get("/hello", (req, res) => {
  res.json({
    message: "Hello World",
    version: "v2",
    timestamp: new Date().toISOString(),
  });
});

export default router;
