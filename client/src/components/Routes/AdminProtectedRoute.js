import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/Auth';
import { Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../spinner/Spinner';

export default function AdminPrivateRoute(){
    const [ok,setOk]=useState(false);
    const [loading,setLoading]=useState(true);
    const [auth]=useAuth();

    useEffect(()=>{
        const  authCheck= async() =>{
            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/admin-auth`, {
                    headers: {
                        Authorization: auth?.token,
                    },
                });

                if (res.data?.ok) {
                    setOk(true);
                } else {
                    setOk(false);
                }
            } catch (error) {
                // treat any error as unauthorized
                console.error('admin-auth check failed:', error?.response?.status, error?.response?.data || error.message);
                setOk(false);
            } finally {
                setLoading(false);
            }
        } ;

        // If there's no token, skip the check and redirect to login immediately
        if(!auth?.token){
            setLoading(false);
            setOk(false);
            return;
        }

        authCheck();
    },[auth?.token]);

    // If still checking, show spinner
    if(loading) return <Spinner path="/login" />

    // If not authorized, redirect to login (or home) — here we send to login
    if(!ok) return <Navigate to="/login" replace />

    // Authorized
    return <Outlet />
}