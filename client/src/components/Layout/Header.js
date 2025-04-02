import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/Auth';
import { useCart } from '../../context/cart';
import useCategory from '../../hooks/useCategory';
import {  Badge} from 'antd';
import SearchInput from '../Form/SearchInput';
import VoiceAssistent from '../Form/VoiceAssistent';
import "../../Styles/HeaderStyle.css"
const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const categories = useCategory([]);
  const [response, setResponse] = useState('');

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: '',
    });

    localStorage.removeItem('auth');
  };

  const startListening = () => {
    console.log('Starting speech recognition...');
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const message = 'Speech recognition is not supported in this browser.';
      alert(message);
      return;
    }

    // Initialize the SpeechRecognition object
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    // Start recognition
    recognition.start();

    // Define the onresult event to handle the recognized speech
    recognition.onresult = (event) => {
      // Debugging: Log the entire event object
      console.log('Speech recognition result event:', event);

      // Extract the transcript from the event object
      const transcript = event.results[0][0].transcript;
      console.log('Transcript:', transcript); // Log the recognized speech

      // Set the response state to display the recognized speech in the UI
      setResponse(`You said: ${transcript}`);
    };

    // Error handling
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event);
      setResponse('Error recognizing speech.');
    };

    // End event (called when the recognition session ends)
    recognition.onend = () => {
      console.log('Speech recognition session ended.');
    };
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
           
          {/* Brand Name */}
          <Link className="navbar-brand" to="#">
            🛒 TribalHub
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Links on the right (collapsed in smaller screens) */}
          <div className="collapse navbar-collapse" id="navbarNav">
            
            <ul className="navbar-nav ms-auto"> {/* ms-auto for right-alignment */}

              <SearchInput/>
              <VoiceAssistent onProductFind={() => {}} />
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>

              {/* Categories and other links */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categories
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink className="dropdown-item" to={`/categories`}>
                      All Categories
                    </NavLink>
                  </li>
                  {categories?.map((c) => (
                    <li key={c._id}>
                      <NavLink className="dropdown-item" to={`/category/${c.slug}`}>
                        {c.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Authentication section */}
              {!auth.user ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/register">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login">
                      Login
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {auth?.user?.name}
                    </button>
                    <ul className="dropdown-menu">
                      <li className="nav-item">
                        <NavLink
                          className="nav-link"
                          to={`/dashboard/${
                            auth?.user?.role === 1 ? 'admin' :
                            auth?.user?.role === 2 ? 'middleman' :
                            'user'

                          }`}
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink className="nav-link" to="/login" onClick={handleLogout}>
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </>
              )}

              <li className="nav-item">
                <Badge count={cart?.length} showZero>
                  <NavLink className="nav-link" to="/cart">
                    Cart
                  </NavLink>
                </Badge>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Display the recognized speech result */}
      <div>
        <p>{response}</p>
      </div>
    </>
  );
};

export default Header;
