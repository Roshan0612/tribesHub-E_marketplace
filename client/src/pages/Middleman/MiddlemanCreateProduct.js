import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Select } from "antd";
import { toast } from "react-toastify";
import Layouts from "../../components/Layout/Layouts";
import MiddlemanMenu from "../../components/Layout/MiddlemanMenu";
import { useAuth } from "../../context/Auth";

import "../../Styles/MiddlemanCreateProductStyle.css"

const { Option } = Select;




export default function MiddlemanCreateProduct() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { tribalId, tribalName } = location.state || {}; 
  const [categories, setCategories] = useState([]); 
  const [name, setName] = useState(""); 
  const [description, setDescription] = useState(""); 
  const [price, setPrice] = useState(""); 
  const [category, setCategory] = useState(""); 
  const [quantity, setQuantity] = useState(""); 
  const [photo, setPhoto] = useState(null); 
  const [auth] = useAuth(); 

  // Fetch categories for product selection
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`, {
        headers: {
          Authorization: auth?.token,
        },
      });
      if (data?.success) {
        setCategories(data?.category); 
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    getAllCategory();
  }, [auth]);

 
  const handleCreateProduct = async (e) => {
    e.preventDefault();

    if (!tribalId) {
        toast.error("Tribal user is not selected");
        return;
    }

    const formData = new FormData();
    formData.append('tribalId', tribalId); // tribalId is added here
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('category', category);
    if (photo) formData.append('photo', photo);

    try {
        const { data } = await axios.post(
            `${process.env.REACT_APP_API}/api/v1/middleman/create-product`,
            formData,
            {
                headers: {
                    Authorization: auth?.token, 
                },
            }
        );

        if (data?.success) {
            toast.success("Product created successfully");
            navigate("/dashboard/middleman/SelectTribal"); 
        } else {
            toast.error("Failed to create product");
        }
    } catch (error) {
        console.error(error);
        toast.error("Error occurred while creating product");
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
            <h1 className="text-xl mb-4">Create Product for {tribalName}</h1>
            <form onSubmit={handleCreateProduct}>
              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Select Category"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  value={category}
                  onChange={(value) => setCategory(value)}
                >
                  {categories?.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12 file-input-btn">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>

              {photo && (
                <div className="text-center mb-3">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="product_photo"
                    className="img img-responsive"
                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                  />
                </div>
              )}

              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Product Name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <textarea
                  value={description}
                  placeholder="Product Description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="Product Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="Product Quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <button type="submit" className="submit-btn">
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layouts>
  );
}
