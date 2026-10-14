import { Router } from "express";
import { listMyNotifications, listNotifications, markNotificationRead } from "../controllers/notificationController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", requireRole("admin"), listNotifications);
router.get("/me", listMyNotifications);
router.patch("/:id/read", markNotificationRead);
export default router;
