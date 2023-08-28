import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import { FaFileInvoiceDollar } from "react-icons/fa";
const Users = () => {
  let [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  // eslint-disable-next-line
  const [auth, setAuth] = useAuth();
  const [startDate, setStartDate] = useState(""); 
  const [endDate, setEndDate] = useState(""); 
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
  useEffect(() => {
    const filtered = orders.filter((o) =>
      moment(o.createdAt).isBetween(startDate, endDate, null, "[]")
    );
    setFilteredOrders(filtered);
  }, [startDate, endDate, orders]);
  const totalAmount = filteredOrders.reduce((total, o) => total + o.amount, 0);
  return (
    <Layout title={"All Orders Data"}>
      <div className="container">
        <div className="row dashboard">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            <div className="date-range d-flex justify-content-between m-2">
              <div>
                <label className="p-1">Start Date : </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="p-1">End Date : </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark text-center">
                  <tr>
                    <th scope="col">S. NO.</th>
                    <th scope="col">Order ID</th>
                    <th scope="col">Buyer Name</th>
                    <th scope="col">Payment</th>
                    <th scope="col">Payment mode</th>
                    <th scope="col">Total Amount</th>
                    <th scope="col">Order Date</th>
                    <th scope="col">Invoice</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {filteredOrders.map((o, i) => (
                    <tr key={o._id}>
                      <td>{i + 1}</td>
                      <td>{o?.razorpay?.orderId}</td>
                      <td>{o?.buyer?.name}</td>
                      <td>{o?.isPaid?.true ? "Failed" : "Success"}</td>
                      <td>{o?.paymentMode ? "Online" : "Cash"}</td>
                      <td>{Math.round(o.amount)}</td>
                      <td>{moment(o.createdAt).format("DD-MM-YYYY")}</td>
                      <td className="text-center">
                        {" "}
                        <Link
                          to={`/dashboard/admin/allInvoice?orderId=${o?.razorpay?.orderId}`} // Pass the order ID to the function
                        >
                          <FaFileInvoiceDollar />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="fw-bold fs-2">
              Total Amount for Selected Date Range: {totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Users;
