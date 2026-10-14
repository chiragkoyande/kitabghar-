import { Router } from "express";
import { createBook, deleteBook, getBook, listBooks, updateBook } from "../controllers/bookController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.get("/", listBooks);
router.get("/:id", getBook);
router.post("/", protect, requireRole("admin"), createBook);
router.put("/:id", protect, requireRole("admin"), updateBook);
router.delete("/:id", protect, requireRole("admin"), deleteBook);