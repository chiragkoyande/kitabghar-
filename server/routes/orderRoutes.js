import { Router } from "express";
import { createOrder, listMyOrders, listOrders, updateOrder } from "../controllers/orderController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/me", listMyOrders);
router.get("/", requireRole("admin"), listOrders);
router.post("/", createOrder);
router.patch("/:id", requireRole("admin"), updateOrder);
export default router;
