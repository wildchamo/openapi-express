import express from "express";
import users from "../../data/users.js";

const router = express.Router();

// POST /users - crear un nuevo usuario
router.post("/users", (req, res) => {
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
router.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === parseInt(id));
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  return res.json(user);
});

// POST /users/:id - actualizar un usuario existente
router.post("/users/:id", (req, res) => {
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

export default router;
