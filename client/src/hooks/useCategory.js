import axios from 'axios'
import React, { useState,useEffect } from 'react'
import { useAuth } from '../context/Auth'

const useCategory = () => {
    const [categories,setCategories]=useState([])
    const [auth] = useAuth()
    useEffect(() => {
      getAllCategories();
  }, [])
   const getAllCategories = async()=>{
      try {
        // Categories are public; do not require Authorization header so filters are visible to all users
        const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
        setCategories(data?.category || []);
      } catch (error) {
        console.log('Error fetching categories:', error?.response?.data || error.message || error);
      }
   }
    useEffect(() => {
        getAllCategories();
    }, [auth?.token])
    
  return categories;
}

export default useCategory;