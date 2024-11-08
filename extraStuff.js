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


// --------------------------------------------------------------------------------------
  //     <div className='navbar'>
  //   <div className='leftPart'>
  //     <img src={logo}/>
  //   <h1 className='heading'>Flipkart</h1>
  //   </div>
  // <div className='rightPart' >
  // <ul ref={navRef}>
  //     <li > <Link className='link' style={{textDecoration:"none"}} to="/">HOME</Link></li>
  //     <li > <Link className='link' style={{textDecoration:"none"}} to="/products">PRODUCTS</Link></li>
  //     <li > <Link className='link' style={{textDecoration:"none"}} to={isAuthenticated?"/cart":"/login"}>
  // <div>
  //     <ShoppingCartIcon/>CART
  // </div>
  //       </Link></li>
  //       <li ><Link className='link' style={{textDecoration:"none"}} to="/login">
  //     {isAuthenticated? <UserOptions user={user} />:"LOGIN"} </Link></li>
  //     <button className='navBtn navCloseBtn ' onClick={showNavbar}>
  //     <FaTimes/>
  //     </button> 
  //   </ul>
  //   <button className='navBtn openBtn mx-12 text-xl ' onClick={showNavbar}>
  //     <FaBars/>
  //   </button>
  // </div>
  //  </div>

  

// __________________________________________________________________
// import React from 'react'
// import logo from '../../../images/logo.png'
// import {ReactNavbar} from "overlay-navbar";

// const options = {
//     burgerColorHover: "#eb4034",
//     logo,
//     logoWidth: "20vmax",
//     navColor1: "white",
//     logoHoverSize: "10px",
//     logoHoverColor: "#eb4034",
//     link1Text: "Home",
//     link2Text: "Products",
//     link3Text: "Contact",
//     link4Text: "About",
//     link1Url: "/",
//     link2Url: "/products",
//     link3Url: "/contact",
//     link4Url: "/about",
//     link1Size: "1.3vmax",
//     link1Color: "rgba(35, 35, 35,0.8)",
//     nav1justifyContent: "flex-end",
//     nav2justifyContent: "flex-end",
//     nav3justifyContent: "flex-start",
//     nav4justifyContent: "flex-start",
//     link1ColorHover: "#eb4034",
//     link1Margin: "1vmax",
//     profileIconUrl: "/login",
//     profileIconColor: "rgba(35, 35, 35,0.8)",
//     searchIconColor: "rgba(35, 35, 35,0.8)",
//     cartIconColor: "rgba(35, 35, 35,0.8)",
//     profileIconColorHover: "#eb4034",
//     searchIconColorHover: "#eb4034",
//     cartIconColorHover: "#eb4034",
//     cartIconMargin: "1vmax",
//   };
// const Header = () => {
//   return (
//    <ReactNavbar {...options}/>
//   )
// }

// export default Header