import React, { Fragment, useEffect, useState  } from 'react'
import { useNavigate } from 'react-router-dom';
import  './UpdateProfile.css'
import { useSelector,useDispatch } from 'react-redux';
import { clearErrors, loadUser,updateProfile} from '../../actions/userActions';
import {UPDATE_PROFILE_RESET } from '../../constants/userConstant';
import toast from 'react-hot-toast';
import Loader from '../layouts/loader/Loader';

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
            if (user.avatar && user.avatar.url) {
                setAvtarPreview(user.avatar.url);
            }
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
         <div className="updatewrapper">
         <div className="updateHead">
     
             <div className="updateBg">
                 <div class="updateShape"></div>
                 <div class="updateShape"></div>
             </div>   
             
         <form onSubmit={HandleSubmit} className="updateForm" encType='multipart/form-data' style={{height:"440px"}}>
             <h3 style={{lineHeight:"0px"}}>Update Profile</h3>
             {/* <label htmlFor='username'>Name</label> */}
             <input className="updateInput" type='text' placeholder='Username' id='username' name='name' required value={name} onChange={(e)=>setName(e.target.value)}/>
     
             {/* <label htmlFor='username'>Email</label> */}
             <input className="updateInput" type='text' placeholder='Email' id='username' name='email' required value={email} onChange={(e)=>setEmail(e.target.value)}/>
     
             <div className="updateAvatar">
              <img className="updateImage"src={avtarPreview} alt='AvtarImage'/>   
             <input type='file' name='avatar' accept='image/*' id='profile' onChange={updateUserHandler}/>
             </div>
     
             <button type='submit' className="updateBtn">Update</button>
           
         </form>
     </div>
     </div>
     </Fragment>
    )}
   </Fragment>
  )
}

export default UpdateProfile