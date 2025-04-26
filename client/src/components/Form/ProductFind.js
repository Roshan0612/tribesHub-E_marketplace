import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/Auth";
import VoiceAssistent from "./VoiceAssistent";

function ProductFind() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();

  const fetchProducts = async (keyword) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/search-product/${keyword}`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`, 
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

 
  const handleProductFind = (keyword) => {
    console.log("Searching for:", keyword);
    fetchProducts(keyword);
  };

  return (
    <div>
      <div className="navbar bg-body-tertiary p-4 bg-gray-100">
        <div className="container-fluid flex items-center justify-between">
          <h3 className="text-xl">Product Search</h3>
          <VoiceAssistent onProductFind={handleProductFind} />
        </div>
      </div>

      <div className="container mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="border p-4 rounded shadow-md">
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <p><strong>Price:</strong> ${product.price}</p>
                </div>
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductFind;
