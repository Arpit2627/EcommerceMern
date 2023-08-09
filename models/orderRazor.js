import mongoose from "mongoose";
const OrderRazorSchema = new mongoose.Schema(
  {
    isPaid: {
      type: Boolean,
      default: true,
    },
    amount: {
      type: Number,
    },
    products: [],
    razorpay: {
      orderId: String,
      paymentId: String,
      signature: String,
    },
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("OrderRazor", OrderRazorSchema);
