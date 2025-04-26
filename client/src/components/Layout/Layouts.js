import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from 'react-helmet';
import { ToastContainer } from 'react-toastify';

const Layouts = ({ 
  children, 
  title = "E-commerce Shop Now", 
  description = "MERN stack project", 
  keywords = "mern, react, node, mongodb", 
  author = "roshanG12" 
}) => {
  return (
    <div className="layout-container"> 
      <Helmet>
        <meta charSet='utf-8' />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>

      <Header />

      <main className="main-content">
        <ToastContainer />
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layouts;
