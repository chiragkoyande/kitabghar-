import { Router } from "express";
import { createSubscription, listMySubscriptions, listSubscriptions, updateSubscription } from "../controllers/subscriptionController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/me", listMySubscriptions);
router.get("/", requireRole("admin"), listSubscriptions);
router.post("/", createSubscription);
router.put("/:id", requireRole("admin"), updateSubscription);
export default router;
