import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    cartItems: [],
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);

