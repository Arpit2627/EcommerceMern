import React from "react";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { NavLink } from "react-router-dom";
const UserMenu = () => {
  const [auth] = useAuth();
  const [cart] = useCart();
  return (
    <div>
    <div className="text-center dashboard-menu ">
      <div className="list-group m-4 ">
      <h4 className="bg-primary">Dashboard</h4>

        <NavLink
          to="/dashboard/user/profile"
          className="list-group-item list-group-item-action"
        >
          Profile
        </NavLink>
        <NavLink
          to="/dashboard/user/orders"
          className="list-group-item list-group-item-action"
        >
          Orders
        </NavLink>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
