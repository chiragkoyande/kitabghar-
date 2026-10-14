import { Router } from "express";
import { createRental, deleteRental, getRental, listMyRentals, listRentals, returnRental } from "../controllers/rentalController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/me", listMyRentals);
router.get("/", requireRole("admin"), listRentals);
router.get("/:id", getRental);
router.post("/", createRental);
router.patch("/:id/return", returnRental);
router.put("/:id", requireRole("admin"), returnRental);
router.delete("/:id", requireRole("admin"), deleteRental);
export default router;
