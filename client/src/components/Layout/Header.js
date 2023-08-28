import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import axios from "axios";
// import { ShoppingCartOutlined } from "@ant-design/icons";
import {AiOutlineShoppingCart} from "react-icons/ai"
const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const _id = auth?.user?._id;

  const handleLogout = async () => {
    try {
      console.log("logout called");
      console.log(cart);
      const response = await axios.post("/api/v1/cart/user/cart/add-cart", {
        user: _id,
        cartItems: cart,
      });

      if (response.data.success) {
        console.log("API call succeeded");
      } else {
        console.log("API call failed");
      }

      setAuth({
        ...auth,
        user: null,
        token: "",
      });

      localStorage.clear();

      window.location.reload();

      toast.success("Logout Successfully");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: '#e3dae7' }}>
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img
            src="/images/c_logo.png"
            style={{ width: "45px", height: "45px", backgroundColor: '#000', borderRadius: '100px', marginRight: '5px' }}
            alt="MANASVI ECOMMERCE"
          />
          MANASVI E-COMMERCE
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>

            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                style={{ color: "#2d3436" }}
                to={"/categories"}
                data-bs-toggle="dropdown"
              >
                Categories
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to={"/categories"}>
                    All Categories
                  </Link>
                </li>
                {categories?.map((c) => (
                  <li key={c.slug}>
                    <Link className="dropdown-item" to={`/category/${c.slug}`}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          <SearchInput />

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {!auth?.user ? (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item dropdown">
                  <NavLink
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    style={{ border: "none" }}
                  >
                    {auth?.user?.name}
                  </NavLink>
                  <ul className="dropdown-menu">
                    <li>
                      <NavLink
                        to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                        className="dropdown-item"
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={handleLogout}
                        to="/login"
                        className="dropdown-item"
                      >
                        Logout
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </>
            )}
            <li className="nav-item p-1">
              <div style={{ position: 'relative' }}>
                <Link
                  to="/cart"
                  className="nav-link"
                  style={{ color: "#2d3436" }}
                >
                  <AiOutlineShoppingCart className="fs-4 text-primary" />
                </Link>
                <span
                  className="badge"
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: "#ff5733",
                    color: "#fff",
                    borderRadius: "50%",
                    padding: "5px 10px",
                    fontSize: "14px",
                  }}
                >
                  {cart?.length}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;