import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import { Link } from "react-router-dom";
import { FaFileInvoiceDollar } from "react-icons/fa";

const AdminOrders = () => {
  const [status] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "deliverd",
    "cancel",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth(); // Assuming useAuth returns auth object with token

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

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"All Orders Data"}>
      <div className="container mt-4">
        <div className="row dashboard">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center mb-4">All Orders</h1>
            {orders?.map((o, i) => (
              <div className="border shadow mb-4 p-4" key={o._id}>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                      <tr className="text-center">
                        <th scope="col">S. No.</th>
                        <th scope="col">Order ID</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Payment Mode</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-center">{i + 1}</td>
                        <td className="text-center">{o?.razorpay?.orderId}</td>
                        {/* <td className="text-center">
                          <Select
                            bordered={false}
                            onChange={(value) => handleChange(o._id, value)}
                            defaultValue={o?.status}
                          >
                            {status.map((s, index) => (
                              <Option key={index} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td> */}

                        {/* style krna hai yha pr */}
                         <td className="text-center">
                          <select
                            onChange={(e) => handleChange(o._id, e.target.value)}
                            value={o?.status}
                          >
                            {status.map((s, index) => (
                              <option key={index} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                         </td>
                        <td className="text-center">{o?.buyer?.name}</td>
                        <td className="text-center">
                          {new Date(o?.createdAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                          })}
                        </td>
                        <td className="text-center">
                          {o?.isPaid?.true ? "Failed" : "Success"}
                        </td>
                        <td className="text-center">
                          {o?.paymentMode ? "Online" : "Cash"}
                        </td>
                        <td className="text-center">{o?.products?.length}</td>
                        <td className="text-center">
                          {" "}
                          <Link
                            to={`/dashboard/admin/allInvoice?orderId=${o?.razorpay?.orderId}`} // Pass the order ID to the function
                          >
                            {console.log("called__hello__hello")}
                            <FaFileInvoiceDollar />
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="container">
                  {o?.products?.map((p, j) => (
                    <div className="row mb-2 p-3 card flex-row" key={p._id}>
                      <div className="col-md-2 col-3 p-1">
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          className="card-img-top"
                          alt={p.name}
                          width="100px"
                          height={"100px"}
                        />
                      </div>
                      <div className="col-md-8">
                        <p>{p.name}</p>
                        <p>{p.description.substring(0, 30)}</p>
                        <p>
                          Price:{" "}
                          {Math.round(
                            p.price - (p.price * p.discount) / 100
                          ).toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </p>
                        <p>Quantity: {p.customQuantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
