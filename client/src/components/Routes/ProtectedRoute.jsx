import React, {Fragment} from 'react'
import { useSelector } from 'react-redux';
import {Navigate,Route} from 'react-router-dom';
// import { Navigate } from 'react-router-dom';
import Loader from '../layouts/loader/Loader';


const ProtectedRoute = ({children,isAdmin}) => {
    const {loading,isAuthenticated,user} = useSelector((state)=>state.user);
    if(isAdmin && user.role !== 'admin'){
        <Navigate to ="/login" />
       }

   else if(isAuthenticated){
    return children
   }

   else{
    return <Navigate to ="/login" />
   }

  
}

export default ProtectedRoute


{/* <Route
{...rest}
render={(props)=>{
    if(!isAuthenticated){
    return <Navigate to="/login" /> }
    return<element {...props}/>
}} 
/> */}