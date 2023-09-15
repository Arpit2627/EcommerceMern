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
  const [productphotos, setProductPhotos] = useState([]);
  //initalp details
  useEffect(() => {
    if (params?.slug) getProduct();
    // eslint-disable-next-line
  }, [params?.slug]);

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
  const getProductAllPhoto = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-allphoto/${product._id}`
      );
      console.log(data, "apicalled data");
      if (data) {
        setProductPhotos(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProductAllPhoto();
  }, [product?._id]);
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
  // console.log(productphotos, "buffer");
  function changeMainImage(photo) {
    const mainImage = document.getElementById("mainImage");
    mainImage.src = `data:${photo.contentType};base64,${photo?.data}`;
  }
  return (
    <Layout>
      <div className="container mt-4">
        <div className="row product-details">
          {/* <div className="col-md-6">
            <div className="row">
              <div className="col-md-12 text-center">
                <img
                  src={`data:${productphotos[0]?.contentType};base64,${productphotos[0]?.data}`}
                  className="img-fluid main-image"
                  alt="Main Product"
                />
              </div>
            </div>
            <div className="row">
              {productphotos.slice(1).map((photo, index) => (
                <div className="col-2  justify-content-center" key={index}>
                  <div className="d-flex justify-content-center align-items-center smaller-image-container">
                    <img
                      src={`data:${photo.contentType};base64,${photo?.data}`}
                      alt={`Product ${index + 1}`}
                      className="img-fluid border border-primary smaller-image"
                      style={{
                        width: "450px", // Set your desired width here
                        height: "100px", // Set your desired height here
                      }}

                    />
                  </div>
                </div>
              ))}
            </div>
          </div> */}
          {/* <div className="col-md-6">
            <div className="row">
              <div className="col-md-12 text-center">
                <img
                  src={`data:${productphotos[0]?.contentType};base64,${productphotos[0]?.data}`}
                  className="img-fluid main-image"
                  alt="Main Product"
                  id="mainImage"
                />
              </div>
            </div>
            <div className="row">
              {productphotos.map((photo, index) => (
                <div
                  className="col-2 justify-content-center"
                  key={index}
                  onClick={() => changeMainImage(photo)}
                >
                  <div className="d-flex justify-content-center align-items-center smaller-image-container">
                    <img
                      src={`data:${photo.contentType};base64,${photo?.data}`}
                      alt={`Product ${index + 1}`}
                      className="img-fluid border border-primary smaller-image"
                      style={{
                        width: "450px",
                        height: "100px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div> */}
           <div className="col-md-6">
           <div className="row">
           <div className="col-md-12 text-center">
              <div className="image-container square-container">
                <img
                  src={`data:${productphotos[0]?.contentType};base64,${productphotos[0]?.data}`}
                  className="img-fluid main-image square-image"
                  alt="Main Product"
                  id="mainImage"
                />
              </div>
            </div>
          </div>
            <div className="row">
              {productphotos.map((photo, index) => (
                <div
                  className="col-2 justify-content-center"
                  key={index}
                  onClick={() => changeMainImage(photo)}
                >
                  <div className="d-flex justify-content-center align-items-center smaller-image-container">
                    <img
                      src={`data:${photo.contentType};base64,${photo?.data}`}
                      alt={`Product ${index + 1}`}
                      className="img-fluid  smaller-image"
                      style={{
                        width: "450px",
                        height: "100px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* here here here */}
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
              style={{
                backgroundColor: "#ffa502",
                color: "#000",
                borderRadius: "80px",
                fontWeight: "bold",
              }}
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
                  <div className="d-flex flex-row">
                    <p className="bg-danger rounded w-25 m-1 text-white text-center">
                      {p.discount}% off
                    </p>
                    <h5 className="ms-auto text-secondary px-1">{p.color}</h5>
                  </div>
                  <a href={`/product/${p.slug}`}>
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                  </a>
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
