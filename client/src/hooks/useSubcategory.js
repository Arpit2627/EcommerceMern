import { useState, useEffect } from "react";
import axios from "axios";

export default function useCategory() {
  const [subcategories, setSubCategories] = useState([]);
  
  //get cat
  const getCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/subcategory/get-sub-category/:id");
      setSubCategories(data?.category);
    } catch (error) {
      console.log(error);
    }
  };
 
  useEffect(() => {
    getCategories();
  }, []);

  return subcategories;
}
