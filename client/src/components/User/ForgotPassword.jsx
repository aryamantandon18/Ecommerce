import React, { Fragment, useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux';
import { forgotPassword,clearErrors } from '../../actions/userActions';
import styles from './ForgotPassword.module.css'
import toast from 'react-hot-toast';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Loader from '../layouts/loader/Loader';

const ForgotPassword = () => {
    
        const dispatch = useDispatch();
        const [email,setEmail] = useState("");
        const {error,loading,message} = useSelector((state)=>state.forgotPassword);

        const HandleSubmit=(e)=>{
            e.preventDefault();
            const myForm = new FormData();

            myForm.set("email",email);

            dispatch(forgotPassword(myForm));
        }
   useEffect(()=>{
    if(error){
        toast.error(error);
        dispatch(clearErrors());
    }
    if(message){
        toast.success(message);
    }
   },[error,message,dispatch])
        
  return (
  <Fragment>
    {loading?<Loader/>:(
        <Fragment>
              <div className={styles.componentWrapper}>
    <div className={styles.head}>

        <div className={styles.background}>
            <div class={styles.shape}></div>
            <div class={styles.shape}></div>
        </div>   
        
    <form onSubmit={HandleSubmit} className={styles.loginForm} encType='multipart/form-data' style={{height:"400px"}}>
        <h3 >Forgot Password</h3>
         
        <div>
            <MailOutlineIcon/>
        <input className={styles.Logininput} type='text' placeholder='Email' name='email' required value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
      </div>
      <button type='submit' className={styles.Loginbutton}>Send</button>
    </form>
</div>
</div>
        </Fragment>
    )}
  </Fragment>
  )
}

export default ForgotPassword