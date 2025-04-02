import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/Auth';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../spinner/Spinner';
import { Navigate } from 'react-router-dom';
 function MiddleManRoute(){
    const [ok,setOk]=useState(false);
    const [auth]=useAuth();
    const navigate =useNavigate();
    useEffect(()=>{
        const  authCheck= async() =>{
            const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/middleman-auth`,{
                headers:{
                    "Authorization" : auth?.token
                }
            });
            if(res.data.ok){
              setOk(true)
              console.log("role:", res.data.auth?.user?.role); 
              console.log("user:", res.data.auth?.user);  

              console.log("roll:",res.auth?.user?.role);
              navigate("/dashboard/middleman")
            }else{
              setOk(false)
            }
        } ;
        if(auth?.token) authCheck();
    },[auth?.token]);

    
    return ok? <Outlet/>:<Spinner/>
}
export default MiddleManRoute