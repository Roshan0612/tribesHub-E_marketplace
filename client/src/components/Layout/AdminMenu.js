import React from 'react';
import { NavLink } from 'react-router-dom';
import "../../Styles/MenuDahsboardStyle.css"
const AdminMenu = () => {
  return (
    <div className="text-center">
      <nav className="list-group">
        <h4>Admin panel</h4>
        <NavLink
          to="/dashboard/admin/create-category"
          className="list-group-item"
        >
          create catogory
        </NavLink>

        <NavLink
          to="/dashboard/admin/create-product"
          className="list-group-item"
        >
         create product
        </NavLink>

        <NavLink
          to="/dashboard/admin/products"
          className="list-group-item"
        >
          Products
        </NavLink>
        <NavLink
          to="/dashboard/admin/orders"
          className="list-group-item"
        >
          AllOrders
        </NavLink>
        
      </nav>
    </div>
  );
}

export default AdminMenu;
