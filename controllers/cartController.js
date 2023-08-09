import cartModel from "../models/cartModel.js";
export const PostCartController = async (req, res) => {
  try {
    const { user, cartItems } = req.body; // Use user and cartItems from the request body

    if (!cartItems) {
      return res.status(400).send({
        success: false,
        message: "cartItems are not received in the backend",
      });
    }

    let existingCart = await cartModel.findOne({ user });

    if (existingCart) {
      // If cart exists, update the cartItems
      existingCart.cartItems = cartItems;
      await existingCart.save();

      res.status(200).send({
        success: true,
        message: "cart updated",
        cart: existingCart,
      });
    } else {
      // If cart doesn't exist, create a new cart
      const newCart = await new cartModel({ user, cartItems }).save();

      res.status(201).send({
        success: true,
        message: "new cart created",
        cart: newCart,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error in creating cart",
    });
  }
};
export const getCartController = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const getItems = await cartModel.findOne({ user: id });
    res.status(200).send({
      success: true,
      message: "SuccessFully GetItems",
      getItems,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting cartItems",
      error,
    });
  }
};
