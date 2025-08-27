import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hook/useAuth";
import WebsiteLoading from "../Loading/WebsiteLoading";

const PrivateRoute = ({children}) => {
    const {user , loading} = useAuth()
    const location = useLocation();

    if(loading){
        return <WebsiteLoading />
    }
    if(!user){
        return <Navigate to='/login' state={{from: location}} replace></Navigate>
    }
  return children
}

export default PrivateRoute;