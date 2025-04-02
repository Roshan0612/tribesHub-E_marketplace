const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const middlemanController = require('../controllers/middlemanController');
const {
  createTribalUser,
  getAllTribalUsers,
  createProduct,
  getAllProducts,
  getTribalUserPhotoController,
  updateProductQuantity,
  getTribalProductSales
  
} = require("../controllers/middlemanController");
const { isMiddleman } = require('../middlewares/authmiddleware');
const router = express.Router();


router.post('/create-tribal', createTribalUser); 

// Routes for other functionalities
router.get('/get-tribals', getAllTribalUsers);
router.post('/create-product', createProduct);
router.get('/get-all-products', getAllProducts);
// Serve tribal user photo
router.get('/tribalUser-photo/:id', getTribalUserPhotoController);
router.get('/tribalUser-productquntity', updateProductQuantity);
// Change the route to accept the tribalId parameter
router.get('/tribal-sales/:tribalId', getTribalProductSales);


module.exports = router;
