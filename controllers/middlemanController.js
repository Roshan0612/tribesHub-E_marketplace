const TribalUser = require('../models/tribalModel');
const Product = require('../models/productModel');
const path = require('path');

const { default: slugify } = require("slugify");
const fs = require("fs");
const categoryModel = require("../models/categoryModel");
const formidable = require("formidable");
const dotenv = require("dotenv");
dotenv.config();
// Create Tribal User





// Create Tribal User Controller
const { v4: uuidv4 } = require('uuid');  // Import the uuid library



const createTribalUser = async (req, res) => {
  try {
    const { name, photo, location } = req.body;  // Destructure location from the request body
    
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Generate a unique ID for the tribal user
    const uniqueId = uuidv4();  // Generate a unique ID

    // Initialize photo data
    let photoData = { data: null, contentType: null };

    // If there's a base64 encoded image, decode and save it as binary data
    if (photo) {
      const base64Data = photo.replace(/^data:image\/png;base64,/, '');  // Remove the base64 prefix
      photoData.data = Buffer.from(base64Data, 'base64');  // Convert base64 to binary
      photoData.contentType = 'image/png';  // Set the content type (adjust if using other formats)
    }

    // Save the tribal user in the database with a unique ID, photo data, and location
    const newTribalUser = new TribalUser({
      name,
      uniqueId,
      photo: photoData,  // Save photo as binary data
      location,  // Save the location data
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
      res.set("Content-Type", tribalUser.photo.contentType);  // Set correct content type
      return res.status(200).send(tribalUser.photo.data);  // Send the photo as binary
    } else {
      res.status(404).json({ message: "Tribal user photo not found" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error while fetching the tribal user photo",
      message: error.message,
    });
  }
};



  


// Get all Tribal Users
// Get all Tribal Users
const getAllTribalUsers = async (req, res) => {
  try {
    // We need to include photo in the response for displaying on the frontend
    const tribals = await TribalUser.find().select("name photo uniqueId _id");
    res.status(200).json({ tribals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tribal users' });
  }
};


// Create Product for a Tribal User
// Create Product Controller
const createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true; // Retain the file extension

  form.parse(req, (err, fields, files) => {
      if (err) {
          return res.status(500).send({ error: "Error parsing form data." });
      }

      // Access text fields and files after form parsing
      const { name, description, price, category, quantity, tribalId } = fields; // Include tribalId here
      const photo = files.photo; // Uploaded photo file

      // Validation
      if (!name || !description || !price || !category || !quantity || !tribalId) {
          return res.status(400).send({ error: "All fields including tribalId are required" });
      }

      // Create the product for a specific tribal user
      const product = new Product({
          name,
          description,
          price,
          category,
          quantity,
          tribalId,
          slug: slugify(name), // For SEO-friendly URLs
      });

      // If a photo is uploaded, save it as binary data
      if (photo) {
          product.photo.data = fs.readFileSync(photo.path); // Read the uploaded photo as binary
          product.photo.contentType = photo.type; // Set the content type (e.g., image/png)
      }

      // Save the product to the database
      product.save()
          .then(() => {
              res.status(200).send({ success: true, message: "Product created successfully!" });
          })
          .catch(err => {
              console.error(err);
              res.status(500).send({ error: "Failed to create product" });
          });
  });
};


// Get All Products for All Tribals
// Get All Products for All Tribals
// Get All Products for All Tribals
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('tribalId', 'name location')  // Populating both name and location from TribalUser
      .populate('category', 'name')  // If you need category name
      .exec();
      
    // Calculate total cost for each product (price * quantity)
    const productsWithTotalCost = products.map(product => {
      const totalCost = parseFloat(product.price) * product.quantity;
      return {
        ...product.toObject(),
        totalCost,  // Adding total cost to the product object
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
      res.set("Content-Type", product.photo.contentType);  // Set the correct content type
      return res.status(200).send(product.photo.data);  // Send the photo as binary data
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

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if enough quantity is available
    if (product.quantity < soldQuantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    // Reduce the quantity
    product.quantity -= soldQuantity;

    // Increase the sold quantity
    product.sold += soldQuantity;

    // Save the updated product
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

    // Find all products sold by this tribal
    const products = await Product.find({ tribalId })
      .populate('tribalId', 'name')
      .exec();

    let totalAmount = 0;
    let totalQuantitySold = 0;

    // Calculate total money and quantity sold
    products.forEach(product => {
      totalQuantitySold += product.sold;
      totalAmount += product.sold * product.price; // Money earned from the product
    });

    res.status(200).json({
      tribalId,
      totalQuantitySold,
      totalAmount,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tribal product sales data' });
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