import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment
} from "../controllers/paymentController.js";

const router = express.Router();

router.use(protect);
router.get("/", getPayments);
router.post("/", createPayment);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

export default router;
