import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/auth";

const AllInvoice = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderIdFromUrl = queryParams.get("orderId");
  const [searchResult, setSearchResult] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedTaxType, setSelectedTaxType] = useState(" ");
  const [selectedTaxRate, setSelectedTaxRate] = useState({});
  const [orderIdInput, setOrderIdInput] = useState(orderIdFromUrl || ""); // Set the default value from the URL or an empty string
  const [printButtonVisible, setPrintButtonVisible] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [auth] = useAuth();
  const [invoiceNumber, setInvoiceNumber] = useState("");

  // Generate the invoice number when the component mounts
  useEffect(() => {
    const generatedInvoiceNumber = generateRandomInvoiceNumber();
    setInvoiceNumber(generatedInvoiceNumber);
  }, []); // Empty dependency array ensures this effect runs only once, on mount
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
    if (orderIdInput !== "") {
      // Ensure that orderIdInput is not empty before filtering
      const filtered = orders.filter(
        (o) => o?.razorpay?.orderId === orderIdInput
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders([]); // If orderIdInput is empty, clear the filteredOrders
    }
  }, [orderIdInput, orders]);

  const generateRandomInvoiceNumber = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = 8;
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };
  const handlePrint = () => {
    setPrintButtonVisible(false);
    window.print();
  };
  // const handlefilter = (productsArray, products) => {
  //   return products.filter((product) => productsArray.includes(product._id));
  // };
  const handleUser = (userId, userdatabase) => {
    for (let i = 0; i < userdatabase.length; i++) {
      if (userdatabase[i]._id === userId) {
        return [userdatabase[i].name, userdatabase[i].address];
      }
    }
    return null;
  };

  const handleTaxRateChange = (productId, taxRate) => {
    setSelectedTaxRate((prevTaxRates) => ({
      ...prevTaxRates,
      [productId]: taxRate,
    }));
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/v1/product/searchOrder/${orderIdInput}`
      );
      const data = await response.json();
      const allUsersResponse = await axios.get("/api/v1/auth/all-users");
      const da = allUsersResponse.data;
      const allProducts = await fetch(`/api/v1/product/get-product`);
      await allProducts.json();

      if (data) {
        setFilteredProducts(data.products);
      }
      const userNameFilter = handleUser(data?.buyer, da);
      data.buyerName = userNameFilter[0];
      data.buyerAddress = userNameFilter[1];

      setSearchResult(data);
    } catch (error) {
      console.log(error);
      setSearchResult(null);
    }
  };
  useEffect(() => {
    if (orderIdInput) {
      handleSearch();
    }
  });

  useEffect(() => {
    const handleBeforePrint = () => {
      const printButton = document.getElementById("printButton");
      if (printButton) {
        printButton.style.display = "none";
      }
    };

    const handleAfterPrint = () => {
      const printButton = document.getElementById("printButton");
      if (printButton) {
        printButton.style.display = "block";
      }
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  let totalProductQuantity = 0;
  // const invoiceNumber = generateRandomInvoiceNumber();

  filteredProducts.forEach((p) => {
    totalProductQuantity += p.customQuantity;
  });

  let totalPrice = 0;
  return (
    <div>
      <h5 className="text-center">
        Tax Invoice / Bill of Supply / Cash Memo <br /> (Original for Recipient)
      </h5>

      {searchResult && (
        <div>
          <table className="table table-bordered table-responsive-xl table-responsive-sm table-responsive-lg table-responsive-md table-responsive-xl">
            <tbody>
              <tr>
                <td>Sold By: Manasvi technologies (opc) pvt. ltd.</td>
                <td>Billing To: {searchResult?.buyerName}</td>
              </tr>
              <tr>
                <td>Address: ABC Private Limited</td>
                <td>Shipping to: {searchResult?.buyerAddress}</td>
              </tr>
              <tr>
                <td>Pan no.: bjhhh2944</td>
                <td>Invoice No: {invoiceNumber}</td>
              </tr>
              <tr>
                <td>GST-IN: 132942389</td>
                <td>
                  Order Date :{" "}
                  {searchResult?.createdAt && (
                  <>{new Date(searchResult.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  })}</>
                )}
                </td>
              </tr>
              <tr>
                <td>
                  Select State :{" "}
                  <select
                    className="border-1"
                    value={selectedTaxType}
                    onChange={(e) => setSelectedTaxType(e.target.value)}
                  >
                    <option>Inter-State</option>
                    <option>Intra-State</option>
                  </select>
                </td>
                <td>
                  <form>
                    Order ID :{" "}
                    <input
                      type="text"
                      className="border-0 col-5"
                      value={orderIdInput}
                      onChange={(e) => setOrderIdInput(e.target.value)}
                      placeholder="Enter Order ID"
                    />
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {searchResult && (
        <div>
          <h2>Search Result</h2>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="">S.no</th>
                <th className="">Product Name</th>
                <th className="">Qty</th>
                <th className="">Rate/Unit</th>
                <th className="">Taxable Value</th>
                <th className="">
                  Tax Type
                  <br />
                  (CGST/SGST/IGST)
                </th>
                <th className="">Tax Rate</th>
                <th className="">Tax Amount</th>
                <th className="">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, j) => (
                <tr key={j}>
                  <td className="px-2 ">{j + 1}</td>
                  <td className="px-3 col-2 ">{p.name}</td>
                  <td className="px-2 ">{p.customQuantity}</td>
                  <td className="px-5 ">
                    {" "}
                    {Math.round(p.price - (p.price * p.discount) / 100)}
                  </td>
                  <td className=" col-1">
                    {(
                      Math.round(p.price - (p.price * p.discount) / 100) *
                        p.customQuantity -
                      ((p.customQuantity *
                        Math.round(p.price - (p.price * p.discount) / 100)) /
                        (parseFloat(selectedTaxRate[p._id]) + 100)) *
                        parseFloat(selectedTaxRate[p._id])
                    ).toFixed(2)}
                  </td>

                  <td className="px-15 col-1">
                    {selectedTaxType === "Intra-State" ? (
                      <>
                        <p>SGST/CGST</p>
                      </>
                    ) : (
                      <>
                        <p>IGST</p>
                      </>
                    )}
                    <br />
                  </td>
                  <td className=" col-3">
                    {selectedTaxType === "Intra-State" ? (
                      <select
                        key={p._id}
                        className="form-select"
                        style={{ appearance: "none", paddingRight: "1rem" }}
                        onChange={(e) => {
                          const selectedTaxRate = e.target.value;
                          handleTaxRateChange(p._id, selectedTaxRate);
                        }}
                      >
                        <option>Select tax rate</option>
                        <option value="0">0%SGST + 0%CGST</option>
                        <option value="3">1.5%SGST + 1.5%CGST</option>
                        <option value="5">2.5%SGST + 2.5%CGST</option>
                        <option value="18">9%SGST + 9%CGST</option>
                        <option value="28">14%SGST + 14%CGST</option>
                        <option value="0">Exempted</option>
                        <option value="0">Nil Rate</option>
                      </select>
                    ) : (
                      <select
                        key={p._id}
                        className="form-select"
                        style={{ appearance: "none", paddingRight: "1rem" }}
                        onChange={(e) => {
                          const selectedTaxRate = e.target.value;
                          handleTaxRateChange(p._id, selectedTaxRate);
                        }}
                      >
                        <option>Select tax rate</option>
                        <option value="0">0%</option>
                        <option value="3">3%</option>
                        <option value="5">5%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                        <option value="0">Exempted</option>
                        <option value="0">Nil Rate</option>
                      </select>
                    )}
                  </td>

                  <td className="px-4">
                    {selectedTaxRate[p._id] === "0"
                      ? 0
                      : (
                          ((p.customQuantity *
                            Math.round(
                              p.price - (p.price * p.discount) / 100
                            )) /
                            (parseFloat(selectedTaxRate[p._id]) + 100)) *
                          parseFloat(selectedTaxRate[p._id])
                        ).toFixed(2)}
                  </td>
                  <td className="px-3">
                    {p.customQuantity *
                      Math.round(p.price - (p.price * p.discount) / 100)}
                  </td>
                </tr>
              ))}
              <tr>
                {filteredProducts?.forEach((p) => {
                 
                  let totalvalue =
                    Math.round(p.price - (p.price * p.discount) / 100) *
                    p.customQuantity;
                 
                  totalPrice += totalvalue;
                  
                })}
              </tr>
            </tbody>
          </table>

          <table className="table table-bordered">
            <tbody>
              <tr>
                <th className="" colSpan="6">
                  Total Product Quantity: {totalProductQuantity}
                </th>
                <th className="text-end" colSpan="6">
                  Total Price:{" "}
                  {totalPrice.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </th>
              </tr>
              <tr className="">
                <th className="" colSpan="6">
                  delivery charges :{" "}
                  {filteredOrders?.map((o, i) =>
                    (Math.round(o?.amount) - totalPrice).toLocaleString(
                      "en-IN",
                      {
                        style: "currency",
                        currency: "INR",
                      }
                    )
                  )}
                </th>
                <th className="text-end" colSpan="6">
                  Total Payable amount:{" "}
                  {filteredOrders?.map((o, i) =>
                    Math.round(o?.amount).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })
                  )}
                </th>
              </tr>
            </tbody>
          </table>
          <div
            className={`text-center mt-3 ${printButtonVisible ? "" : "d-none"}`}
          >
            <button
              id="printButton"
              className="btn btn-primary"
              onClick={handlePrint}
            >
              Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllInvoice;
