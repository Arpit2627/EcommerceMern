import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {createSubCategoryController,GetSubcategoryControlller,GetSubcategoryByCategoryControlller,updateSubCategoryController,deleteSubCategoryCOntroller} from "../controllers/subcategoryController.js";
const router = express.Router();
router.post(
    "/create-sub-category",
    requireSignIn,
    isAdmin,
    createSubCategoryController
);

//get all Subcategory
router.get("/get-sub-category", GetSubcategoryControlller);
router.get("/get-sub-category/:id", GetSubcategoryByCategoryControlller);
//update category
router.put(
    "/update-subcategory/:id",
    requireSignIn,
    isAdmin,
    updateSubCategoryController
);
router.delete(
    "/delete-subcategory/:id",
    requireSignIn,
    isAdmin,
    deleteSubCategoryCOntroller
  );
export default router;
  