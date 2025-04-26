import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layouts from "../../components/Layout/Layouts";
import MiddlemanMenu from "../../components/Layout/MiddlemanMenu";
import { useAuth } from "../../context/Auth";
import { useNavigate } from "react-router-dom";
import "../../Styles/MiddlemanStyle.css"
// import "../../Styles/MiddlemanSelectTribalStyle.css"

export default function MiddlemanSelectTribal() {
  const [tribals, setTribals] = useState([]);
  const [auth] = useAuth();
  const [tribalDetails, setTribalDetails] = useState(null);  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTribals = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/middleman/get-tribals`, {
          headers: {
            Authorization: auth?.token,
          },
        });
        setTribals(data.tribals);
      } catch (error) {
        toast.error("Failed to fetch tribal users");
      }
    };
    fetchTribals();
  }, [auth]);

  const handleSelectTribal = (tribalId, tribalName) => {
    console.log("Button clicked", { tribalId, tribalName }); 
    navigate("/dashboard/middleman/CreateProduct", { state: { tribalId, tribalName } });
  };


  
  
  return (
    <Layouts>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <MiddlemanMenu />
          </div>
          <div className="col-md-9">
            <div className="p-4">
              <h2 className="text-xl mb-4">Select a Tribal User</h2>

              
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Photo</th>
                    <th scope="col">Name</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tribals.length > 0 ? (
                    tribals.map((tribal, index) => (
                      <tr key={tribal._id}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            src={tribal.photo ? `${process.env.REACT_APP_API}/api/v1/middleman/tribalUser-photo/${tribal._id}` : "/default-image.png"}
                            alt={tribal.name}
                            className="tribal-img"
                          />
                        </td>
                        <td>{tribal.name}</td>
                        <td>
                        <button
                          className="btn btn-primary"
                          onClick={(e) => {
                          e.stopPropagation();  
                          console.log("Button clicked", { tribalId: tribal._id, tribalName: tribal.name }); 
                          handleSelectTribal(tribal._id, tribal.name);
                          }}
                        >
                        Select
                        </button>


                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">No tribal users found</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Display tribal sales data if available */}
              {tribalDetails && (
                <div>
                  <h3>Tribal Profile: {tribalDetails.tribalId.name}</h3>
                  <p>Total Quantity Sold: {tribalDetails.totalQuantitySold}</p>
                  <p>Total Money Owed: ${tribalDetails.totalAmount.toFixed(2)}</p>
                  <h4>Products Sold</h4>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity Sold</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tribalDetails.products.map(product => (
                        <tr key={product._id}>
                          <td>{product.name}</td>
                          <td>{product.sold}</td>
                          <td>${product.price}</td>
                          <td>${(product.sold * product.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
}
