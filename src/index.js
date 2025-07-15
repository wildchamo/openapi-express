import express from "express";

const app = express();

const PORT = process.env.PORT || 4000;

app.get("/hello", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀 http://localhost:${PORT}`);
});
