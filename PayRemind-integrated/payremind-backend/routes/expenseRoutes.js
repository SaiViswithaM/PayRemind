import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense
} from "../controllers/expenseController.js";

const router = express.Router();

router.use(protect);
router.get("/", getExpenses);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
