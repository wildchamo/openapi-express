import express from "express";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";

const app = express();
const swaggerDocument = yaml.load("./openapi.yaml");

const PORT = process.env.PORT || 4000;

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/hello", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀 http://localhost:${PORT}`);
});
