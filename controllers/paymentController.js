import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import JWT from "jsonwebtoken";
import OrderRazor from "../models/orderRazor.js";

//payment verify
export const razorPayKeyController = async (req, res) => {
  res.send({ key: process.env.RAZORPAY_KEY_ID });
};
//payment verify
export const razorPayCreatOrderController = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const options = {
      amount: req.body.amount,
      currency: "INR",
    };
    const orderRazor = await instance.orders.create(options);
    if (!orderRazor) return res.status(500).send("Some error occured");
    res.send(orderRazor);
  } catch (error) {
    res.status(500).send(error);
  }
};
//payment verify complete
export const razorPayOrderController = async (req, res) => {
  try {
    const { amount, products, razorpay, buyer } = req.body;
    let totalAmount = 0;
    products.map((item) => {
      totalAmount =
        totalAmount +
        (item.price - (item.price * item.discount) / 100) * item.customQuantity;
    });
    const newOrder = new OrderRazor({
      isPaid: true,
      amount: totalAmount,
      products: products,
      razorpay: razorpay,
      buyer: buyer,
    });
    await newOrder.save();
    res.send({
      msg: "Payment was successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
//payment verify
export const razorPayListOrderController = async (req, res) => {
  try {
    const orders = await OrderRazor.find();
    res.send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
