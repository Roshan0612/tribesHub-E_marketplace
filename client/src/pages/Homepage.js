import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Layouts from '../components/Layout/Layouts';
import { useAuth } from '../context/Auth';
import axios from 'axios';
import Prices from '../components/Prices.js';
import { Checkbox, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { gsap } from 'gsap'; // Import GSAP for animation
import tribalScene from '../Image/hero.jpg'; // Import the background image
import "../Styles/Homepage.css"

const Homepage = () => {
  const [auth] = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useCart([]);
  const navigate = useNavigate();

  const greeting = "Welcome to Tribes India"; // Greeting message

  useEffect(() => {
    // GSAP animation for the greeting
    const letters = greeting.split('').map((letter, index) => {
      const span = document.createElement('span');
      span.innerText = letter;
      return span;
    });

    const titleElement = document.getElementById('animated-title');
    titleElement.innerHTML = ''; // Clear any previous content

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
        className="relative w-full min-h-screen"
        style={{
          backgroundImage: `url(${tribalScene})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h1 id="animated-title" className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg">
              {/* Animated greeting will appear here */}
              Welcome to Tribes India
            </h1>
            <p className="text-white text-lg md:text-xl max-w-3xl mx-auto">
              Explore the beauty of ancient culture combined with modern inspiration.
            </p>
          </div>
        </div>
      </div>

      {/* Content Below the Animated Greeting */}
      <div className="row mt-3">
        {/* Filter Section */}
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
          <h1 className="text-center">All Products</h1>
          <div>{total}</div>
          <div className="d-flex flex-wrap">
            {products.map((p) => (
              <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 20)}...</p>
                  <p className="card-text"> {'\u20B9'}{p.price}</p>
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
          <div className="m-2 p-2">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? 'loading...' : 'loadmore'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default Homepage;
