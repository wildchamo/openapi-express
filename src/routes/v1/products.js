import express from "express";
import products from "../../data/products.js";

const router = express.Router();

// POST /products - crear un nuevo producto
router.post("/products", (req, res) => {
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
router.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  return res.json(product);
});

// POST /products/:id - actualizar un producto existente
router.post("/products/:id", (req, res) => {
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

export default router;
