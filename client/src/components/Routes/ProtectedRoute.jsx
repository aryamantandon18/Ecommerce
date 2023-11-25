import React, {Fragment } from 'react'
import { useSelector } from 'react-redux';
import {Route} from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Loader from '../layouts/loader/Loader';


const ProtectedRoute = ({element}) => {
    const {loading,isAuthenticated,user} = useSelector((state)=>state.user);
  return (
   <Fragment>{
    loading?<Loader/>:(
      <Route
      element={isAuthenticated ? element : <Navigate to="/login" />}
    />
        
)}
    </Fragment>

  )
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