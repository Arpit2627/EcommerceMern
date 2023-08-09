import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import "../styles/ProductDetailsStyle.css";

import toast from "react-hot-toast";
const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  //initalp details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);
  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };
  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
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
    <Layout>
      <div className="container mt-4">
        <div className="row product-details">
          <div className="col-md-6 text-center">
            <img
              src={`/api/v1/product/product-photo/${product._id}`}
              className="card-img-top"
              alt={product.name}
              style={{ marginTop: "100px", height: "400px", width:"300px"}}
            />
          </div>
          <div className="col-md-6 product-details-info">
            <h1 className="text-center">Product Details</h1>
            <hr />
            <h5>Brand: {product?.brand}</h5>
            <h6>Name: {product.name}</h6>
            <h6>Description: {product.description}</h6>
            <h6 className="card-title card-price">
              Price:{" "}
              {Math.round(
                product.price - (product.price * product.discount) / 100
              ).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </h6>
            <h6>
              Discount:{" "}
              <b style={{ color: "#f39c12" }}>{product.discount}% off</b>
            </h6>
            <h6>
              MRP: <s className="text-danger">₹{product.price}</s>
            </h6>
            <h6>Category: {product?.category?.name}</h6>
            <h6>Color: {product?.color}</h6>
            <h6>Available quantity: {product?.quantity}</h6>
            <button
              className="btn btn-dark mt-3"
              style={{backgroundColor:'#ffa502',color:'#000',borderRadius:'80px',fontWeight:'bold'}}
              onClick={() => {
                addToCart(product);
              }}
            >
              ADD TO CART
            </button>
          </div>
        </div>
        <hr />
        <div className="row similar-products">
          <h4>Similar Products ➡️</h4>
          {relatedProducts.length < 1 && (
            <p className="text-center">No Similar Products found</p>
          )}
          <div className="d-flex flex-wrap">
            {relatedProducts?.map((p) => (
              <div key={p._id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <div className="card-name-price">
                      <h6 className="card-title card-price">
                        {Math.round(
                          p.price - (p.price * p.discount) / 100
                        ).toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </h6>
                      <b style={{ color: "#f39c12" }}>{p.discount}% off</b>
                      <s className="text-danger">
                        {p.price.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </s>
                    </div>
                    <p className="card-text">
                      {p.description.substring(0, 60)}...
                    </p>
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
                          borderRadius: "80px",
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
