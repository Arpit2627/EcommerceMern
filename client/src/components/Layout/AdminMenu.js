import React from "react";
import { NavLink } from "react-router-dom";
const AdminMenu = () => {
  return (
    <div className="container mt-4">
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="text-center">
        <h3 className="admin-header bg-warning text-white p-3">Admin Panel</h3>
          
          <div className="list-group dashboard-menu">
            <NavLink
              to="/dashboard/admin/create-category"
              className="list-group-item list-group-item-action"
            >
              Create Category
            </NavLink>
            <NavLink
              to="/dashboard/admin/create-subcategory"
              className="list-group-item list-group-item-action"
            >
              Create SubCategory
            </NavLink>
            <NavLink
              to="/dashboard/admin/create-product"
              className="list-group-item list-group-item-action"
            >
              Create Product
            </NavLink>
            <NavLink
              to="/dashboard/admin/products"
              className="list-group-item list-group-item-action"
            >
              Products
            </NavLink>
            <NavLink
              to="/dashboard/admin/orders"
              className="list-group-item list-group-item-action"
            >
              Orders
            </NavLink>           
            <NavLink
              to="/dashboard/admin/users"
              className="list-group-item list-group-item-action"
            >
            Order History 
            </NavLink>
            <NavLink
              to="/dashboard/admin/reports"
              className="list-group-item list-group-item-action"
            >
              SalesReport
            </NavLink>
            <NavLink
              to="/dashboard/admin/searchInvoice"
              className="list-group-item list-group-item-action"
            >
              SearchInvoice
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default AdminMenu;
