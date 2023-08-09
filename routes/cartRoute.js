import express from "express";
import { requireSignIn, isAdmin } from "./../middlewares/authMiddleware.js";
import {PostCartController,getCartController} from "../controllers/cartController.js";

const router = express.Router(); 


router.post("/user/cart/add-cart", requireSignIn, PostCartController);

router.get("/get-cart-item/:id", requireSignIn,  getCartController);

export default router;