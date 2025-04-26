const TribalUser = require('../models/tribalModel');
const productModel = require('../models/productModel');
const path = require('path');

const { default: slugify } = require("slugify");
const fs = require("fs");
const categoryModel = require("../models/categoryModel");
const formidable = require("formidable");
const dotenv = require("dotenv");
dotenv.config();


const { v4: uuidv4 } = require('uuid');  // 



const createTribalUser = async (req, res) => {
  try {
    const { name, photo, location } = req.body;  
    
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const uniqueId = uuidv4();  
    let photoData = { data: null, contentType: null };


    
    if (photo) {
      const base64Data = photo.replace(/^data:image\/png;base64,/, ''); 
      photoData.data = Buffer.from(base64Data, 'base64'); 
      photoData.contentType = 'image/png';  
    }

    
    const newTribalUser = new TribalUser({
      name,
      uniqueId,
      photo: photoData,
      location,  
    });

    await newTribalUser.save();

    return res.status(200).json({ message: "Tribal user created successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};




const getTribalUserPhotoController = async (req, res) => {
  try {
    const tribalUser = await TribalUser.findById(req.params.id).select("photo");

    if (tribalUser && tribalUser.photo.data) {
      res.set("Content-Type", tribalUser.photo.contentType);  
      return res.status(200).send(tribalUser.photo.data);  
      res.status(404).json({ message: "Tribal user photo not found" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error while fetching the tribal user photo",
      message: error.message,
    });
  }
};



  




const getAllTribalUsers = async (req, res) => {
  try {
    const tribals = await TribalUser.find().select("name photo uniqueId _id");
    res.status(200).json({ tribals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tribal users' });
  }
};


const createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true; 

  form.parse(req, async (err, fields, files) => {
      if (err) {
          return res.status(500).send({ error: "Error parsing form data." });
      }

      console.log("Received Fields:", fields);
      console.log("Received Files:", files);

      const { name, description, price, category, quantity, tribalId } = fields;
      const photo = files.photo;

      if (!name || !description || !price || !category || !quantity || !tribalId) {
          return res.status(400).send({ error: "All fields including tribalId are required" });
      }

      try {
          const product = new productModel({
              name,
              description,
              price,
              category,
              quantity,
              tribalId,
              slug: slugify(name), 
          });

          if (photo) {
              const photoPath = photo.filepath || photo.path;
              product.photo.data = fs.readFileSync(photoPath);
              product.photo.contentType = photo.mimetype || photo.type;
              console.log("Photo processed successfully");
          }

          await product.save();
          res.status(200).send({ success: true, message: "Product created successfully!" });
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: "Failed to create product" });
      }
  });
};





const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find()
      .populate('tribalId', 'name location')  
      .populate('category', 'name')  
      .exec();
      
    
    const productsWithTotalCost = products.map(product => {
      const totalCost = parseFloat(product.price) * product.quantity;
      return {
        ...product.toObject(),
        totalCost,  
      };
    });
    
    res.status(200).json({ products: productsWithTotalCost });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};


const getProductPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    
    if (product && product.photo.data) {
      res.set("Content-Type", product.photo.contentType);  
      return res.status(200).send(product.photo.data);  
    } else {
      return res.status(404).json({ message: "Product photo not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error while fetching product photo",
      message: error.message,
    });
  }
};
const updateProductQuantity = async (req, res) => {
  try {
    const { productId, soldQuantity } = req.body;

    
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

   
    if (product.quantity < soldQuantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    
    product.quantity -= soldQuantity;

   
    product.sold += soldQuantity;

    
    await product.save();

    res.status(200).json({
      message: 'Product quantity updated and sale recorded',
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product quantity' });
  }
};
const getTribalProductSales = async (req, res) => {
  try {
      const { tribalId } = req.params;

   
      const products = await productModel.find({ tribalId });

      if (!products || products.length === 0) {
          return res.status(404).send({ message: "No products found for this tribal user" });
      }

      let totalQuantitySold = 0;
      let totalAmount = 0;
      let totalCost = 0;

      products.forEach(product => {
          totalQuantitySold += product.sold;
          totalAmount += product.sold * product.price;
          totalCost += product.sold * (product.totalCost || 0);
      });

      res.status(200).send({
          tribalId,
          totalQuantitySold,
          totalAmount,
          totalCost,
          products
      });
  } catch (error) {
      console.error("Error fetching tribal sales data:", error);
      res.status(500).send({ message: "Error fetching tribal sales data" });
  }
};


module.exports={
  
    createTribalUser,
    getTribalUserPhotoController,
    getProductPhotoController,
    getAllTribalUsers,
    createProduct,
    getAllProducts,
    updateProductQuantity ,
    getTribalProductSales,
}