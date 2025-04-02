import React from 'react';
import { NavLink } from 'react-router-dom';
import "../../Styles/MenuDahsboardStyle.css"
const MiddlemanMenu = () => {
  return (
    <div className="text-center">
      <nav className="list-group">
        <h4>Middleman  Dashboard</h4>
        {/* new addition into tribal */}
        <NavLink
          to="/dashboard/middleman/CreateTribal"
          className="list-group-item"
        >
         MiddlemanCreateTribal
        </NavLink>

        <NavLink
          to="/dashboard/middleman/SelectTribal"
          className="list-group-item"
        >
         MiddlemanSelectTribal
        </NavLink>
        <NavLink
          to="/dashboard/middleman/CreateProduct"
          className="list-group-item"
        >
          MiddlemanCreateProduct
        </NavLink>
        <NavLink
          to="/dashboard/middleman/DataTable"
          className="list-group-item"
        >
         MiddlemanDataTable
        </NavLink>
        
        
        
      </nav>
    </div>
  );
}

export default MiddlemanMenu;
