import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
const Search = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
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
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>
          <div className="row row-cols-1 row-cols-md-3 mt-4">
             {values?.results.map((p) => (
              <div className="card h-80" style={{ width: "18rem" }}>
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p>
                  <div className="card-name-price">
                    <h6 className="card-title card-price">
                      {Math.round((p.price - (p.price * p.discount) / 100)).toLocaleString(
                        "en-IN",
                        {
                          style: "currency",
                          currency: "INR",
                        }
                      )}
                    </h6>
                    <b style={{ color: "#f39c12" }}>{p.discount}% off</b>

                    <s className=" text-danger m-2">
                      {p.price.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </s>
                  </div>
                  <div className="d-grid gap-2">
                      <button
                        className="btn btn-info mt-2"
                        style={{
                          backgroundColor: "#fff200",
                          borderRadius: "50px",
                        }}
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>
                      <button
                        className="btn btn-dark mt-2"
                        style={{
                          backgroundColor: "#ffa502",
                          color: "#000",
                          borderRadius: "50px",
                        }}
                        onClick={() => {
                          addToCart(p);
                        }}
                      >
                        ADD TO CART
                      </button>
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
