import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";
const CartPage = () => {
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();


  const totalPrice = () => {
    try {
      let amount = 0;
      cart?.map((item) => {
        amount =
          amount +
          Math.round(
            (item.price - (item.price * item.discount) / 100) *
              item.customQuantity
          );
      });
      localStorage.setItem("amount", JSON.stringify(amount));
      return amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };
  var retrievedValue = localStorage.getItem("amount");
  var parsedValue = JSON.parse(retrievedValue);
  console.log(parsedValue);
  //online payment

  function loadRazorpay() {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      alert("Razorpay SDK failed to load. Are you online?");
    };
    script.onload = async () => {
      try {
        setLoading(true);
        const result = await axios.post("/api/v1/payment/create-order", {
          cart,
          amount: parsedValue * 100,
        });
        const { amount, id: order_id, currency } = result.data;
        const {
          data: { key: razorpayKey },
        } = await axios.get("/api/v1/payment/get-razorpay-key");
        // console.log(cart);
        const options = {
          key: razorpayKey,
          amount: amount,
          currency: currency,
          name: "example name",
          description: "example transaction",
          order_id: order_id,
          handler: async function (response) {
            const result = await axios.post("/api/v1/payment/pay-order", {
              amount: amount,
              products: cart,
              razorpay: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
              buyer: auth?.user?._id,
            });
            alert(result.data.msg);
            // fetchOrders();
            localStorage.removeItem("cart");
            setCart([]);
            navigate(`/dashboard/user/orders`);
            toast.success("Payment Completed Successfully ");
          },
          prefill: {
            name: "example name",
            email: "email@example.com",
            contact: "111111",
          },
          notes: {
            address: "example address",
          },
          theme: {
            color: "#80c0f0",
          },
        };

        setLoading(false);
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        alert(err);
        setLoading(false);
      }
    };
    document.body.appendChild(script);
  }

  //another cod method

  function COD() {
    try {
      setLoading(true);
      const result = axios.post("/api/v1/payment/create-order", {
        cart,
        amount: parsedValue * 100, // Amount in minor currency units
      });

      // Other order processing logic (if needed)

      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate(`/dashboard/user/orders`);
      toast.success("Order Placed Successfully");
    } catch (err) {
      alert(err);
      setLoading(false);
    }
  }

  //total price

  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  //  handle quanityt
  const increaseCustomQuantity = (product) => {
    const updatedCart = cart.map((item) => {
      if (item._id === product._id) {
        return { ...item, customQuantity: item.customQuantity + 1 };
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.location.reload();
  };
  const decreaseCustomQuantity = (product) => {
    const updatedCart = cart.map((item) => {
      if (item._id === product._id && item.customQuantity > 1) {
        return { ...item, customQuantity: item.customQuantity - 1 };
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.location.reload();
  };

  return (
    <Layout>
      <div className=" cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container d-flex flex-lg-row flex-column ">
          {/* <div className="row"> */}
          <div className="col-md-10 col-lg-9 col-sm-9 p-1 m-2">
            {cart?.map((p) => (
              <div className="card flex-row h-70" key={p._id}>
                <div className="col-md-5 col-4 p-1">
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name.substring(0, 20)}
                    width={"130px"}
                    height={"130px"}
                  />
                </div>
                <div className="col-md-5 col-4 p-1">
                  <p>{p.name.substring(0, 20)}</p>
                  <p>
                    Price:{" "}
                    {Math.round(p.price - (p.price * p.discount) / 100) *
                      p.customQuantity}
                  </p>
                </div>
                <div className="col-md-2 col-3 p-1">
                  <div className="d-flex justify-content-center">
                    <button
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        width: "40%",
                        height: "30%",
                        borderRadius: "55px",
                        backgroundColor: "#ffa502",
                      }}
                      onClick={() => increaseCustomQuantity(p)}
                    >
                      +
                    </button>
                    <div className="text-center">
                      Quantity {p.customQuantity}
                    </div>
                    <button
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        width: "40%",
                        height: "30%",
                        borderRadius: "55px",
                        backgroundColor: "#ffa502",
                      }}
                      onClick={() => decreaseCustomQuantity(p)}
                    >
                      -
                    </button>
                  </div>
                  <div className="col-md-12 cart-remove-btn">
                    <button
                      className="btn btn-danger"
                      style={{ width: "120px", marginTop: "10px" }}
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4 col-lg-3 cart-summary text-center m-2 ">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total : {totalPrice()} </h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                  >
                    Please Login to checkout
                  </button>
                )}
              </div>
            )}
            <div className="mt-2">
              {!auth?.token || !cart?.length ? (
                ""
              ) : (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={loadRazorpay}
                    disabled={loading || !auth?.user?.address}
                  >
                    {loading ? "Processing ...." : "Pay Online"}
                  </button>
                  {/* COD payment  */}
                  <button
                    className="btn btn-primary m-4"
                    // onClick={COD}
                    disabled={!auth?.user?.address}
                  >
                    {/* {loading ? "Processing ...." : "Cash On Delivery"} */}
                    Cash On Delivery
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
