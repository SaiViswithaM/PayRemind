import Payment from "../models/Payment.js";
import Customer from "../models/Customer.js";

function calculateStatus(dueDate, amount, paidAmount) {
  if (paidAmount >= amount) return "Paid";
  if (dueDate && new Date(dueDate) < new Date()) return "Overdue";
  return "Pending";
}

export async function getPayments(req, res) {
  const payments = await Payment.find({ user: req.user._id })
    .populate("customer", "name phone")
    .sort({ createdAt: -1 });

  res.json(payments);
}

export async function createPayment(req, res) {
  const { customerId, amount, dueDate, paidAmount = 0, note = "" } = req.body;

  const customer = await Customer.findOne({
    _id: customerId,
    user: req.user._id
  });

  if (!customer) return res.status(404).json({ message: "Customer not found." });

  const paymentAmount = Number(amount);
  const paid = Number(paidAmount);

  const payment = await Payment.create({
    user: req.user._id,
    customer: customerId,
    amount: paymentAmount,
    dueDate,
    paidAmount: paid,
    note,
    status: calculateStatus(dueDate, paymentAmount, paid)
  });

  await updateCustomerBalance(customerId, req.user._id);

  res.status(201).json(await payment.populate("customer", "name phone"));
}

export async function updatePayment(req, res) {
  const existing = await Payment.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!existing) return res.status(404).json({ message: "Payment not found." });

  Object.assign(existing, req.body);

  existing.amount = Number(existing.amount);
  existing.paidAmount = Number(existing.paidAmount || 0);
  existing.status = calculateStatus(
    existing.dueDate,
    existing.amount,
    existing.paidAmount
  );

  await existing.save();
  await updateCustomerBalance(existing.customer, req.user._id);

  res.json(await existing.populate("customer", "name phone"));
}

export async function deletePayment(req, res) {
  const payment = await Payment.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!payment) return res.status(404).json({ message: "Payment not found." });

  await updateCustomerBalance(payment.customer, req.user._id);
  res.json({ message: "Payment deleted." });
}

async function updateCustomerBalance(customerId, userId) {
  const payments = await Payment.find({ customer: customerId, user: userId });
  const outstanding = payments.reduce(
    (sum, p) => sum + Math.max(0, Number(p.amount) - Number(p.paidAmount)),
    0
  );

  const overdue = payments.some(
    p => p.status === "Overdue" && Number(p.amount) > Number(p.paidAmount)
  );

  await Customer.findOneAndUpdate(
    { _id: customerId, user: userId },
    {
      due: outstanding,
      status: outstanding === 0 ? "Paid" : overdue ? "Overdue" : "Pending"
    }
  );
}
