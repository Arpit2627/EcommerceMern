import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { Link } from "react-router-dom";
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
  const calculatePasswordStrength = (password) => {
    // Define criteria for different strength levels
    const minLength = 8;
    const minUpperCase = 1;
    const minLowerCase = 1;
    const minDigits = 1;
    const minSpecialChars = 1;

    // Count occurrences of each character type
    const upperCaseCount = password.replace(/[^A-Z]/g, "").length;
    const lowerCaseCount = password.replace(/[^a-z]/g, "").length;
    const digitCount = password.replace(/[^0-9]/g, "").length;
    const specialCharCount = password.replace(/[A-Za-z0-9]/g, "").length;

    // Calculate the password strength score based on criteria
    let score = 0;
    if (password.length >= minLength) score++;
    if (upperCaseCount >= minUpperCase) score++;
    if (lowerCaseCount >= minLowerCase) score++;
    if (digitCount >= minDigits) score++;
    if (specialCharCount >= minSpecialChars) score++;

    return score;
  };

  const getPasswordStrengthText = (score) => {
    // Implement your own logic to determine password strength based on the score.
    // You can use if-else conditions to return appropriate messages.
    // For example:
    if (score >= 3) {
      return "Strong";
    } else if (score === 2) {
      return "Moderate";
    } else if (score === 1) {
      return "Weak";
    } else {
      return "Very Weak";
    }
  };

  // eslint-disable-next-line

  return (
    <Layout title="Register - Ecommer App">
      <div className="form-container-register" style={{ minHeight: "100vh" }}>
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
          <p>
            Password Strength: {getPasswordStrengthText(calculatePasswordStrength(password))}
          </p>
        )}
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
          <button
            type="submit"
            style={{
              backgroundColor: "#ffa502",
              color: "#000",
              borderRadius: "80px",
              fontWeight: "bold",
            }}
            className="btn btn-primary"
          >
            REGISTER
          </button>
          <p>
            Existing User ? &nbsp;
            <Link style={{ textDecoration: "none" }} to="/login">
              Log in
            </Link>
          </p>
          <p>
            <Link to={"/policy"} style={{ textDecoration: "none" }}>
              Terms of Use &nbsp;
            </Link>{" "}
            and &nbsp;
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
