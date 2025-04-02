import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layouts from "../../components/Layout/Layouts";
import MiddlemanMenu from "../../components/Layout/MiddlemanMenu";
import { useAuth } from "../../context/Auth";
import "../../Styles/MiddlemanStyle.css"
import "../../Styles/MiddlemanCreateTribalsStyle.css"
export default function MiddlemanCreateTribal() {
  const [auth] = useAuth();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');  // New state for location
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
    }
  };

  const handleCreateTribal = async () => {
    try {
      const data = {
        name,
        location,  // Send location with the request
        photo,
      };

      const { data: responseData } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/middleman/create-tribal`,
        data,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      toast.success('Tribal user created successfully');
    } catch (error) {
      console.error('Error creating tribal user:', error);
      toast.error(`Error: ${error?.response?.data?.message || error.message}`);
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
          <div className="middleman-create-tribal">
  <h2 className="text-xl mb-4">Create Tribal User</h2>
  <input
    type="text"
    placeholder="Tribal Name"
    className="form-input mb-4"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
  <input
    type="text"
    placeholder="Location"
    className="form-input mb-4"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
  />
  <input type="file" className="mb-4" onChange={handlePhotoChange} />
  <button onClick={handleCreateTribal}>Create Tribal</button>
</div>

          </div>
        </div>
      </div>
    </Layouts>
  );
}
