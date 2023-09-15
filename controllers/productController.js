import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderRazor from "../models/orderRazor.js";
import fs from "fs";
import slugify from "slugify";
import dotenv from "dotenv";
import { json } from "express";
dotenv.config();




// export const createProductController = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       price,
//       category,
//       quantity,
//       shipping,
//       color,
//       brand,
//       discount,
//     } = req.fields;
//     const { photo } = req.files;
//     //alidation
//     // console.log(photo,"photo");
//     switch (true) {
//       case !name:
//         return res.status(500).send({ error: "Name is Required" });
//       case !description:
//         return res.status(500).send({ error: "Description is Required" });
//       case !price:
//         return res.status(500).send({ error: "Price is Required" });
//       case !category:
//         return res.status(500).send({ error: "Category is Required" });
//       case !quantity:
//         return res.status(500).send({ error: "Quantity is Required" });
//       case !color:
//         return res.status(500).send({ error: "Color is Required" });
//       case !brand:
//         return res.status(500).send({ error: "Brand is Required" });
//       case !discount:
//         return res.status(500).send({ error: "Discount is Required" });
//     }

//     //card
//     if (!photo || photo.length === 0) {
//       return res.status(500).send({ error: "At least one photo is required" });
//     }

//     for (const photo of photo) {
//       if (photo.size > 1000000) {
//         return res.status(500).send({ error: "Each photo should be less than 1MB" });
//       }
//     }
//     if (photo) {
//       products.photo = [];

//       for (const photo of photo) {
//         const photoData = {
//           data: fs.readFileSync(photo.path),
//           contentType: photo.type,
//         };
//         products.photo.push(photoData);
//       }
//     }
//     const products = new productModel({ ...req.fields, slug: slugify(name) });
//     if (photo) {
//       products.photo.data = fs.readFileSync(photo.path);
//       products.photo.contentType = photo.type;
//     }
//     await products.save();
//     res.status(201).send({
//       success: true,
//       message: "Product Created Successfully",
//       products,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in crearing product",
//     });
//   }
// };

//get all products


//create product 
// export const createProductController = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       price,
//       category,
//       quantity,
//       shipping,
//       color,
//       brand,
//       discount,
//     } = req.fields;
//     // console.log(req.fields,"req")
//     // Instead of a single 'photo' field, use 'photos' for an array of photos
//     const  photos  = req.fields.photo;
//     // Validation
//     const requiredFields = ['name', 'description', 'price', 'category', 'quantity', 'color', 'brand', 'discount'];
//     for (const field of requiredFields) {
//       if (!req.fields[field]) {
//         return res.status(500).send({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} is Required` });
//       }
//     }
//     if (!photos || photos.length === 0) {
//       return res.status(500).send({ error: "At least one photo is required" });
//     }
//     if(photos){
//       for (const photo of photos) {
//         if (photo.size > 1000000) {
//           return res.status(500).send({ error: "Each photo should be less than 1MB" });
//         }
//       }
//     }
//     const products = new productModel({ ...req.fields, slug: slugify(name) });
//     // Assuming 'photo' is an array of file objects
//     if (photos) {
//       products.photo = [];
//       for (const photo of photo) {
//         const photoData = {
//           data: fs.readFileSync(photo.path),
//           contentType: photo.type,
//         };
//         products.photo.push(photoData);
//       }
//     }
//     await products.save();
//     res.status(201).send({
//       success: true,
//       message: "Product Created Successfully",
//       products,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in creating product",
//     });
//   }
// };

//create product
export const createProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      color,
      brand,
      discount,
      subcategory
    } = req.fields;
    const photo = Object.values(req.files);
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case !color:
        return res.status(500).send({ error: "Color is Required" });
      case !brand:
        return res.status(500).send({ error: "Brand is Required" });
      case !discount:
        return res.status(500).send({ error: "Discount is Required" });
      case !subcategory:
        return res.status(500).send({ error: "Subcategory is Required" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    // if (photo) {
    //   products.photo.data = fs.readFileSync(photo.path);
    //   products.photo.contentType = photo.type;
    // }
    for (const p of photo) {
      if (p.size > 1000000) {
        return res
          .status(500)
          .send({ error: 'Photo should be less than 1MB' });
      }
      // Read the image file and set it to the product
      const imageBuffer = fs.readFileSync(p.path);
      products.photo.push({ data: imageBuffer, contentType: p.type });
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
};


//get products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};
// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getting single product",
      error,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if(product.photo){
      res.set("Content-type", product.photo[3].contentType)
      return res.status(200).send(product.photo[3].data)
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};
//get all  product photo for productdetails page
// export const productALLPhotoController = async (req, res) => {
//   try {
//     const product = await productModel.findById(req.params.pid).select("photo");
//     if (product.photo && product.photo.length > 0) {
//       const photoArray = product.photo.map((photo) => ({
//         contentType: photo.contentType,
//         data: photo.data,
//       }));
//       console.log(photoArray,"photoarray");
//       res.status(200).send(photoArray);
//     } else {
//       res.status(404).send({
//         success: false,
//         message: "No photos found for the product",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Erorr while getting photo",
//       error,
//     });
//   }
// };
export const productALLPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo && product.photo.length > 0) {
      const photoArray = product.photo.map((photo) => ({
        contentType: photo.contentType,
        data: photo.data.toString('base64'), // Convert Buffer to base64
      }));
      console.log(photoArray, "photoarray");
      res.status(200).send(photoArray);
    } else {
      res.status(404).send({
        success: false,
        message: "No photos found for the product",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photos",
      error,
    });
  }
};


//delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//upate producta
export const updateProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      color,
      brand,
      discount,
    } = req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });

      case !color:
        return res.status(500).send({ error: "Color is Required" });

      case !brand:
        return res.status(500).send({ error: "Brand is Required" });

      case !discount:
        return res.status(500).send({ error: "Discount is Required" });

      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio, radios ,sub} = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (sub.length > 0) args.subcategory = sub;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    if (radios.length) args.discount = { $gte: radios[0], $lte: radios[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
          { color: { $regex: keyword, $options: "i" } },
          { brand: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};
// search order
export const searchOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const results = await orderRazor.findOne({ "razorpay.orderId": orderId });

    if (!results) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in searchOrderController",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get product by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

//get product by subcategory id
export const productSubCategoryController = async(req,res)=>{
  try {
    const {id}=req.params
    console.log(id,"idididididi");
    const products = await productModel.find({ subcategory:id }).populate("category");
    res.status(200).send({
      success: true,
      message:"Successfully get product by subcategory",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products by subcategory",
    });
  }
}  