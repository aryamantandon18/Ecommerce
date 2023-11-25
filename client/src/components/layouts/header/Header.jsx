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
import logo from '../../../images/logo.png'
import {ReactNavbar} from "overlay-navbar";
import "./styles.css";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../actions/userActions';
import UserOptions from './UserOptions';

const options = {
    burgerColorHover: "#eb4034",
    logo,
    logoWidth: "20vmax",
    navColor1: "white",
    logoHoverSize: "10px",
    logoHoverColor: "#eb4034",
    link1Text: "Home",
    link2Text: "Products",
    link3Text: "Login",
    link4Text: "About",
    link1Url: "/",
    link2Url: "/products",
    link3Url: "/login",
    link4Url: "/about",
    link1Size: "1.3vmax",
    link1Color: "rgba(35, 35, 35,0.8)",
    nav1justifyContent: "flex-end",
    nav2justifyContent: "flex-end",
    nav3justifyContent: "flex-start",
    nav4justifyContent: "flex-start",
    link1ColorHover: "#eb4034",
    link1Margin: "1vmax",
    profileIconUrl: "/login",
    profileIconColor: "rgba(35, 35, 35,0.8)",
    searchIconColor: "rgba(35, 35, 35,0.8)",
    cartIconColor: "rgba(35, 35, 35,0.8)",
    profileIconColorHover: "#eb4034",
    searchIconColorHover: "#eb4034",
    cartIconColorHover: "#eb4034",
    cartIconMargin: "1vmax",
  };


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
    <img className='img' src='https://tse2.mm.bing.net/th?id=OIP.N8lpFFzPlemdfTyTgwRSnwHaGX&pid=Api&P=0&h=180'/>
    <h1 className='heading'>Ecommerce</h1>
    </div>
  <div className='rightPart'>
  <ul>
      <li > <Link className='link' style={{textDecoration:"none"}} to="/">HOME</Link></li>
      <li > <Link className='link' style={{textDecoration:"none"}} to="/products">PRODUCTS</Link></li>
      {isAuthenticated? (
        <UserOptions user={user} />
      ):(
      <li > <Link className='link' style={{textDecoration:"none"}} to="/login">LOGIN</Link></li>)}
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