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
    key_id: process.env.RAZORPAY_KEY_ID,  
    key_secret: process.env.RAZORPAY_KEY_SECRET, 
});


const paymentOrderController = async (req, res) => {
    try {
        const { cart, total } = req.body;
        if (!cart || !cart.length) {
            return res.status(400).send({ message: "Cart is empty or missing" });
        }
        if (!total || total <= 0) {
            return res.status(400).send({ message: "Total amount should be greater than zero" });
        }

        const amountInPaise = total * 100; 

       
        const orderOptions = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `order_${Date.now()}`,
            notes: { cartDetails: cart },
        };

        razorpayInstance.orders.create(orderOptions, async (err, order) => {
            if (err) {
                return res.status(500).send({ message: "Error creating Razorpay order", error: err });
            }

            const orderDoc = new orderModel({
                user: req.user._id,
                products: cart,
                amount: total,
                paymentStatus: 'Pending',
                paymentId: order.id,
            });

            await orderDoc.save();

            
            for (let item of cart) {
                await productModel.findByIdAndUpdate(
                    item._id, 
                    { $inc: { sold: item.quantity } },
                    { new: true }
                );
            }

            res.status(200).send({ success: true, order });
        });
    } catch (error) {
        console.error("Payment Order Controller Error:", error);
        res.status(500).send({ success: false, message: "Error while creating payment" });
    }
};


const verifyPaymentController = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        const order = await Order.findOne({ paymentId: razorpay_order_id });

        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }

        const generatedSignature = CryptoJS.HmacSHA256(
            razorpay_order_id + "|" + razorpay_payment_id, 
            process.env.RAZORPAY_KEY_SECRET
        ).toString(CryptoJS.enc.Hex);

        if (generatedSignature === razorpay_signature) {
            order.paymentStatus = "Completed";
            order.paymentId = razorpay_payment_id;
            await order.save();

         
            for (const item of order.products) {
                await productModel.findByIdAndUpdate(item._id, {
                    $inc: { sold: item.quantity } 
                });
            }

            res.status(200).send({ success: true, message: "Payment verified" });
        } else {
            order.paymentStatus = "Failed";
            await order.save();

            res.status(400).send({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).send({ success: false, message: "Error verifying payment" });
    }
};

  
module.exports={verifyPaymentController, paymentOrderController}