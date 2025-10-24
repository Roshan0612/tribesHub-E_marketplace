import axios from 'axios';
import React,{ useState,useContext,useEffect,createContext } from 'react'

const authContext =createContext();

export const AuthProvider = ({children}) => {

    const [auth,setAuth]=useState({
       user:null,
       token:""
    });

  
    useEffect(()=>{
        const data=localStorage.getItem('auth');
        if(data){
        const parsedata = JSON.parse(data);
            // Initialize auth from localStorage; avoid merging with stale state
            setAuth({
              user: parsedata.user || null,
              token: parsedata.token || "",
              role: parsedata.user?.role || null,
            });
        }
    },[]);

  //eslint-disable-next-line
  return (
    <authContext.Provider value={[auth,setAuth]}>
          {children}
    </authContext.Provider>
  )
};
export const useAuth=() => useContext(authContext);

