import React from 'react'
import { useEffect,useState } from 'react';
import Layouts from '../components/Layout/Layouts'
import { useAuth } from '../context/Auth'
import { useCart } from '../context/cart';
import { useNavigate } from 'react-router-dom';
import "../Styles/CartStyles.css"
import Razorpay from 'razorpay';

import axios from 'axios';
const CartPage = () => {
  
  const [auth] = useAuth();
  const [cart,setCart] = useCart();
  const navigate = useNavigate();
  console.log(auth?.user);

  const totalCost=()=>{
   try {
    let total = 0;
    cart?.map((item)=> {
      // total = total + item.price;
      total =total + parseFloat(item.price); 
 
    });
    return total
   }catch (error) {
    console.log(error);
   }
  }
  const removeProductFromCart=(pid)=>{
     try {
      const myCart= [...cart];
      const index = myCart.findIndex(item=>  item._id === pid)
      myCart.splice(index,1)
      localStorage.setItem("cart", JSON.stringify(myCart)); 

      
      setCart(myCart);
     } catch (error) {
      console.log(error)
     }
  }
  const handlePayment = async () => {
    try {
      // Step 1: Call backend to create payment order
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/order/payment-order`,
        { cart, total: totalCost() }, // Pass the cart and total cost (totalCost() gives total in INR)
        {
          headers: {
            Authorization: auth?.token, // Pass token to authorize the request
          },
        }
      );
      
      console.log('Create Payment Response:', data); // Debugging the backend response
  
      if (data?.success) {
        const order = data.order; // Destructure order data from the response
  
        const options = {
          key: process.env.RAZORPAY_KEY_ID, // Razorpay Key ID
          amount: order.amount, // Amount is in paise
          currency: 'INR',
          name: 'E-commerce Store',
          description: 'Payment for your order',
          order_id: order.id,
          handler: async function (paymentData) {
            console.log('Payment Data from Razorpay:', paymentData);
  
            // Step 2: Verify payment on the backend
            const verifyResponse = await axios.post(
              `${process.env.REACT_APP_API}/api/v1/order/verify-payment`,
              {
                razorpay_payment_id: paymentData.razorpay_payment_id,
                razorpay_order_id: paymentData.razorpay_order_id,
                razorpay_signature: paymentData.razorpay_signature,
              },
              {
                headers: {
                  Authorization: auth?.token, // Pass token to authorize the request
                },
              }
            );
  
            console.log('Verify Payment Response:', verifyResponse);
  
            // Step 3: Handle the response from backend verification
            if (verifyResponse?.data.success) {
              alert('Payment successful!');
              setCart([])
              navigate('/dashboard/user/orders');
            
            } else {
              alert('Payment verification failed!');
            }
          },
          theme: {
            color: '#F37254', // Theme color for the payment modal
          },
        };
  
        const razorpay = new  window.Razorpay(options);
        razorpay.open(); // Open the Razorpay payment modal
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Error during payment initiation');
    }
  };
  
  

  return (
    <Layouts>
  <div className="container cart-page"> {/* Add cart-page class here */}
    <div className="row">
      <div className="col-md-12">
        <h3 className="text-center">{` hello ${auth?.token && auth?.user?.name}`}</h3>
        <h4 className="text-center">
          {cart.length > 0
            ? `You Have ${cart.length} Item in the cart  ${auth?.token ? '' : 'please login to checkout!'}`
            : 'your cart is empty'}
        </h4>
      </div>
    </div>
    <div className="row">
      <div className="col-md-8">
        All added product
        {cart?.map((p) => (
          <div className="row card m-2 flex-row" key={p._id}>
            <div className="col-md-4">
              <img
                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                width="80px"
                height="100%"
                alt={p.name}
              />
            </div>
            <div className="col-md-4">
              <p>{p.name}</p>
              <p>{p.description.substring(0, 20)}</p>
              <p>{'₹' + p.price}</p>
              <button className="btn btn-danger m-1" onClick={() => removeProductFromCart(p._id)}>
                remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="col-md-4 text-center">
        <h1 className="m-4">Cart Summary</h1>
        <h2>checkout | payment</h2>
        <h4>Total: ₹{totalCost()}</h4>
        {auth?.user?.address ? (
          <>
            <h4>Current Address</h4>
            {auth?.user?.address}
            <div>
              <button
                className="btn btn-outline-warning"
                onClick={() => navigate(`/dashboard/user/profile/`)}
              >
                change address
              </button>
            </div>
          </>
        ) : (
          <div className="mb-3">
            {auth?.token ? (
              <button
                className="btn btn-outline-warning"
                onClick={() => navigate(`/dashboard/user/profile/`)}
              >
                change address
              </button>
            ) : (
              <button
                className="btn btn-outline-warning"
                onClick={() => navigate(`/login/`, { state: '/cart' })}
              >
                Please Login to checkout
              </button>
            )}
          </div>
        )}
        <button
          className="btn btn-outline-primary"
          onClick={handlePayment}
          disabled={!auth.user || !auth.user.address}
        >
          payment
        </button>
      </div>
    </div>
  </div>
</Layouts>

  )
}

export default CartPage