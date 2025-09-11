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

// In-memory products store to support /products endpoints
let products = [
  {
    id: 1,
    name: "Smartphone",
    description: "Mid-range phone",
    price: 299.99,
    category: "electronics",
    tags: ["mobile", "gadgets"],
    inStock: true,
    specifications: { color: "black", storage: "128GB" },
    ratings: [{ score: 5, comment: "Great value" }],
  },
  {
    id: 2,
    name: "Novel Book",
    description: "Bestseller novel",
    price: 19.99,
    category: "books",
    tags: ["fiction"],
    inStock: true,
    specifications: { author: "Doe" },
    ratings: [{ score: 4, comment: "Good read" }],
  },
  {
    id: 3,
    name: "Wireless Headphones",
    description: "Over-ear Bluetooth 5.3 headphones with ANC",
    price: 129.99,
    category: "electronics",
    tags: ["audio", "bluetooth"],
    inStock: true,
    specifications: { brand: "SoundMax", color: "black", battery: "40h" },
    ratings: [{ score: 5, comment: "Excelente sonido" }],
  },
  {
    id: 4,
    name: "JavaScript Patterns",
    description: "A practical guide to modern JS design patterns",
    price: 39.95,
    category: "books",
    tags: ["programming", "javascript"],
    inStock: true,
    specifications: { author: "Jane Doe", pages: "420", language: "en" },
    ratings: [{ score: 4, comment: "Muy útil para proyectos grandes" }],
  },
  {
    id: 5,
    name: "Organic Granola",
    description: "Gluten-free granola with almonds and honey",
    price: 8.5,
    category: "food",
    tags: ["breakfast", "snack"],
    inStock: true,
    specifications: {
      weight: "500g",
      ingredients: "oats, almonds, honey",
      allergens: "nuts",
    },
    ratings: [
      { score: 5, comment: "Deliciosa y saludable" },
      { score: 4, comment: "Un poco cara" },
    ],
  },
];

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

// POST /products - crear un nuevo producto
app.post("/products", (req, res) => {
  const {
    name,
    description,
    price,
    category,
    tags,
    inStock,
    specifications,
    ratings,
  } = req.body;
  const newProduct = {
    id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    name,
    description,
    price,
    category,
    tags,
    inStock,
    specifications,
    ratings,
  };
  products.push(newProduct);
  return res.status(201).json(newProduct);
});

// GET /products/:id - obtener un producto por id
app.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  return res.json(product);
});

// POST /products/:id - actualizar un producto existente
app.post("/products/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  const {
    name,
    description,
    price,
    category,
    tags,
    inStock,
    specifications,
    ratings,
  } = req.body;
  const updated = {
    id,
    name,
    description,
    price,
    category,
    tags,
    inStock,
    specifications,
    ratings,
  };
  products[idx] = updated;
  return res.json(updated);
});

// Error handler should be after all routes to catch validation and route errors
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀 http://localhost:${PORT}`);
});
