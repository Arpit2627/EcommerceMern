import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CategoryProductStyles.css";
import axios from "axios";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
    // eslint-disable-next-line
  }, [params?.slug]);
  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
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
      <div className="container mt-3 category">
        <h4 className="text-center">Category - {category?.name}</h4>
        <h6 className="text-center">{products?.length} result found </h6>
        <div className="row">
          <div className="col-md-9 offset-1">
            <div className="d-flex flex-wrap">
              {products?.map((p) => (
                <div className="card m-2" key={p._id}>
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
                    <p className="card-text">
                      {p.description.substring(0, 30)}...
                    </p>
                    <div className="card-name-price">
                      <h6 className="card-title card-price">
                        {Math.round(
                          p.price - (p.price * p.discount) / 100
                        ).toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </h6>
                      <s className=" text-danger m-2">
                        {p.price.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </s>
                    </div>
                    <div className="card-name-price">
                      <button
                        className="btn btn-info ms-1"
                        style={{
                          backgroundColor: "#fff200",
                          borderRadius: "80px",
                        }}
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>
                      <button
                        className="btn btn-dark ms-1"
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
