import React, { Fragment, useEffect, useState  } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import  './UpdateProfile.css'
import { useSelector,useDispatch } from 'react-redux';
import { clearErrors, loadUser,updateProfile} from '../../actions/userActions';
import { CLEAR_ERRORS, UPDATE_PROFILE_RESET } from '../../constants/userConstant';
import toast from 'react-hot-toast';
import Loader from '../layouts/loader/Loader';
import styles from './Login.module.css'

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector(state=>state.user);
    const {error,isUpdated,loading} = useSelector((state)=>state.profile);

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");

    const[avtarPreview,setAvtarPreview]=useState('/Profile.png');
    const [avatar,setAvtar] = useState('/Profile.png');

    
     
    const updateUserHandler=(e)=>{
       
            const reader = new FileReader();
            reader.onload=()=>{
                if(reader.readyState=== 2){
                    setAvtarPreview(reader.result);
                    setAvtar(reader.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
    
    
    }

    const HandleSubmit=(e)=>{
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name",name);
        myForm.set("email",email);
        myForm.set("avatar",avatar);
        dispatch(updateProfile(myForm));

    }

    useEffect(()=>{
        if(user){
            setName(user.name);
            setEmail(user.email);
            setAvtarPreview(user.avatar.url)
        }
        if(error){
            toast.error(error.message);
            dispatch(clearErrors());
        }
        if(isUpdated){
            toast.success("Profile Updated SuccessFully");
            dispatch(loadUser());
            navigate("/account");
            dispatch({ type:UPDATE_PROFILE_RESET})
        }
    },[dispatch,error,navigate,user,isUpdated]);
  return (
   <Fragment>
    {loading?<Loader/>:(
         <Fragment>
         <div className={styles.componentWrapper}>
         <div className={styles.head} >
     
             <div className={styles.background}>
                 <div class={styles.shape}></div>
                 <div class={styles.shape}></div>
             </div>   
             
         <form onSubmit={HandleSubmit} className={styles.loginForm} encType='multipart/form-data' style={{height:"440px"}}>
             <h3 style={{lineHeight:"0px"}}>Update Profile</h3>
             {/* <label htmlFor='username'>Name</label> */}
             <input className={styles.Logininput} type='text' placeholder='Username' id='username' name='name' required value={name} onChange={(e)=>setName(e.target.value)}/>
     
             {/* <label htmlFor='username'>Email</label> */}
             <input className={styles.Logininput} type='text' placeholder='Email' id='username' name='email' required value={email} onChange={(e)=>setEmail(e.target.value)}/>
     
             <div className={styles.avatar}>
              <img className={styles.img} src={avtarPreview} alt='AvtarImage'/>   
             <input type='file' name='avatar' accept='image/*' id='profile' onChange={updateUserHandler}/>
             </div>
     
             <button type='submit' className={styles.Loginbutton}>Update</button>
           
         </form>
     </div>
     </div>
     </Fragment>
    )}
   </Fragment>
  )
}

export default UpdateProfile