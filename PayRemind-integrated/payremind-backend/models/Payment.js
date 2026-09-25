import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date },
    paidAmount: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Overdue", "Paid"],
      default: "Pending"
    },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
