import React from 'react';
import Layouts from '../components/Layout/Layouts';
import useCategory from '../hooks/useCategory';
import { Link } from 'react-router-dom';
import "../Styles/CategoriesStyle.css";

const Categories = () => {
    const categories = useCategory();
  
    return (
        <Layouts>
            <div className='categories-page'>
                <div className='container'>
                    <h1>All Categories!</h1>
                    <div className='row'>
                        {categories.map((c) => (
                            <div className='col-md-6' key={c._id}>
                                <button className='btn btn-primary'>
                                    <Link to={`/category/${c.slug}`} className='btn btn-primary'>
                                        {c.name}
                                    </Link>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layouts>
    );
}

export default Categories;
