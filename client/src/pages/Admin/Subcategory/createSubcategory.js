import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import AdminMenu from "../../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../../components/Form/CategoryForm";
import Modal from "antd/es/modal";
const CreateSubCategory = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [category, setCategory] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [oldParentCategory, setOldParentCategory] = useState("");
  const [oldSubcategoryName, setOldSubcategoryName] = useState("");
  //open modal
  const openEditModal = (subcategory) => {
    setVisible(true);
    setSelected(subcategory);
    setOldParentCategory(subcategory.parentCategory);
    setOldSubcategoryName(subcategory.name);
    // You can also set these values in your dropdown and input fields
  };
 console.log(subcategories,"sub");
 console.log(category,"cat_id"); 
  //handle Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(category,"cat");
      const data = {
        name: subcategoryName,
        parentCategory: category,
      };
      const response = await axios.post(
        "/api/v1/subcategory/create-sub-category",
        data
      );
     
      if (response.data.success) {
        toast.success(response.data.message);
        getAllSubCategory();
      }
      //here i need to call get all subcategory
      setCategory("");
      setSubcategoryName("");
    } catch (error) {
      toast.error(error);
      console.error("Error:", error);
    }
  };

  //get all cat
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
  //get All subcategory
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
    getAllCategory();
    getAllSubCategory();
  }, []);

  //update subcategory
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/v1/subcategory/update-subcategory/${selected._id}`,
        {
          name: selected.name, // Use the new name from the selected state
          parentCategory: selected.parentCategory, // Use the new parentCategory from the selected state
        }
      );
      if (data?.success) {
        toast.success(`${selected.name} is updated`); // Use the selected.name for the success toast
        setSelected(null);
        setVisible(false);
        getAllSubCategory(); // Update the subcategory list after the update
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  //delete category
  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/subcategory/delete-subcategory/${pId}`
      );
      if(data.success) {
        toast.success(`SubCategory is deleted`);
        getAllSubCategory();
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Somtihing went wrong");
    }
  };
  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container mt-4">
        <div className="row dashboard">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage SubCategory</h1>
            <div className="p-3 w-50">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="categorySelect" className="form-label">
                    Select a category
                  </label>
                  <select
                    id="categorySelect"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="subcategoryInput" className="form-label">
                    Subcategory Name
                  </label>
                  <input
                    type="text"
                    id="subcategoryInput"
                    className="form-control"
                    value={subcategoryName}
                    onChange={(e) => setSubcategoryName(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
            <div className="w-100">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subcategories?.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>
                        <button
                          className="btn btn-primary ms-2"
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(c.name);
                            setSelected(c);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => {
                            handleDelete(c._id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal
              onCancel={() => {
                setVisible(false);
                setUpdatedName(""); // Clear the updatedName when the modal is closed
              }}
              footer={null}
              visible={visible}
            >
              <div className="p-3 w-50">
                {/* Update Form */}
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label htmlFor="editCategorySelect" className="form-label">
                      Select a category
                    </label>
                    <select
                      id="editCategorySelect"
                      className="form-select"
                      value={
                        selected ? selected.parentCategory : oldParentCategory
                      }
                      onChange={(e) =>
                        setSelected({
                          ...selected,
                          parentCategory: e.target.value,
                        })
                      }
                    >
                      <option value="">Select a category</option>
                      {categories?.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="editSubcategoryInput"
                      className="form-label"
                    >
                      Subcategory Name
                    </label>
                    <input
                      type="text"
                      id="editSubcategoryInput"
                      className="form-control"
                      value={selected ? selected.name : oldSubcategoryName}
                      onChange={(e) =>
                        setSelected({ ...selected, name: e.target.value })
                      }
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </form>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateSubCategory;
