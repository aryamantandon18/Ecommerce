import React, { Fragment, useEffect, useState  } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { clearErrors, loadUser,updatePassword} from '../../actions/userActions';
import { CLEAR_ERRORS, UPDATE_PASSWORD_RESET } from '../../constants/userConstant';
import toast from 'react-hot-toast';
import Loader from '../layouts/loader/Loader';
import styles from './UpdatePassword.module.css'
import MetaData from '../layouts/MetaData';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';


   

const UpdatePassword = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {error,isUpdated,loading} = useSelector((state)=>state.profile);

    const [oldPassword,setOldPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
     
    const HandleSubmit=(e)=>{
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("oldPassword",oldPassword);
        myForm.set("newPassword",newPassword);
        myForm.set("confirmPassword",confirmPassword);
        dispatch(updatePassword(myForm));

    }

    useEffect(()=>{
    
        if(error){
            toast.error(error.message);
            dispatch(clearErrors());
        }
        if(isUpdated){
            toast.success("Password Updated SuccessFully");
            navigate("/account");
            dispatch({ type:UPDATE_PASSWORD_RESET})
        }
    },[dispatch,error,navigate,isUpdated]);

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
             <VpnKeyIcon /> 
             <input className={styles.Logininput} type='password' placeholder='Old Password' name='OldPassword' required value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)}/> </div>
        
            <div>
             <LockOpenIcon />
             <input className={styles.Logininput} type='password' placeholder='New Password' name='newPassword' required value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/> </div>
             
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

export default UpdatePassword;