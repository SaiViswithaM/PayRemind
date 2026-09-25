import Customer from "../models/Customer.js";

export async function getCustomers(req, res) {
  const customers = await Customer.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(customers);
}

export async function createCustomer(req, res) {
  const { name, phone, due = 0, status } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: "Name and phone are required." });
  }

  const amount = Number(due);
  const customer = await Customer.create({
    user: req.user._id,
    name,
    phone,
    due: amount,
    status: status || (amount > 0 ? "Pending" : "Paid")
  });

  res.status(201).json(customer);
}

export async function updateCustomer(req, res) {
  const customer = await Customer.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!customer) return res.status(404).json({ message: "Customer not found." });
  res.json(customer);
}

export async function deleteCustomer(req, res) {
  const customer = await Customer.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!customer) return res.status(404).json({ message: "Customer not found." });
  res.json({ message: "Customer deleted." });
}
