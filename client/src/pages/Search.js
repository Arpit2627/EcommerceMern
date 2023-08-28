import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
const Search = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  // eslint-disable-next-line
  const [values, setValues] = useSearch();
  //add to cart
  const addToCart = (product) => {
    const updatedCart = [...cart];
    const existingProduct = updatedCart.find(
      (item) => item._id === product._id
    );

    if (existingProduct) {
      // If the product already exists in the cart, increase the quantity
      existingProduct.customQuantity += 1; // Use a different property name for quantity
    } else {
      // If the product doesn't exist in the cart, add it with quantity 1
      updatedCart.push({ ...product, customQuantity: 1 }); // Use a different property name for quantity
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item Added to cart");
  };
  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center mt-4">
          <h1>Search Results</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length} Products`}
          </h6>
          <div className="row">
            {values?.results.map((p) => (
              <div className="col-md-3 col-sm-12 mb-2 col-6" key={p._id}>
                <div className="card">
                  <div className="d-flex flex-row">
                    <p className="bg-danger rounded w-25 m-1 text-white text-center">
                      {p.discount}% off
                    </p>
                    <h5 className="ms-auto text-secondary px-1">{p.color}</h5>
                  </div>
                  <a
                    href={`/product/${p.slug}`}
                    className="text-dark text-decoration-none"
                  >
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width="250px"
                      height={"250px"}
                    />
                  </a>
                  <div className="card-body">
                    <h5 className="card-title">{p.brand}</h5>
                    <p className="card-text mb-2">{p.name}</p>
                    <div className=" align-items-center">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="card-price">
                          {Math.round(
                            p.price - (p.price * p.discount) / 100
                          ).toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </h6>
                        <s className="text-danger">
                          {p.price.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </s>
                      </div>
                      <div>
                        <button
                          className="btn btn-info me-2"
                          style={{
                            backgroundColor: "#fff200",
                            borderRadius: "80px",
                          }}
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          More Details
                        </button>
                        <button
                          style={{
                            backgroundColor: "#ffa502",
                            color: "#000",
                            borderRadius: "80px",
                          }}
                          className="btn btn-dark"
                          onClick={() => addToCart(p)}
                          id={p._id}
                        >
                          ADD TO CART
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
