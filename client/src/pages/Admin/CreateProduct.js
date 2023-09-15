import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  const [discount, setDiscount] = useState("");
  const [setShipping] = useState("");
  const [photos, setPhotos] = useState([]);
  const [subcategories,setSubCategories]=useState([]);
  const [selectedsubcategory,setSelectedSubCategory]=useState("");
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  //get all category
  console.log(subcategories,"subcategories");
  console.log(category,"cat");
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something wwent wrong in getting catgeory");
    }
  };

  //get all sub category
  const getAllSubCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/subcategory/get-sub-category");
      if (data?.success) {
        console.log(data);
        setSubCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something wwent wrong in getting catgeory");
    }
  };
  useEffect(() => {
    // Filter subcategories based on the selected category
    const filtered = subcategories.filter(subcategory => subcategory.parentCategory == category);
    console.log(filtered,"filtered");
    setFilteredSubcategories(filtered);
  }, [category, subcategories]);

  useEffect(() => {
    getAllCategory();
    getAllSubCategory();
  }, []);
  console.log(selectedsubcategory,"stttt");
  //create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("color", color);
      productData.append("brand", brand);
      productData.append("discount", discount);
      productData.append("subcategory", selectedsubcategory);
      // productData.append("photo", photos);
      productData.append("category", category);
      // console.log(productData,"productData");
      photos?.forEach((p, index) => {
        productData.append(`photo_${index}`, p);
      });
      // console.log(productData,"productData");
      const { data } = axios.post(
        "/api/v1/product/create-product",
        productData
      );
      if (data?.success) {
        toast.error(data?.message);
      } else {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products");
      } 
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container mt-4">
        <div className="row dashboard">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Product</h1>
            <div className="m-1 w-75">
              {/* here we had select tag from antd */}
            <select
              className="form-select mb-3"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              <option value="">Select a category</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className="form-select mb-3"
              value={selectedsubcategory}
              onChange={(e) => {
                setSelectedSubCategory(e.target.value);
              }}
            >
              <option value="">Select a SubCategory</option>
              {filteredSubcategories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

              <div className="mb-3">
              <label className="btn btn-outline-secondary col-md-12">
                {photos.length >0 ? `${photos.length} photos selected` : "Upload Photos"}
                <input
                  type="file"
                  name="photos"
                  accept="image/*"
                  onChange={(e) => setPhotos(Array.from(e.target.files))} // Use setPhotos to store the selected files in the state
                  multiple // Add the 'multiple' attribute to allow multiple file selection
                  hidden
                />
              </label>
              </div>
              <div className="mb-3">
                  {Array.isArray(photos) && photos.length > 0 && photos.map((selectedPhoto, index) => (
                  <div key={index} className="text-center">
                    <img
                      src={URL.createObjectURL(selectedPhoto)}
                      alt={`product_photo_${index}`}
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                ))}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="write a Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="write a quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  value={color}
                  placeholder="write a color"
                  className="form-control"
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  value={brand}
                  placeholder="write a brand"
                  className="form-control"
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  value={discount}
                  placeholder="write a Discount"
                  className="form-control"
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>

              <div className="mb-3">
                 {/* here we had select tag from antd */}
              <select
              className="form-select mb-3"
              // value={shipping}
              onChange={(e) => {
                setShipping(e.target.value);
              }}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleCreate}>
                  CREATE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
