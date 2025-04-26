import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Layouts from '../components/Layout/Layouts';
import { useAuth } from '../context/Auth';
import axios from 'axios';
import Prices from '../components/Prices.js';
import { Checkbox, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { gsap } from 'gsap'; 
import tribalScene from '../Image/hero.jpg'; 
import "../Styles/Homepage.css"


const Homepage = () => {
  const [auth] = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useCart([]);
  const navigate = useNavigate();

  const greeting = "Welcome to Tribes India"; 

  useEffect(() => {
    
    const letters = greeting.split('').map((letter, index) => {
      const span = document.createElement('span');
      span.innerText = letter;
      return span;
    });

    const titleElement = document.getElementById('animated-title');
    titleElement.innerHTML = ''; 

    letters.forEach((span) => titleElement.appendChild(span));

    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    letters.forEach((letter, index) => {
      tl.fromTo(
        titleElement.children[index],
        { opacity: 0, y: -50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power1.out',
          stagger: {
            amount: 0.5,
            from: 'start',
            ease: 'power1.out',
          },
          delay: index * 0.1,
        },
        0
      );
    });
  }, []);

  const GetAllProducts = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-all-product`, {
        headers: {
          Authorization: auth?.token,
        },
      });
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetAllProducts();
  }, [auth?.token]);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`, {
        headers: {
          Authorization: auth?.token,
        },
      });
      setCategories(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!radio.length || !checked.length) getAllCategory();
  }, [radio.length, checked.length]);

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    if (radio.length || checked.length) FilterProduct();
  }, [radio, checked]);

  const FilterProduct = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/filter-product`, { checked, radio }, {
        headers: {
          Authorization: auth?.token,
        },
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const TotalCount = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-count`, {
        headers: {
          Authorization: auth?.token,
        },
      });
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    TotalCount();
  }, []);

  return (
    <Layouts title={"All Products - Best Offers!"}>
      {/* Animated Greeting Section */}
      <div
      className="animated-greeting"
      style={{
      backgroundImage: `url(${tribalScene})`,
      }}
      >
      <div className="animated-overlay"></div>
        <div className="animated-content">
        <h1 id="animated-title" className="animated-title">
             Welcome to Tribes India
        </h1>
        <p className="animated-subtitle">
            Explore the beauty of ancient culture combined with modern inspiration.
        </p>
        </div>
      </div>


      
      <div className="row mt-3">
        <div className="col-md-3 filters">
          <h4>Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>

          {/* Filter by Prices */}
          <h4>Filter By Prices</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
            <button onClick={() => window.location.reload()} className="reset-filters-btn">
              RESET FILTERS
            </button>
          </div>
        </div>

        {/* Products Section */}
        <div className="col-md-9">
  <div className="d-flex flex-wrap justify-content-center gap-3">
    {products.map((p) => (
      <div className="card" style={{ width: '18rem' }} key={p._id}>
        <img
          src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
          className="card-img-top"
          alt={p.name}
        />
        <div className="card-body">
          <h5 className="card-title">{p.name}</h5>
          <p className="card-text">{p.description.substring(0, 20)}...</p>
          <p className="card-text">{'\u20B9'}{p.price}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/product/${p.slug}`)}
          >
            More Details
          </button>
          <button
            className="btn btn-secondary m-2"
            onClick={() => {
              setCart([...cart, p]);
              localStorage.setItem('cart', JSON.stringify([...cart, p]));
            }}
          >
            Add To Cart
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

      </div>
    </Layouts>
  );
};

export default Homepage;
