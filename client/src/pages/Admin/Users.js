import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";

const Users = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title={"All Orders Data"}>
  <div className="container">
        <div className="row dashboard">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark text-center">
                  <tr>
                    <th scope="col">S. NO.</th>
                    <th scope="col">Order ID</th>
                    <th scope="col">Buyer Name</th>
                    <th scope="col">Payment</th>
                    <th scope="col">Order Date</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {orders?.map((o, i) => (
                    <tr key={o._id}>
                      <td>{i + 1}</td>
                      <td>{o?.razorpay?.orderId}</td>
                      <td>{o?.buyer?.name}</td>
                      <td>{o?.isPaid?.true ? "Failed" : "Success"}</td>
                      <td>{moment(o?.createdAt).format("DD-MM-YYYY")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
