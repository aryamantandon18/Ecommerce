import React,{Fragment,useState} from 'react'
import  styles from './Shipping.module.css'
// import styles from './temp.module.css'
import { saveShippingInfo } from '../../actions/cartActions'
import { useDispatch,useSelector } from 'react-redux'
import PinDropIcon from '@mui/icons-material/PinDrop';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PublicIcon from '@mui/icons-material/Public';
import PhoneIcon from '@mui/icons-material/Phone';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import {Country,State} from 'country-state-city'
import MetaData from '../layouts/MetaData';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CheckOutSteps from './CheckOutSteps';
import TextField from '@mui/material/TextField';

const Shipping = () => {
    const {shippingInfo} = useSelector((state)=>state.cart);
    const [address,setAddress] = useState(shippingInfo.address);
    const [state,setState] = useState(shippingInfo.state);
    const [city,setCity] = useState(shippingInfo.city);
    const [phoneNo,setPhoneNo] = useState(shippingInfo.phoneNo);
    const [pinCode,setPinCode] = useState(shippingInfo.pinCode);
    const [country,setCountry] = useState(shippingInfo.country);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const HandleSubmit = (e)=>{
      e.preventDefault();
      if(phoneNo.length<10 || phoneNo.length>10){
        toast.error("Phone Number should be of 10 digits")
        return;
      }
      dispatch(
        saveShippingInfo({address,state,country,city,pinCode,phoneNo})
      )
      navigate("/order/confirm");
    }
  return (
    <Fragment>
      <CheckOutSteps activeStep={0}/>
      <MetaData title="Shipping Info"/>
      <div className={styles.shippingContainer}>
         {/* <div className={styles.head} >
              <div className={styles.background}>
                 <div class={styles.shape}></div>
                 <div class={styles.shape}></div>
             </div>   
             <div> */}
             <div className="shippingBox">
             <form onSubmit={HandleSubmit} className={styles.shippingForm} encType='multipart/form-data'>
             <h3 >Shipping Info</h3>

             <div>
             <HomeIcon /> 
             <input className={styles.Logininput} type='text' placeholder='Address' required value={address} onChange={(e)=>setAddress(e.target.value)}/> </div>
        
              <div>
             <LocationCityIcon/>
             <input className={styles.Logininput} type='text' placeholder='City'  required value={city} onChange={(e)=>setCity(e.target.value)}/> </div>
             
             <div>
             <PinDropIcon/>
             <input className={styles.Logininput} type='number' placeholder='Pin Code' required value={pinCode} onChange={(e)=>setPinCode(e.target.value)}/> </div>

             <div>
              <PhoneIcon/>
              <input className={styles.Logininput} type='number' size='10' placeholder='Phone Number' value={phoneNo} onChange={(e)=>setPhoneNo(e.target.value)} required />
             </div>

             <div>
              <PublicIcon/>
              <select
              className={styles.Logininput}
              required
              value={country}
              onChange={(e)=>setCountry(e.target.value)}
              >
              <option value=""  style={{color:"Black"}}>Country</option>
              {Country && Country.getAllCountries().map((item)=>(
                <option key={item.isoCode}  style={{color:"Black"}} value={item.isoCode}>{item.name}</option>
              )) }
              </select>
             </div>

            {Country && (
              <div>
                <TransferWithinAStationIcon/>
                <select required value={state} onChange={(e)=>setState(e.target.value)} className={styles.Logininput}>
                  <option>State</option>
                  {State && State.getStatesOfCountry(country).map((item)=>(
                    <option key={item.isoCode} style={{color:"Black"}} value={item.isoCode}>{item.name}</option>
                  ))}
                </select>
              </div>
            )}
         <button type='submit' className={styles.shippingBtn}>Update</button>
          
       </form>
       </div>
     </div>
    </Fragment>
  )
}

export default Shipping