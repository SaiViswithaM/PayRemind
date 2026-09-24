import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    message: { type: String, default: "" },
    reminderDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Pending", "Sent"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", reminderSchema);
