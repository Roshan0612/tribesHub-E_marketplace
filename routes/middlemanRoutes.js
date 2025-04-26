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


router.get('/get-tribals', getAllTribalUsers);
router.post('/create-product', createProduct);
router.get('/get-all-products', getAllProducts);

router.get('/tribalUser-photo/:id', getTribalUserPhotoController);
router.get('/tribalUser-productquntity', updateProductQuantity);

router.get('/tribal-sales/:tribalId', getTribalProductSales);


module.exports = router;
