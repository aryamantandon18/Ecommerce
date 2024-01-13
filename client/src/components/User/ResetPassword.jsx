import React, { Fragment, useEffect, useState } from 'react'
import Loader from '../layouts/loader/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './UpdatePassword.module.css'
import MetaData from '../layouts/MetaData';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { clearErrors, resetPassword } from '../../actions/userActions';

const ResetPassword = () => {

    let {token} = useParams();
    const dispatch = useDispatch();
    const {error,success,loading} = useSelector((state)=>state.forgotPassword);
    const navigate = useNavigate();

    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');

    
    const HandleSubmit=(e)=>{
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("password",password);
        myForm.set("confirmPassword",confirmPassword);
        dispatch(resetPassword(token,myForm));

    }

    useEffect(()=>{
    
        if(error){
            toast.error(error.message);
            dispatch(clearErrors());
        }
        if(success){
            toast.success("Password Updated SuccessFully");
            navigate("/login");
        }
    },[dispatch,error,navigate,success]);    //toast cannot be in dependencies

  return (
    <Fragment>
    {loading?<Loader/>:(
        <Fragment>
            <MetaData title="Change Password" />
            <div className={styles.componentWrapper}>
     <div className={styles.head} >
 
         <div className={styles.background}>
             <div class={styles.shape}></div>
             <div class={styles.shape}></div>
         </div>   
         
     <form onSubmit={HandleSubmit} className={styles.loginForm} encType='multipart/form-data' style={{height:"470px"}}>
         <h3 >Update Password</h3>
         {/* <label htmlFor='username'>Name</label> */}
         <div>
         <LockOpenIcon /> 
         <input className={styles.Logininput} type='password' placeholder='New Password' name='newPassword' required value={password} onChange={(e)=>setPassword(e.target.value)}/> </div>
    
        <div>
          <LockIcon />
         <input className={styles.Logininput} type='password' placeholder='Confirm Password' name='confirmPassword' required value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/> </div>
         
         <button type='submit' className={styles.Loginbutton}>Update</button>
       
     </form>
 </div>
 </div>
        </Fragment>
    )}
</Fragment>
  )
}

export default ResetPassword