// import { useState } from "react";
// import logo from "./logo.png";
// 

// const navItems = ["home", "settings", "backup", "mail", "cloud", "layers"];

// export const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   return (
//     <nav className={`sidebar ${isOpen ? "open" : ""}`}>
//       <div className="sidebar-inner">
//         <header className="sidebar-header">
//           <button
//             type="button"
//             className="sidebar-burger"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             <span className="material-symbols-outlined">
//               {isOpen ? "close" : "menu"}
//             </span>
//           </button>
//           <img src={logo} className="sidebar-logo" />
//         </header>
//         <nav className="sidebar-menu">
//           {navItems.map((item) => (
//             <button key={item} type="button" className="sidebar-button">
//               <span className="material-symbols-outlined">{item}</span>
//               <p>{item}</p>
//             </button>
//           ))}
//         </nav>
//       </div>
//     </nav>
//   );
// };
import React from 'react'
// import {ReactNavbar} from "overlay-navbar";
import "./styles.css";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../actions/userActions';
import UserOptions from './UserOptions';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import logo from './flipkart.png'

const Header = () => {
  const dispatch = useDispatch();

  const btnHandler=()=>{
    dispatch(logout()); 
  }

  const {isAuthenticated,user} =  useSelector(state=>state.user);
  return (
   <>
   <div className='navbar'>
    <div className='leftPart'>
      <img src={logo}/>
    <h1 className='heading'>Flipkart</h1>
    </div>
  <div className='rightPart'>
  <ul>
      <li > <Link className='link' style={{textDecoration:"none"}} to="/">HOME</Link></li>
      <li > <Link className='link' style={{textDecoration:"none"}} to="/products">PRODUCTS</Link></li>
      <li > <Link className='link' style={{textDecoration:"none"}} to={isAuthenticated?"/cart":"/login"}><div>
      <ShoppingCartIcon/>CART
        </div></Link></li>
        <li ><Link className='link' style={{textDecoration:"none"}} to="/login">
      {isAuthenticated? <UserOptions user={user} />:"LOGIN"} </Link></li>
    </ul>
  </div>
   </div>
   </>
  )
}

export default Header

     {/* <div className='dropdown'>
        <div>
        <Link>Dashboard</Link>
        <Link>cart</Link>
        <Link>xyz</Link>
        <Link>Logout</Link>
        </div>
      </div> */}
      
      {/*
    <> <li><Link className='link options' style={{textDecoration:"none"}}>OPTIONS</Link></li> */}
    {/* <li class="dropdown"> */}
    {/* <a href="#" class="link" style={{textDecoration:"none"}} >OPTIONS</a> */}
    {/* <img src={user.avatar.url? user.avatar.url : "/Profile.png"} alt='img'/>
    <div class="dropdown-content">
      {user.role==="admin"?<a href="#">Dashboard</a>:(null)}
      <a href="#">Service 2</a>
      <a href="#"><button style={{width:"100%", background:"white" , border:"none"}} onClick={btnHandler}>Logout</button></a>
    </div>
  </li>
      </> */}