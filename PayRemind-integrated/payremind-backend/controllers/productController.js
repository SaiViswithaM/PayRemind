import Product from "../models/Product.js";

export async function getProducts(req, res) {
  res.json(await Product.find({ user: req.user._id }).sort({ createdAt: -1 }));
}

export async function createProduct(req, res) {
  const { name, brand, qty, price } = req.body;
  if (!name || !brand) {
    return res.status(400).json({ message: "Product name and brand are required." });
  }

  const product = await Product.create({
    user: req.user._id,
    name,
    brand,
    qty: Number(qty),
    price: Number(price)
  });

  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json(product);
}

export async function deleteProduct(req, res) {
  const product = await Product.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json({ message: "Product deleted." });
}
