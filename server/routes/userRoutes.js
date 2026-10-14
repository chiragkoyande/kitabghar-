import { Router } from "express";
import { deleteUser, getUser, listUsers, updateUser } from "../controllers/userController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", requireRole("admin"), listUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", requireRole("admin"), deleteUser);
export default router;
