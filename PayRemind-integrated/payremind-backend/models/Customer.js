import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    due: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Overdue", "Paid"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
