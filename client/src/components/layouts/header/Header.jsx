import React, { useContext, useEffect, useRef, useState } from 'react'
// import {ReactNavbar} from "overlay-navbar";
import './header.css'
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector } from 'react-redux';
import UserOptions from './UserOptions';
import logo from './flipkart.png'
import { FaBars, FaTimes } from "react-icons/fa";
import { getProduct } from '../../../actions/productActions';
import toast from 'react-hot-toast';
import './search.css'
import { IoIosSearch } from 'react-icons/io';
import { AppContext } from '../../..';

const Header = () => {
  const { currentPage, setCurrentPage, price, rating,category, setCategory,finalKeyword,setFinalKeyword } = useContext(AppContext);
  const dispatch = useDispatch();
  const {error} = useSelector((state)=>state.products);
 
  const navigate = useNavigate();
  const [keyword,setKeyword] = useState(''); 

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
        setCategory("");
        setFinalKeyword(keyword); // Update the context with the current keyword
        setCurrentPage(1); // Reset to the first page on new search
        navigate(`/products`);
    } else {
        navigate(`/`);
    }
};


    useEffect(()=>{
      if(error) {return toast.error(error);}
      dispatch(getProduct(finalKeyword,currentPage,price,rating,category));
      setKeyword("");
    },[dispatch,finalKeyword,currentPage,error,price,rating,category])

 const navRef = useRef();
  const {isAuthenticated,user} =  useSelector(state=>state.user);
  const showNavbar =()=>{
    if (navRef.current) {
      navRef.current.classList.toggle('responsiveNav');
    }
  }   
  if(!isAuthenticated){
  
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


  // className='w-full flex justify-center py-2 font-sans text-xl hover:font-bold focus:font-bold font-semibold border-b-2 border-gray-600 focus:bg-[#0000ff9e]
  //           active:bg-[#0000ff9e]'




