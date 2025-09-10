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

// Simple in-memory users store to support GET/POST /users/:id
// Keys are integers (as required by the OpenAPI spec for path param),
// and example users are provided for testing.
const users = [
  { id: 1, name: "Alice", age: 25, email: "alice@example.com" },
  { id: 2, name: "Bob", age: 30, email: "bob@example.com" },
];

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
  users.push(newUser);
  res.status(201).json(newUser);
});

// GET /users/:id - obtener un usuario por id
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === parseInt(id));
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  return res.json(user);
});

// POST /users/:id - actualizar un usuario existente
app.post("/users/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  const { name, age, email } = req.body;
  const updatedUser = { id, name, age, email };
  users[idx] = updatedUser;
  return res.json(updatedUser);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀 http://localhost:${PORT}`);
});
