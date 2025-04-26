import React from "react";
import "../../Styles/FooterStyle.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
       
        <p className="footer-copyright">
          © 2024 My Website. All Rights Reserved.
        </p>

        
        <div className="footer-links text-white">
          <a href="/about" className="text-white footer-link">About Us</a>
          <span className="footer-separator"> | </span>
          <a href="/contact" className="text-white footer-link">Contact</a>
          <span className="footer-separator"> | </span>
          <a href="/privacy" className="text-white footer-link">Privacy Policy</a>
          <span className="footer-separator"> | </span>
          <a href="/terms" className="text-white footer-link">Terms of Service</a>
        </div>

       
        <div className="footer-social">
          <a href="https://facebook.com" className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <i con="fa-brands fa-x-twitter" />
          </a>
          <a href="https://instagram.com" className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
