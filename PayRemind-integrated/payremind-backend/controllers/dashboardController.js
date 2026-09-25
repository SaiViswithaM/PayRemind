import Customer from "../models/Customer.js";
import Payment from "../models/Payment.js";
import Expense from "../models/Expense.js";

export async function getDashboard(req, res) {
  const [customers, payments, expenses] = await Promise.all([
    Customer.find({ user: req.user._id }).sort({ due: -1 }),
    Payment.find({ user: req.user._id }),
    Expense.find({ user: req.user._id })
  ]);

  const totalAmountDue = customers.reduce((sum, c) => sum + Number(c.due || 0), 0);

  const today = new Date();
  const isToday = d =>
    d &&
    new Date(d).getFullYear() === today.getFullYear() &&
    new Date(d).getMonth() === today.getMonth() &&
    new Date(d).getDate() === today.getDate();

  const dueToday = payments
    .filter(p => p.status !== "Paid" && isToday(p.dueDate))
    .reduce((sum, p) => sum + Math.max(0, Number(p.amount) - Number(p.paidAmount)), 0);

  const amountCollected = payments.reduce(
    (sum, p) => sum + Number(p.paidAmount || 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  const reminders = customers
    .filter(c => c.due > 0)
    .slice(0, 10)
    .map(c => ({
      id: c._id,
      name: c.name,
      amount: c.due,
      status: c.status
    }));

  res.json({
    stats: {
      totalAmountDue,
      dueToday,
      amountCollected,
      totalExpenses
    },
    reminders,
    highDebtCustomers: customers.filter(c => c.due > 10000)
  });
}
