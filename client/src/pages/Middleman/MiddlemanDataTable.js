import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layouts from "../../components/Layout/Layouts";
import MiddlemanMenu from "../../components/Layout/MiddlemanMenu";

export default function MiddlemanDataTable() {
  const [products, setProducts] = useState([]);

  // Fetch products data from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/middleman/get-all-products`);
        setProducts(data.products);
      } catch (error) {
        toast.error("Failed to fetch products.");
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layouts>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <MiddlemanMenu />
          </div>
          <div className="col-md-9">
            <h2 className="text-xl mb-4">Products Added by Tribals</h2>

            {/* Table displaying product details */}
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tribal Name</th>
                  <th>Location</th> {/* Added Location Column */}
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr key={product._id}>
                      <td>{index + 1}</td>
                      <td>{product.tribalId?.name}</td>
                      <td>{product.tribalId?.location || "Location Not Available"}</td> {/* Displaying Location */}
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>{product.quantity}</td>
                      <td>{product.totalCost}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No products available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layouts>
  );
}
