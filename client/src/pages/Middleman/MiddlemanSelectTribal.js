import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layouts from "../../components/Layout/Layouts";
import MiddlemanMenu from "../../components/Layout/MiddlemanMenu";
import { useAuth } from "../../context/Auth";
import { useNavigate } from "react-router-dom";
import "../../Styles/MiddlemanStyle.css"
import "../../Styles/MiddlemanSelectTribalStyle.css"
export default function MiddlemanSelectTribal() {
  const [tribals, setTribals] = useState([]);
  const [auth] = useAuth();
  const [tribalDetails, setTribalDetails] = useState(null);  // Store selected tribal details
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
    navigate("/dashboard/middleman/CreateProduct", { state: { tribalId, tribalName } });
  };

  const handleViewTribalProfile = async (tribalId) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/middleman/tribal-sales/${tribalId}`, {
        headers: {
          Authorization: auth?.token,
        },
      });
      setTribalDetails(data);  // Update the state with tribal sales data
    } catch (error) {
      toast.error("Failed to fetch tribal sales data");
    }
  };
  
  
  return (
    <Layouts>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <MiddlemanMenu />
          </div>
          <div className="col-md-9">
          <div className="middleman-select-container">
  <h2 className="middleman-select-title">Select a Tribal User</h2>

  <table className="middleman-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Photo</th>
        <th>Name</th>
        <th>Action</th>
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
                className="middleman-img"
              />
            </td>
            <td>{tribal.name}</td>
            <td>
              <button
                className="middleman-btn-select"
                onClick={() => handleSelectTribal(tribal._id, tribal.name)}
              >
                Select
              </button>
              <button
                className="middleman-btn-profile"
                onClick={() => handleViewTribalProfile(tribal._id)}
              >
                View Profile
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
</div>

          </div>
        </div>
      </div>
    </Layouts>
  );
}
