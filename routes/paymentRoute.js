import express from "express";
import {
  CODPayCreatOrderController,
  CODPayOrderController,
  razorPayCreatOrderController,
  razorPayKeyController,
  razorPayListOrderController,
  razorPayOrderController,
} from "../controllers/paymentController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

//orders
router.get("/get-razorpay-key", requireSignIn, razorPayKeyController);
router.post("/create-order", requireSignIn, razorPayCreatOrderController);



//for COD
router.post("/create-order-COD", requireSignIn, CODPayCreatOrderController);
router.post("/pay-order-COD", requireSignIn, CODPayOrderController);



//payment
router.post("/pay-order", requireSignIn, razorPayOrderController);
//payment
router.get("/list-orders", requireSignIn, razorPayListOrderController);

export default router;
