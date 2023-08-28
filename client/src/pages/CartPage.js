import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [setOtp_gen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false); // To control the visibility of OTP input
  const [varified, setVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderId();
  });

  function generateUniqueId(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let id = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      id += characters.charAt(randomIndex);
    }

    return id;
  }

  //for uuid
  async function fetchOrderId() {
    try {
      // const response = await fetch("/generate-uuid");
      // // Change this URL to match your backend route
      // const data = await response.json();

      const orderid = "order_CD" + generateUniqueId(12);

      setOrderId(orderid);
    } catch (error) {
      console.error("Error fetching order ID:", error);
    }
  }

  const totalPrice = () => {
    try {
      let amount = 0;

      cart?.forEach((item) => {
        const itemTotal = Math.round(
          (item.price - (item.price * item.discount) / 100) *
            item.customQuantity
        );
        amount += itemTotal;
      });

      if (amount <= 499) {
        amount += 0;
      } else if (amount >= 500 && amount <= 999) {
        amount += 30;
      } else if (amount >= 1000) {
        amount += 60;
      }

      localStorage.setItem("amount", JSON.stringify(amount));

      return amount;
    } catch (error) {
      console.log(error);
    }
  };

  const totalAmount = () => {
    try {
      let amount = 0;

      cart?.forEach((item) => {
        const itemTotal = Math.round(
          (item.price - (item.price * item.discount) / 100) *
            item.customQuantity
        );
        amount += itemTotal;
      });

      return amount;
    } catch (error) {
      console.log(error);
    }
  };

  var retrievedValue = localStorage.getItem("amount");
  var parsedValue = JSON.parse(retrievedValue);

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
          name: "manasvi technologies",
          description: "transction to manasvi",
          order_id: order_id,
          handler: async function (response) {
            await axios.post("/api/v1/payment/pay-order", {
              paymentMode: true,
              amount: amount,
              products: cart,
              razorpay: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
              buyer: auth?.user?._id,
            });
            // alert(result.data.msg);
            // fetchOrders();
            localStorage.removeItem("cart");
            setCart([]);
            navigate(`/dashboard/user/orders`);
            toast.success("Payment Completed Successfully ");
          },
          prefill: {
            name: "Manasvi technologies",
            email: "manasvi@gmail.com",
            contact: "1111111111",
          },
          notes: {
            address: "30, minaal residency bhopal",
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

  // Cash on delivery testing
  let phone = "+91" + auth?.user?.phone;
  // Cash on delivery testing

  const cash_data = async () => {
    try {
      setLoading(true);
      //below code for otp
      const apiKey = "1fb16418-3d8f-11ee-addf-0200cd936042";
      const mobileNumber = phone;

      const min = 100000;
      const max = 999999;
      OTP1 = Math.floor(Math.random() * (max - min + 1)) + min;
      localStorage.setItem("OTP", JSON.stringify(OTP1));
      // console.log(OTP1);
      const url = `https://2factor.in/API/V1/${apiKey}/SMS/${mobileNumber}/${OTP1}`;
      toast.success("OTP send successfully! ");
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: url,
        headers: {},
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data.Status));
          if (response.data.Status) {
            setOtp_gen(true);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      setLoading(false);
      //end
    } catch (err) {
      alert(err);
      setLoading(false);
    }
  };

  //total price

  //cash on delivery
  var OTP1 = 0;

  const handleCashOnDelivery = () => {
    setShowOtpInput(true);
    cash_data();
    // Show the OTP input field
  };

  //for otp input form
  const handleSubmit = async () => {
    let otp_local = localStorage.getItem("OTP");
    if (otp_local === inputValue) {
      localStorage.removeItem("OTP");
      setVerified(true); // Assuming you have a 'verified' state to track OTP verification
      toast.success("OTP verified Successfully!");
      await axios.post("/api/v1/payment/create-order-COD", {
        isPaid: true,
        paymentMode: false,
        amount: parsedValue,
        products: cart,
        buyer: auth?.user?._id,
        razorpay: {
          orderId: orderId,
        },
      });
      // const { amount, id: _id } = result.data;
      localStorage.removeItem("cart");
      setCart([]);
      navigate(`/dashboard/user/orders`);
      toast.success("Order Placed Successfully! ");
      // You can call the order generation function here
    } else {
      toast.error("Incorrect OTP entered.");
    }
  };

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
      <div className="cart-page">
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
                <div className="col-md-2 col-3 p-1">
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name.substring(0, 20)}
                    // width="100px"
                    height="100px"
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
                        width: "50%",
                        height: "50%",
                        borderRadius: "200px",
                        padding: "2px",
                        backgroundColor: "#ffa502",
                      }}
                      onClick={() => decreaseCustomQuantity(p)}
                    >
                      -
                    </button>

                    <div className="text-center m-1">
                      Quantity {p.customQuantity}
                    </div>
                    <button
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        width: "50%",
                        height: "50%",
                        borderRadius: "200px",
                        backgroundColor: "#ffa502",
                      }}
                      onClick={() => increaseCustomQuantity(p)}
                    >
                      +
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

            <h4>Total amount : ₹{totalAmount()} </h4>
            <h4>
              Delivery Charges : ₹
              {JSON.parse(totalPrice()) - JSON.parse(totalAmount())}{" "}
            </h4>
            <h4>Total Payable amount : ₹{totalPrice()} </h4>
          
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h5>Current Address</h5>
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
                    onClick={handleCashOnDelivery}
                    disabled={!auth?.user?.address || showOtpInput} // Disable if OTP input is shown
                  >
                    Cash On Delivery
                  </button>

                  {showOtpInput && !varified && (
                    // Show OTP input only when 'showOtpInput' is true and OTP is not verified
                    <form>
                    <label>Enter OTP</label>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button type="button" onClick={handleSubmit}>
                      Verify OTP via Call
                    </button>
                  </form>
                  )}
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
