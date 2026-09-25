import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder
} from "../controllers/reminderController.js";

const router = express.Router();

router.use(protect);
router.get("/", getReminders);
router.post("/", createReminder);
router.put("/:id", updateReminder);
router.delete("/:id", deleteReminder);

export default router;
