import React from 'react';
import { useSearch } from '../../context/search';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/Auth';

const SearchInput = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();
    const [auth] = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting search for:", values.keyword);
    
        if (!values.keyword.trim()) {
            alert("Please enter a search keyword.");
            return;
        }
    
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/product/search-product/${values.keyword}`,
                {
                    headers: { Authorization: auth?.token },
                }
            );
            console.log("API Response:", data);
    
            setValues({ keyword: values.keyword, results: data });
    
            if (data.length > 0) {
                navigate("/search");
            } else {
                alert("No products found.");
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
            alert("Something went wrong. Please try again.");
        }
    };
    

    return (
        <div className="search-input-container">
            <form className="d-flex" role="search" onSubmit={handleSubmit}>
                <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={values.keyword}
                    onChange={(e) => setValues({ ...values, keyword: e.target.value })}
                />
                <button className="btn btn-outline-success" type="submit">
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchInput;
