import React, { Fragment, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css'
import { useSelector,useDispatch } from 'react-redux';
import { login } from '../../actions/userActions';
import { CLEAR_ERRORS } from '../../constants/userConstant';
import toast from 'react-hot-toast';
import Loader from '../layouts/loader/Loader';


const Login = () => {
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
        if(error){
         dispatch({type:CLEAR_ERRORS});
         toast.error(error);
         return;
        }   
        if(isAuthenticated){
            navigate("/");
        }
    },[dispatch,error,isAuthenticated]);

  return (
    <Fragment>
        {loading?<Loader/>:(
            <div className={styles.componentWrapper}>
              <div className={styles.head}>

              <div className={styles.background}>
                  <div class={styles.shape}></div>
                  <div class={styles.shape}></div>
              </div>   
              
          <form onSubmit={HandleSubmit} className={styles.loginForm}>
              <h3>Login Here</h3>
              {/* <label htmlFor={styles.username}>Email</label> */}
              <input className={styles.Logininput} type='text' placeholder='Email' id='username' ref={emailElement} required/>
      
              {/* <label htmlFor='password'>Password</label> */}
              <input className={styles.Logininput} type='password' placeholder='Password' id='password' ref={passwordElement} required/>
              
              <Link to="" className={styles.fp}>Forgot Password?</Link>
              <button type='submit' className={styles.Loginbutton}>Login</button>
              <div className={styles.social}>
                  <div className={styles.go}>Google</div>
                  <div className={styles.fb}>Facebook</div>
              </div>
              <Link to="/register" className={styles.link}> don't have an accout? SignUp</Link>
          </form>
      </div>
      </div>
        )}
    </Fragment>
    
  )
}

export default Login