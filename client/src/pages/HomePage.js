import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices.js";
import { Discount } from "../components/Discount.js";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
const HomePage = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [radios, setRadios] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (page === 1) return;
    loadMore();
    // eslint-disable-next-line
  }, [page]);
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  // filter y cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length || !radios.length) getAllProducts();
    // eslint-disable-next-line
  }, [checked.length, radio.length, radios.length]);
  useEffect(() => {
    if (checked.length || radio.length || radios.length) filterProduct();
    // eslint-disable-next-line
  }, [checked, radio, radios]);
  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
        radios,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  //add to cart
  const addToCart = async (product) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = storedCart.findIndex(
      (item) => item._id === product._id
    );
    if (existingProductIndex !== -1) {
      storedCart[existingProductIndex].customQuantity += 1;
    } else {
      storedCart.push({ ...product, customQuantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(storedCart));
    setCart(storedCart);
    toast.success("Item Added to cart");
  };
  return (
    <Layout title={"All Products - Best offers "}>
      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval="1500">
            <img
              src="images/d1.jpg"
              width={"100%"}
              height={"300px"}
              className="d-block w-100"
              alt="..."
            />
          </div>
          <div className="carousel-item" data-bs-interval="1500">
            <img
              src="images/d2.jpg"
              width={"100%"}
              height={"300px"}
              className="d-block w-100"
              alt="..."
            />
          </div>
          <div className="carousel-item" data-bs-interval="1500">
            <img
              src="images/d3.jpg"
              width={"100%"}
              height={"300px"}
              className="d-block w-100"
              alt="..."
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3  filters">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <h4 className="text-center mt-4">Filter By Discount</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadios(e.target.value)}>
              {Discount?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger mt-4"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9  text-center">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-3" key={p._id}>
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
                    width="25%"
                    height="25%"
                    alt={p.name}
                  />
                </a>
                <div className="card-body">
                  <h5 className="card-title">{p.brand}</h5>
                  <div className="card-name-price">
                    <p>{p.name}</p>
                  </div>
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
                      style={{
                        backgroundColor: "#ffa502",
                        color: "#000",
                        borderRadius: "80px",
                      }}
                      className="btn btn-dark ms-1"
                      onClick={() => {
                        addToCart(p);
                      }}
                      id={p._id}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default HomePage;