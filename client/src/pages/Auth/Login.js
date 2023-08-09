import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        // console.log(auth);
        localStorage.setItem("auth", JSON.stringify(res.data));
        let dd = localStorage.getItem("auth");
        let d = JSON.parse(dd);
        console.log(d.user._id, "id");
        if (d.token) {
          const data = await axios.get(
            `/api/v1/cart/get-cart-item/${d?.user?._id}`,
            {
              headers: {
                Authorization: `${d?.token}`,
              },
            }
          );
          //  console.log("called");
          // console.log(data?.data?.getItems?.cartItems, "cartitems");
          if (data?.data?.getItems?.cartItems) {
            const existingCart = JSON.parse(localStorage.getItem("cart"));
            const newCartItems = data.data.getItems.cartItems;
          
            if (existingCart && Array.isArray(existingCart)) {
              newCartItems.forEach(newCartItem => {
                const existingItemIndex = existingCart.findIndex(
                  existingItem => existingItem._id === newCartItem._id
                );
                if (existingItemIndex !== -1) {
                  existingCart[existingItemIndex].customQuantity += newCartItem.customQuantity;
                } else {
                  existingCart.push(newCartItem);
                }
              });
              localStorage.setItem("cart", JSON.stringify(existingCart));
            } else {
              localStorage.setItem(
                "cart",
                JSON.stringify(data.data.getItems.cartItems)
              );
            }
          } else {
            console.log(data);
            console.log("error in data");
          }
        }
        navigate(location.state || "/");
        window.location.reload();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  // const data = await axios.get(
  //           `/api/v1/cart/get-cart-item/${auth?.user?._id}`
  //         );
  // console.log("called");
  //         if (data) {
  //           console.log(data?.data?.getItems?.cartItems);
  //           localStorage.setItem(
  //             "cart",
  //             JSON.stringify(data?.data?.getItems?.cartItems)
  //           );
  //         } else {
  //           console.log(data);
  //           console.log("error in data");
  //         }
  return (
    <Layout title="Register - Ecommer App">
      <div className="form-container " style={{ minHeight: "90vh" }}>
        <form onSubmit={handleSubmit}>
          <h4 className="title">LOGIN FORM</h4>

          <div className="mb-3">
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email "
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              required
            />
          </div>

          <div className="mb-3">
            <button
              type="button"
              className="btn forgot-btn"
              style={{borderRadius:'80px'}}
              onClick={() => {
                navigate("/forgot-password");
              }}
            >
              Forgot Password
            </button>
          </div>

          <button type="submit" style={{backgroundColor:'#ffa502',color:'#000',borderRadius:'80px',fontWeight:'bold'}} className="btn btn-primary">
            LOGIN
          </button>
          <p>
          New Customer ?{" "} &nbsp;
          <Link style={{ textDecoration: "none" }} to="/register">
            Sign Up 
          </Link>
        </p>
        <p>
          <Link to={"/policy"} style={{ textDecoration: "none" }}>
            Terms of Use{" "}&nbsp;
          </Link>{" "}
          and{" "}&nbsp;
          <Link to={"/policy"} style={{ textDecoration: "none" }}>
            {" "}
            Privacy Policy{" "}
          </Link>
          .
        </p>
        </form>
        
      </div>
    </Layout>
  );
};

export default Login;
