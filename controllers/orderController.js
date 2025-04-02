const { default: slugify } = require("slugify");
const fs = require("fs");
const Razorpay = require("razorpay")
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
var CryptoJS = require("crypto-js");
const dotenv = require("dotenv")
const orderModel =require("../models/orderModel");
const Order = require("../models/orderModel")
dotenv.config();
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,  // Your Razorpay Key ID from .env
    key_secret: process.env.RAZORPAY_KEY_SECRET,  // Your Razorpay Key Secret from .env
});


const paymentOrderController = async (req, res) => {
    try {
        const { cart, total } = req.body; // Assuming the cart and total amount are passed from the frontend

        // Validate that the cart and total are provided
        if (!cart || !cart.length) {
            return res.status(400).send({ message: "Cart is empty or missing" });
        }

        if (!total || total <= 0) {
            return res.status(400).send({ message: "Total amount is required and should be greater than zero" });
        }

        // Ensure total is in paise (1 INR = 100 paise)
        const amountInPaise = total * 100;

        // Log the incoming data to verify
        console.log("Cart:", cart);
        console.log("Total (in paise):", amountInPaise);

        // Create an order in Razorpay
        const orderOptions = {
            amount: amountInPaise, // Convert to paise (1 INR = 100 paise)
            currency: "INR",
            receipt: `order_${Date.now()}`,
            notes: {
                cartDetails: cart,
            },
        };

        razorpayInstance.orders.create(orderOptions, async (err, order) => {
            if (err) {
                console.error("Razorpay Order Creation Error:", err);
                return res.status(500).send({
                    message: "Error while creating Razorpay order",
                    error: err,
                });
            }

            // Create order in the database
            const orderDoc = new orderModel({
                user: req.user._id,
                products: cart,
                amount: total, // Store total in INR (not paise)
                paymentStatus: 'Pending',
                paymentId: order.id,
            });

            await orderDoc.save();

            res.status(200).send({
                success: true,
                order,
            });
        });
    } catch (error) {
        console.error("Payment Order Controller Error:", error);
        res.status(500).send({
            success: false,
            message: "Error while creating payment",
        });
    }
};

const verifyPaymentController = async (req, res) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  
      const order = await Order.findOne({ paymentId: razorpay_order_id });
  
      if (!order) {
        return res.status(404).send({ message: "Order not found" });
      }
  
      // Generate the signature using your Razorpay secret
      const generatedSignature = CryptoJS.HmacSHA256(razorpay_order_id + "|" + razorpay_payment_id, process.env.RAZORPAY_KEY_SECRET).toString(CryptoJS.enc.Hex);
      
      // Debug: Log both signatures to see what's going wrong
      console.log('Generated Signature:', generatedSignature);
      console.log('Razorpay Signature:', razorpay_signature);
  
      if (generatedSignature === razorpay_signature) {
        // Payment is successful
        order.paymentStatus = 'Completed';
        order.paymentId = razorpay_payment_id;
  
        await order.save();
  
        res.status(200).send({ success: true, message: "Payment verified" });
      } else {
        // Payment verification failed
        order.paymentStatus = 'Failed';
        await order.save();
  
        res.status(400).send({ success: false, message: "Payment verification failed" });
      }
    } catch (error) {
      console.error("Payment Verification Error:", error);
      res.status(500).send({ success: false, message: "Error verifying payment" });
    }
};

  
module.exports={verifyPaymentController, paymentOrderController}