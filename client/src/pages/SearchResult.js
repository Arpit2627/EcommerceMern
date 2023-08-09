import React from "react";
import { useLocation } from "react-router-dom";

const SearchResultPage = () => {
  const location = useLocation();
  const searchResult = location.state && location.state.searchResult;

  // Function to calculate the total price based on filtered products
  const calculateTotalPrice = (filtered) => {
    return filtered.reduce((total, product) => total + product.price, 0);
  };

  return (
    <div>
      <h2>Search Result</h2>
      {searchResult && searchResult.products.length > 0 ? (
        <div>
          <table className="table table-bordered">
            <thead>
              <tr>
                {/* Table headers */}
                <th>S.no</th>
                <th>Order no</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Rate/Unit</th>
                <th>Taxable Value</th>
                <th>Tax Type (CGST/SGST/IGST)</th>
                <th>Tax Rate</th>
                <th>Tax Amount</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {searchResult.products.map((p, index) => (
                <tr key={p._id}>
                  <td>{index + 1}</td>
                  <td>{searchResult.razorpay.orderId}</td>
                  <td>{p.name}</td>
                  <td>{searchResult.products.length}</td>
                  <td>{p.price}</td>
                  <td>-------</td>
                  <td>IGST</td>
                  <td>18%</td>
                  <td>-------</td>
                  <td>{p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Total Price: {calculateTotalPrice(searchResult.products)}</p>
        </div>
      ) : (
        <p>No search results found.</p>
      )}
    </div>
  );
};

export default SearchResultPage;
