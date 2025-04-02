import React from 'react';
import Layouts from '../components/Layout/Layouts';
import { useSearch } from '../context/search';

const Search = () => {
    const [values] = useSearch();

    return (
        <Layouts title="Search Results">
            <div className="container">
                <div className="text-center">
                    <h1>Search Results</h1>
                    <h6>
                        {values.results.length < 1 ? "No results found" : `Found ${values.results.length} products`}
                    </h6>
                </div>

                <div className="row">
                    {values.results.length > 0 ? (
                        values.results.map((p) => (
                            <div key={p._id} className="col-md-4">
                                <div className="card m-2" style={{ width: '18rem' }}>
                                    <img
                                        src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                                        className="card-img-top"
                                        alt={p.name}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description.substring(0, 20)}...</p>
                                        <p className="card-text"><strong>Price:</strong> ${p.price}</p>
                                        <button className="btn btn-primary">More Details</button>
                                        <button className="btn btn-secondary m-2">Add To Cart</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <h4 className="text-center mt-4">No products match your search.</h4>
                    )}
                </div>
            </div>
        </Layouts>
    );
};

export default Search;
