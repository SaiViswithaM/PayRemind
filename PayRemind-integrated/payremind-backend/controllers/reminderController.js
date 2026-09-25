import Reminder from "../models/Reminder.js";
import Customer from "../models/Customer.js";

export async function getReminders(req, res) {
  const reminders = await Reminder.find({ user: req.user._id })
    .populate("customer", "name phone due status")
    .populate("payment", "amount dueDate status")
    .sort({ createdAt: -1 });

  res.json(reminders);
}

export async function createReminder(req, res) {
  const { customerId, paymentId, message, reminderDate } = req.body;

  const customer = await Customer.findOne({
    _id: customerId,
    user: req.user._id
  });

  if (!customer) return res.status(404).json({ message: "Customer not found." });

  const reminder = await Reminder.create({
    user: req.user._id,
    customer: customerId,
    payment: paymentId || undefined,
    message: message || `Payment reminder for ${customer.name}`,
    reminderDate: reminderDate || new Date()
  });

  res.status(201).json(
    await reminder.populate("customer", "name phone due status")
  );
}

export async function updateReminder(req, res) {
  const reminder = await Reminder.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  ).populate("customer", "name phone due status");

  if (!reminder) return res.status(404).json({ message: "Reminder not found." });
  res.json(reminder);
}

export async function deleteReminder(req, res) {
  const reminder = await Reminder.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!reminder) return res.status(404).json({ message: "Reminder not found." });
  res.json({ message: "Reminder deleted." });
}
