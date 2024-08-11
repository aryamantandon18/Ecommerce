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
import React, { useEffect, useRef, useState } from 'react'
// import {ReactNavbar} from "overlay-navbar";
import './header.css'
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector } from 'react-redux';
// import { logout } from '../../../actions/userActions';
import UserOptions from './UserOptions';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import logo from './flipkart.png'
import { FaBars, FaTimes } from "react-icons/fa";
import { getProduct } from '../../../actions/productActions';
import { Button} from '@mui/material'
import toast from 'react-hot-toast';
import './search.css'
import { IoIosSearch } from 'react-icons/io';

const Header = () => {
  // const dispatch = useDispatch();

  // const btnHandler=()=>{
  //   dispatch(logout()); 
  // }
  const dispatch = useDispatch();
  const [currentPage,setCurrentPage] = useState(1);
  const [price,setPrice] = useState([0,50000]);
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const {products,loading,error,productsCount,resultPerPage} = useSelector((state)=>state.products);
  const [finalKeyword,setFinalKeyword] = useState();
  const navigate = useNavigate();
  const [keyword,setKeyword] = useState(''); 

    const searchHandler= (e)=>{
        e.preventDefault();
        if(keyword.trim()){
        navigate(`/products`);
        }
        else{
            navigate(`/`);
        }
    }

    useEffect(()=>{
      if(error) {return toast.error(error);}
      dispatch(getProduct(finalKeyword,currentPage,price,rating,category));
    },[dispatch,finalKeyword,currentPage,error,price,rating,category])

 const navRef = useRef();
  const {isAuthenticated,user} =  useSelector(state=>state.user);
  const showNavbar =()=>{
    if (navRef.current) {
      navRef.current.classList.toggle('responsiveNav');
    }
  }   
  if(!isAuthenticated){
    console.log(isAuthenticated ," ???????");
  
  return (
    <>
     <div className='header z-10'>
     
      <h2 className='h2 font-sans font-semibold absolute'><span className='font-bold text-yellow-300'>Shop</span>kart</h2>
       <nav className='max-w-screen  font-serif w-screen flex items-center justify-between  shadow-2xl shadow-gray'>
       <img src={logo} className='h-20 ml-4'/>
       <div>
       <form className="flex relative items-center w-10/12 md:w-[200%] h-[6vh] mx-auto rounded-xl" onSubmit={searchHandler}>
         <input
           type="text"
           placeholder="Search"
           onChange={(e) => setKeyword(e.target.value)}
           value={keyword}
           className="shadow-sm bg-white border-none text-gray-700 p-[1vmax] w-full outline-none h-8 text-[1.1vmax] font-light font-sans rounded-xl border-blue-400 border-2" />
         <IoIosSearch className='text-black absolute right-2'/>
        </form>
       </div>
           <div className='flex justify-end mr-5' ref={navRef}>
               <Link className='md:mx-10 font-sans md:hover:underline md:underline-offset-[33px] text-xl md:hover:font-bold md:focus:font-bold md:font-semibold' to="/" onClick={showNavbar}>Home</Link>
               <Link className='md:mx-10 font-sans md:hover:underline md:underline-offset-[33px] text-xl md:hover:font-bold md:focus:font-bold md:font-semibold' to="/products" onClick={showNavbar}>Products</Link>
               <Link className='md:mx-10 font-sans md:hover:underline md:underline-offset-[33px] text-xl md:hover:font-bold md:focus:font-bold md:font-semibold' to="/login" onClick={showNavbar}>Login</Link>
               <Link className='md:mx-10 font-sans md:hover:underline md:underline-offset-[33px] text-xl md:hover:font-bold md:focus:font-bold md:font-semibold' to="/register" onClick={showNavbar}>signUp</Link>
               <button className='navBtn navCloseBtn ' onClick={showNavbar}>
       <FaTimes/>
       </button> 
           </div>
           <button className='navBtn openBtn mx-12 text-2xl ' onClick={showNavbar}>
       <FaBars/>
     </button>
       </nav>
       </div>
    </>
   )
  }

return (
    <div className='header z-10 shadow-lg'>
      <h2 className='h2 font-sans font-semibold absolute '><span className='font-bold text-yellow-400'>Shop</span>kart</h2>
    <nav className=' max-w-screen font-serif w-screen flex items-center justify-between shadow-2xl shadow-gray'>
   <div className="relative ">
  <UserOptions user={user} className="h-[9vh]"/>

</div>
       <div>
       <form className="flex relative items-center w-10/12 md:w-[200%] h-[6vh] mx-auto rounded-xl" onSubmit={searchHandler}>
         <input
           type="text"
           placeholder="Search"
           onChange={(e) => setKeyword(e.target.value)}
           value={keyword}
           className="shadow-sm bg-white border-none text-gray-700 p-[1vmax] w-full outline-none h-8 text-[1.1vmax] font-light font-sans rounded-xl border-blue-400 border-2" />
         <IoIosSearch className='text-black absolute right-2'/>
        </form>
       </div>


        <div className='flex justify-end mr-5' ref={navRef}>
            <Link className='md:mx-10 font-sans md:hover:underline md:underline-offset-[33px] text-xl md:hover:font-bold md:focus:font-bold md:font-semibold' to="/" onClick={showNavbar}>Home</Link>
            <Link className='md:mx-10 font-sans md:hover:underline md:underline-offset-[33px] text-xl md:hover:font-bold md:focus:font-bold md:font-semibold' to="/products" onClick={showNavbar}>Products</Link>
            <Link className='md:mx-10 font-sans md:hover:underline md:underline-offset-[33px] text-xl md:hover:font-bold md:focus:font-bold md:font-semibold' to="/cart" onClick={showNavbar}>Cart</Link>
            
            <button className='navBtn navCloseBtn ' onClick={showNavbar}>
      <FaTimes/>
      </button> 
        </div>
        <button className='navBtn openBtn mx-7 text-xl ' onClick={showNavbar}>
      <FaBars/>
    </button>
    </nav>
  
    </div>
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


  // className='w-full flex justify-center py-2 font-sans text-xl hover:font-bold focus:font-bold font-semibold border-b-2 border-gray-600 focus:bg-[#0000ff9e]
  //           active:bg-[#0000ff9e]'