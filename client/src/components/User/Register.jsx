import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux';
import { register } from '../../actions/userActions';
import styles from './Register.module.css'
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CLEAR_ERRORS } from '../../constants/productConstants';

const Register = () => {
    const[show,setShow] = useState(false);
    const[avtarPreview,setAvtarPreview]=useState('/Profile.png');
    const [avtar,setAvtar] = useState('/Profile.png');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {error,loading,isAuthenticated} = useSelector(state=>state.user);
    const [user,setUser]=useState({
        name:"",
        email:"",
        password:"",
    }); 
    const {name,email,password} = user;

    const HandleSubmit=(e)=>{
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name",name);
        myForm.set("email",email);
        myForm.set("password",password);
        myForm.set("avatar",avtar);
        dispatch(register(myForm));
        
    }
    
    const registerUserHandler=(e)=>{
        if(e.target.name==='avtar'){
            const reader = new FileReader();
            reader.onload=()=>{
                if(reader.readyState=== 2){
                    setAvtarPreview(reader.result);
                    setAvtar(reader.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        else{
            setUser({...user,[e.target.name]:e.target.value })
        }
    }

    useEffect(()=>{
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
    <div className={styles.componentWrapper}>
    <div className={styles.head}>

        <div className={styles.background}>
            <div class={styles.shape}></div>
            <div class={styles.shape}></div>
        </div>   
        
    <form onSubmit={HandleSubmit} className={styles.loginForm} encType='multipart/form-data'>
        <h3 style={{lineHeight:"0px"}}>Register Here </h3>
        {/* <label htmlFor='username'>Name</label> */}
        <input className={styles.Logininput} type='text' placeholder='Username' id='username' name='name' required value={name} onChange={registerUserHandler}/>

        {/* <label htmlFor='username'>Email</label> */}
        <input className={styles.Logininput} type='text' placeholder='Email' id='username' name='email' required value={email} onChange={registerUserHandler}/>

        {/* <label htmlFor='password'>Password</label>              */}
        

        <div className={styles.pswd}>
        <input className={styles.Logininput} type= {show?'text':'password'} placeholder='Password' id='password'name='password' onChange={registerUserHandler} value={password} required/>
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShow(!show)}
              >
                {show? <VisibilityOff /> : <Visibility />}
            </IconButton>
              </div>

        <div className={styles.avtar}>
         <img className={styles.img} src={avtarPreview} alt='AvtarImage'/>   
        <input type='file' name='avtar' accept='image/*' id='profile' onChange={registerUserHandler}/>
        </div>

        <button type='submit' className={styles.Loginbutton}>Sign Up</button>
        <div className={styles.social}>
            <div className={styles.go}>Google</div>
            <div className={styles.fb}>Facebook</div>
        </div>
    </form>
</div>
</div>
  )
}

export default Register

