import React from "react";

import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";

const Dashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout title={"Dashboard - Ecommerce App"}>
       <div className="container ">
  <div className="row dashboard">
    <div className="col-md-3" style={{ marginTop: "15px" }}>
      <div className="border rounded p-3">
        <UserMenu />
      </div>
    </div>
    <div className="col-md-9">
      <div className="card p-3 rounded" style={{ marginTop: "16px" }}>
        <h5>
          <span style={{ fontWeight: "bold" }}>User Name</span>:{" "}
          {auth?.user?.name}
        </h5>
        <hr />
        <h5>
          <span style={{ fontWeight: "bold" }}>User Email</span>:{" "}
          {auth?.user?.email}
        </h5>
        <hr />
        <h5>
          <span style={{ fontWeight: "bold" }}>User Number</span>:{" "}
          {auth?.user?.phone}
        </h5>
        <hr />
        <h5>
          <span style={{ fontWeight: "bold" }}>User Address</span>:{" "}
          {auth?.user?.address}
        </h5>
      </div>
    </div>
  </div>
</div>
    </Layout>
  );
};

export default Dashboard;
