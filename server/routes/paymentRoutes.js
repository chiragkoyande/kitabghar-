import { Router } from "express";
import { listMyPayments, listPayments, submitPaymentProof, updatePayment } from "../controllers/paymentController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/me", listMyPayments);
router.patch("/:id/proof", submitPaymentProof);
router.get("/", requireRole("admin"), listPayments);
router.put("/:id", requireRole("admin"), updatePayment);
export default router;
