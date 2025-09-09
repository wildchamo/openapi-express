import express from "express";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import OpenApiValidator from "express-openapi-validator";

const app = express();
const swaggerDocument = yaml.load("./openapi.yaml");

const PORT = process.env.PORT || 4000;

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.use(
  OpenApiValidator.middleware({
    apiSpec: "./openapi.yaml",
    validateRequests: true,
    validateResponses: true,
    validateSecurity: true,
    ignorePaths: /.*\/docs.*/, // ignore the docs path
  })
);

app.use(express.json());

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello World" });
});

app.get("/", (req, res) => {
  res.json({ message: "Hello Jose" });
});

app.post("/users", (req, res) => {
  const { name, age, email } = req.body;
  const newUser = {
    id: Date.now().toString(),
    name,
    age,
    email,
  };
  res.status(201).json(newUser);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀 http://localhost:${PORT}`);
});
