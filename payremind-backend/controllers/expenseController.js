import Expense from "../models/Expense.js";

export async function getExpenses(req, res) {
  res.json(await Expense.find({ user: req.user._id }).sort({ createdAt: -1 }));
}

export async function createExpense(req, res) {
  const { date, description, category, amount } = req.body;

  if (!date || !description || !category || amount === undefined) {
    return res.status(400).json({ message: "Date, description, category and amount are required." });
  }

  const expense = await Expense.create({
    user: req.user._id,
    date,
    description,
    category,
    amount: Number(amount)
  });

  res.status(201).json(expense);
}

export async function updateExpense(req, res) {
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!expense) return res.status(404).json({ message: "Expense not found." });
  res.json(expense);
}

export async function deleteExpense(req, res) {
  const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!expense) return res.status(404).json({ message: "Expense not found." });
  res.json({ message: "Expense deleted." });
}
