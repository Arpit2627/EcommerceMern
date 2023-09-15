import Subcategorymodel from '../models/subcategorymodel.js';
import slugify from 'slugify';

export const createSubCategoryController = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;
    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }
    if (!parentCategory) {
      return res.status(400).send({ message: "Parent Category is required" });
    }
    const existingCategory = await Subcategorymodel.findOne({ name });
    if (existingCategory) {
      return res.status(201).send({
        success: true,
        message: "Sub Category Already Exists",
      });
    }
    const subCategory = await new Subcategorymodel({
      name,
      slug: slugify(name),
      parentCategory,
    }).save();
    res.status(200).send({
      success: true,
      message: "New Subcategory created",
      subCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating Subcategory",
    });
  }
};

//getall category
export const GetSubcategoryControlller = async (req, res) => {
    try {
      const category = await Subcategorymodel.find({});
      res.status(200).send({
        success: true,
        message: "All Categories List",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while getting all Subcategories",
      });
    }
};

//update subcategory
export const updateSubCategoryController = async (req, res) => {
    try {
      const { name, parentCategory } = req.body;
      const { id } = req.params;
  
      // Validate the input data
      if (!name || !parentCategory) {
        return res.status(400).send({ message: "Name and Parent Category are required" });
      }
  
      // Check if the category with the given id exists
      const existingCategory = await Subcategorymodel.findById(id);
  
      if (!existingCategory) {
        return res.status(201).send({
          success: true,
          message: "Subcategory not found",
        });
      }
  
      // Update the subcategory
      existingCategory.name = name;
      existingCategory.slug = slugify(name);
      existingCategory.parentCategory = parentCategory;
  
      const updatedCategory = await existingCategory.save();
  
      res.status(200).send({
        success: true,
        message: "Subcategory Updated Successfully",
        category: updatedCategory,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while updating Subcategory",
      });
    }
  };

//dlt subcategory
export const deleteSubCategoryCOntroller = async (req, res) => {
    try {
      const { id } = req.params;
      await Subcategorymodel.findByIdAndDelete(id);
      res.status(200).send({
        success: true,
        message: "Categry Deleted Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "error while deleting category",
        error,
      });
    }
  };  

//get sub category by parent category id
export const GetSubcategoryByCategoryControlller = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id,"idididid");
   const data= await Subcategorymodel.find({ parentCategory:id });
    res.status(200).send({
      success: true,
      message: "Subcategory based on category fetched Successfully",
      data
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while sub category based on category",
      error,
    });
  }
};  