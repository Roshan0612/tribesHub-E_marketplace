import React from 'react'
import Layouts from '../../components/Layout/Layouts'
import { useAuth } from '../../context/Auth';
import MiddlemanMenu from '../../components/Layout/MiddlemanMenu';
const MiddlemanDashboards = () => {
    const [auth]=useAuth();
  return (
    <Layouts title='Dadhboard-Your Orders'>
      <h1>Middleman  Dashboard</h1>
      <div className='container-fluid'>
         <div className='row'>
           <div className='col-md-3'>
              <MiddlemanMenu/>
           </div>
           <div className='col-md-9'>
             <div className='card w-75 p-3'>
             <h3>middleman Name : {auth?.user?.name}</h3>
             <h3>middleman Email: {auth?.user?.email}</h3>
             <h3>middleman Contact : {auth?.user?.address}</h3>
             <h3> middleman Role : {auth?.user?.role}</h3>
             </div>
            
           </div>
         </div>
      </div>
    </Layouts>
  )
}

export default MiddlemanDashboards