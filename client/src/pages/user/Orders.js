import React, { useState, useEffect } from 'react';
import UserMenu from '../../components/Layout/UserMenu';
import Layouts from '../../components/Layout/Layouts';
import axios from 'axios';
import moment from 'moment';
import { useAuth } from '../../context/Auth';
import MiddlemanMenu from '../../components/Layout/MiddlemanMenu';

const Orders = () => {
  const [orders, setOrder] = useState([]);
  const [auth, setauth] = useAuth();
  const [currentTime, setCurrentTime] = useState(moment());

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/orders`, {
        headers: {
          Authorization: auth?.token, // Send token in Authorization header
        },
      });
      console.log('Fetched orders:', data); // Log the entire orders data
      setOrder(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
    const interval = setInterval(() => {
      setCurrentTime(moment()); // Update current time
    }, 60000); // 60000ms = 1 minute

    return () => clearInterval(interval);
  }, [auth?.token]);

  return (
    <Layouts title="Your Orders">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>

            {/* Map through the orders and display only those for the authenticated user */}
            {orders?.map((o, i) => {
              // Ensure the order is for the current logged-in user
              if (o?.user?._id === auth?.user?._id) {
                console.log('Order:;;', o); // Log each order object to check its structure
                return (
                  <div className="border shadow" key={i}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Status</th>
                          <th scope="col">Buyer</th>
                          <th scope="col">Date</th>
                          <th scope="col">Payment</th>
                          <th scope="col">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{i + 1}</td>
                          <td>{o?.status}</td>
                          <td>{o?.user?.name}</td>
                          <td>{moment(o?.createdAt).fromNow()}</td>
                          <td>{o?.paymentStatus === 'Completed' ? "Success" : o?.paymentStatus === 'pending' ? "Pending" : "Failed"}</td>
                          <td>{o?.products?.length}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="container">
                      {o?.products?.map((p) => {
                        console.log("Product:;", p); // Log each product object to check its structure
                        console.log("Product:==", JSON.stringify(p, null, 2)); // Log entire product object

                        const description = p.description ? p.description.substring(0, 30) : "No description available";
                        return (
                          <div className="row mb-2 p-3 card flex-row" key={p._id}>
                            <div className="col-md-4">
                              <img
                                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                                width="100px"
                                height="150px"
                                className="card-img-top card-img-top w-24 h-24 object-cover"
                                alt={p.name}
                              />
                            </div>
                            <div className="col-md-8">
                              <p>{p.name}</p>
                              <p>{description}</p>
                              <p>Price: {p.price}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              } else {
                return null; // Skip rendering orders that don't belong to the logged-in user
              }
            })}
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default Orders;
