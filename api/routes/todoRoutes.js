const express = require("express");
const router = express.Router();
const { getAllTodos, createTodo, updateTodo, deleteTodo, getOverdueTodos } = require("../controllers/todoController");

router.get("/", getAllTodos);
router.get("/overdue", getOverdueTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router; 