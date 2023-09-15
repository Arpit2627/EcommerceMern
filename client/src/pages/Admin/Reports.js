import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [data, setData] = useState([]);

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
    let startDate;
    let endDate = new Date();
  
    switch (dateRange) {
      case "Today":
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case "Yesterday":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "Last 24 Hours":
        startDate = new Date();
        startDate.setHours(startDate.getHours() - 24);
        break;
      case "Last 7 Days":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "Last 30 Days":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "Last Year":
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        // Default to the last 7 days
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
    }
  
    // Filter orders based on selected date range
    const filtered = orders.filter((o) =>
      new Date(o.createdAt) >= startDate && new Date(o.createdAt) <= endDate
    );
  
    // Group orders by date and calculate total revenue for each day
    const groupedData = filtered.reduce((result, order) => {
      const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
      const existingEntry = result.find((entry) => entry.date === orderDate);
  
      if (existingEntry) {
        existingEntry.amount += order.amount;
      } else {
        result.push({
          date: orderDate,
          amount: order.amount,
        });
      }
  
      return result;
    }, []);
  
    setData(groupedData);
  }, [dateRange, orders]);
  
  return (
    <Layout title={"All Sales Reports"}>
      <div className="container">
        <div className="row dashboard">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">Sales Reports in histogram</h1>
            <div className="date-range p-3">
              <label>Select Date Range: </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option>Today</option>
                <option>Yesterday</option>
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="chart-container">
              <BarChart width={1000} height={400} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="rgba(75, 192, 192, 0.6)" />
              </BarChart>
            </div>
            <h1 className="text-center">Sales Reports in Line</h1>
            <div className="chart-container">
              <LineChart width={1000} height={400} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="amount" stroke="rgba(75, 192, 192, 0.6)" />
              </LineChart>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
