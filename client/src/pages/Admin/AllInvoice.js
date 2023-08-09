import React, { useState } from "react";
import axios from "axios";
import moment from "moment";

const AllInvoice = () => {
  const [orderId, setOrderId] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedTaxType, setSelectedTaxType] = useState(" ");
  const [selectedTaxRate, setSelectedTaxRate] = useState({});
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

  const handlefilter = (productsArray, products) => {
    return products.filter((product) => productsArray.includes(product._id));
  };
  const handleUser = (userId, userdatabase) => {
    for (let i = 0; i < userdatabase.length; i++) {
      if (userdatabase[i]._id === userId) {
        return [userdatabase[i].name, userdatabase[i].address];
      }
    }
    return null;
  };

  console.log(selectedTaxRate);
  const handleTaxRateChange = (productId, taxRate) => {
    setSelectedTaxRate((prevTaxRates) => ({
      ...prevTaxRates,
      [productId]: taxRate,
    }));
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/v1/product/searchOrder/${orderId}`);
      const data = await response.json();
      const allUsersResponse = await axios.get("/api/v1/auth/all-users");
      const da = allUsersResponse.data;
      const allProducts = await fetch(`/api/v1/product/get-product`);
      const d = await allProducts.json();

      if (data) {
        setFilteredProducts(data.products);
      }
      const userNameFilter = handleUser(data?.buyer, da);
      console.log(userNameFilter);
      data.buyerName = userNameFilter[0];
      data.buyerAddress = userNameFilter[1];

      console.log(data);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
      setSearchResult(null);
    }
  };
  let totalPrice = 0;
  return (
    <div>
      <h5 className="text-center">
        Tax Invoice / Bill of Supply / Cash Memo <br /> (Original for Recipient)
      </h5>
      <div className="text-center">
        <form onSubmit={handleSearch}>
          Order ID :{" "}
          <input
            type="text"
            className="border-0 col-2"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID"
          />
        </form>
      </div>
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
                <td>Invoice No: {generateRandomInvoiceNumber()}</td>
              </tr>
              <tr>
                <td>GST-IN: 132942389</td>
                <td>
                  Order Date :{" "}
                  {moment(searchResult?.createdAt).format("DD-MM-YYYY")}
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
                <td></td>
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
                  <td className="px-5 ">{p.price}</td>
                  <td className="px-5 ">
                    {(
                      p.price * p.customQuantity -
                      ((p.customQuantity * p.price) /
                        (parseFloat(selectedTaxRate[p._id]) + 100)) *
                        parseFloat(selectedTaxRate[p._id])
                    ).toFixed(2)}
                  </td>
                  <td className="px-15">
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
                  <td className="px-40 ">
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
                        <option value="1">(0% SGST + 0% CGST)</option>
                        <option value="3">(1.5% SGST + 1.5% CGST)</option>
                        <option value="5">(2.5% SGST + 2.5% CGST)</option>
                        <option value="18">(9% SGST + 9% CGST)</option>
                        <option value="28">(14% SGST + 14% CGST)</option>
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
                        <option value="1">0%</option>
                        <option value="3">3%</option>
                        <option value="5">5%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    )}
                  </td>

                  <td className="px-5 ">
                    {(
                      ((p.customQuantity * p.price) /
                        (parseFloat(selectedTaxRate[p._id]) + 100)) *
                      parseFloat(selectedTaxRate[p._id])
                    ).toFixed(2)}
                    {console.log(100 + parseFloat(selectedTaxRate[p._id]))}
                  </td>
                  <td className="">{p.customQuantity * p.price}</td>
                </tr>
              ))}
              <tr>
                {filteredProducts?.forEach((p) => {
                  console.log(p);
                  let totalvalue = p.price * p.customQuantity;
                  console.log(totalvalue, "totolValue");
                  console.log(typeof totalvalue, "typeoftotalvalue");
                  totalPrice += totalvalue;
                  console.log(totalPrice, "totalprice");
                })}
              </tr>
            </tbody>
          </table>

          <table className="table table-bordered">
            <tbody>
              <tr>
                <th className="table table-bordered text-end" colSpan="10">
                  Total Price: {totalPrice}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllInvoice;
