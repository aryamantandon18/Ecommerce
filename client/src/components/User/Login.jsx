import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css'
import { useSelector,useDispatch } from 'react-redux';
import { login } from '../../actions/userActions';
import { CLEAR_ERRORS } from '../../constants/userConstant';
import toast from 'react-hot-toast';
import Loader from '../layouts/loader/Loader';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';



const Login = () => {
    const[show,setShow] = useState(false)
    const navigate = useNavigate();
    const emailElement = useRef();
    const passwordElement = useRef();
    const dispatch = useDispatch();
    const {error,loading,isAuthenticated} = useSelector(state=>state.user);
    
    const HandleSubmit =(e)=>{
         e.preventDefault();
        const email = emailElement.current.value;
        const password = passwordElement.current.value;
        dispatch(login(email,password));
    }
    useEffect(()=>{
      if(isAuthenticated==false) return
        if(error){
        toast.error(error);
         dispatch({type:CLEAR_ERRORS});
         return;
        }   
        if(isAuthenticated){
            navigate("/");
        }
    },[dispatch,error,isAuthenticated,navigate]);

  return (
    <Fragment>
        {loading?<Loader/>:(
           <div className={styles.loginBody}>
             <div class={styles.center}>
            <h1>Login Here</h1>
            <form onSubmit={HandleSubmit}>
              <div class={styles.inputbox}>
                <input type="text" required="required" id='username' ref={emailElement} />
                <span>Email</span>
              </div>
              <div class={styles.inputbox}>
                <input required="required" type={show ? 'text' : 'password'} id='password' ref={passwordElement} />
                <span>Password</span>
              </div>
            <div className={styles.eye}>  <IconButton 
                 aria-label="toggle password visibility"
                 onClick={() => setShow(!show)}
                 >
                 {show? <VisibilityOff /> : <Visibility />}
               </IconButton></div>
              <div class={styles.inputbox}>
                <input type="submit" value="submit"/> 
              </div>
              <Link to="/register" className={styles.loginLink}> don't have an accout? SignUp</Link>
            </form>
          </div>
           </div>
        )}
    </Fragment>
    
  )
}

export default Login