import React, {Fragment} from 'react'
import { useSelector } from 'react-redux';
import {Navigate,Route} from 'react-router-dom';
// import { Navigate } from 'react-router-dom';
import Loader from '../layouts/loader/Loader';
import toast from 'react-hot-toast';


const ProtectedRoute = ({children,isAdmin}) => {
    const {loading,isAuthenticated,user} = useSelector((state)=>state.user);
    if(loading) {return <Loader/>}
    else{
        if(isAdmin && user.role !== 'admin'){
            toast.error("You r not an admin");
            return <Navigate to ="/login"/>
           }
    
       else if(isAuthenticated == false){
        return <Navigate to ="/login" />
       }
    
       else{
        return children
       }
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