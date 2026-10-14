import { Router } from "express";
import { createCategory, listCategories } from "../controllers/categoryController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.get("/", listCategories);
router.post("/", protect, requireRole("admin"), createCategory);
export default router;
