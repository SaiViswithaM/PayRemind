import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export async function register(req, res) {
  try {
    const { businessName, email, password } = req.body;

    if (!businessName || !email || !password) {
      return res.status(400).json({ message: "Business name, email and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must contain at least 6 characters." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      businessName,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    res.status(201).json({
      message: "Account created successfully.",
      token: generateToken(user._id),
      user: {
        id: user._id,
        businessName: user.businessName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password || "", user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json({
      message: "Login successful.",
      token: generateToken(user._id),
      user: {
        id: user._id,
        businessName: user.businessName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function me(req, res) {
  res.json({ user: req.user });
}
