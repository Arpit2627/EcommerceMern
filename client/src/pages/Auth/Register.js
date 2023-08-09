import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { Link } from "react-router-dom";
import zxcvbn from "zxcvbn";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address,
        answer,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        localStorage.setItem("auth", JSON.stringify(res?.data?.user?._id));

        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  function getPasswordStrengthText(score) {
    const strengthLevels = [
      "Very Weak",
      "Weak",
      "Moderate",
      "Strong",
      "Very Strong",
    ];
    return strengthLevels[score];
  }

  function generateStrongPassword() {
    // Generate a strong password suggestion using your logic
    // This can include a mix of letters (uppercase and lowercase), numbers, and special characters
    // Example: return "P@ssw0rd123!"
    return "P@ssw0rd123!";
  }

  return (
    <Layout title="Register - Ecommer App">
      <div className="form-container-register" style={{ minHeight: "90vh" }}>
        <form onSubmit={handleSubmit}>
          <h4 className="title">REGISTER FORM</h4>
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                const newName = e.target.value.slice(0, 50); // Limit input to 50 characters
                setName(newName);
              }}
              className="form-control "
              id="exampleInputEmail1"
              placeholder="Your Name"
              required
              autoFocus
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
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
              placeholder="Your Password"
              required
            />
          </div>
          {/* Password strength indicator */}
          <div className="password-strength">
            {password && (
              <>
                <progress
                  value={zxcvbn(password).score * 25}
                  max="100"
                ></progress>
                <p>
                  Password Strength:{" "}
                  {getPasswordStrengthText(zxcvbn(password).score)}
                </p>
              </>
            )}
          </div>

          {/* Password suggestion */}
          <div className="password-suggestion">
            {password && <p>Suggested Password: {generateStrongPassword()}</p>}
          </div>

          <div className="mb-3">
  <input
    type="text"
    value={phone}
    onChange={(e) => {
      const enteredValue = e.target.value;
      const validPhone = /^\d+$/.test(enteredValue); // Only digits are allowed
      
      if (validPhone || enteredValue === "") {
        setPhone(enteredValue);
      }
    }}
    className="form-control"
    id="exampleInputEmail1"
    placeholder="Phone Number"
    required
  />
</div>
          <div className="mb-3">
            <input
              type="text"
              value={address}
              onChange={(e) => {
                const newAddress = e.target.value.slice(0, 100); // Limit input to 100 characters
                setAddress(newAddress);
              }}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Address"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              placeholder="Favorite sports"
              required
            />
          </div>
          <button type="submit" style={{backgroundColor:'#ffa502',color:'#000',borderRadius:'80px',fontWeight:'bold'}} className="btn btn-primary">
            REGISTER
          </button>
          <p>
          Existing User ?{" "} &nbsp;
          <Link style={{ textDecoration: "none" }} to="/login">
            Log in
          </Link>
        </p>
        <p>
          <Link to={"/policy"} style={{ textDecoration: "none" }}>
            Terms of Use{" "} &nbsp;
          </Link>{" "}
          and{" "} &nbsp;
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

export default Register;
