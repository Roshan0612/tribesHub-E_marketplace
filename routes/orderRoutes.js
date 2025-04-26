
const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authmiddleware");

  const {paymentOrderController,verifyPaymentController}  = require("../controllers/orderController")
const router = express.Router();

 router.post("/payment-order",requireSignIn,paymentOrderController)
 router.post("/verify-payment",requireSignIn,verifyPaymentController)

 
module.exports  =   router;