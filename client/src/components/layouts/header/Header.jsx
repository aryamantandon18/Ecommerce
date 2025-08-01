import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Menu, Close } from '@mui/icons-material';
import { AppContext, server } from '../../..';
import UserOptions from './UserOptions';
import { getProduct } from '../../../actions/productActions';
import toast from 'react-hot-toast';
import logo from '../../../assets/images/ecommerceLogo.png';
import { logout } from '../../../actions/userActions';
import LanguageSwitcher from './LanguageSwitcher';
import axios from 'axios';

const Header = () => {
  const {setFinalKeyword} = useContext(AppContext);
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();  // Use the location object to detect route changes
  const [keyword, setKeyword] = useState('');
  const [suggestions,setSuggestions] = useState([]);
  const [showSuggestions,setShowSuggestions] = useState(false);
  const debounceTimeout = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setFinalKeyword(keyword);
      setKeyword('');
      navigate(`/products`);
      setSuggestions([]);
    } else {
      navigate(`/`);
    }
  };


  const fetchSuggestions = async(query)=>{
    try {
      const {data} = await axios.get(`${server}/products/suggestions?keyword=${query}`);
      setSuggestions(data.products || []);
    } catch (error) {
      console.error("Error fetching products for searchbar: ",error);
      setSuggestions([]);
    }
  }

  useEffect(()=>{
    if(!keyword.trim()){
      setSuggestions([]);
      return;
    }
    if(debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(()=>{
      fetchSuggestions(keyword);
    },300);

    return () => clearTimeout(debounceTimeout.current);
  },[keyword]);
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setMenuOpen(false);  
    console.log("Route changed, closing the menu!");
  }, [location]);

  function logoutUser() {
    dispatch(logout());
    toast.success("Logged out successfully");
  }


  return (
    <header className="fixed top-0 w-[100%] z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-md">
      <nav className="relative flex items-center justify-between py-4 px-4 md:px-6 w-full h-16 md:h-[70px]">

        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-11 w-auto"  />
          <h2 className="text-lg md:text-3xl font-bold text-yellow-300">
            <span className="font-bold">Shop</span>Bazar
          </h2>
        </Link>

        {/* Search Bar */}
        <form className=" relative flex-grow max-w-md md:max-w-xl mx-4 hidden md:block"
            onSubmit={searchHandler}
        >
          <input
            type="text"
            placeholder="Search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full py-2 px-4 rounded-full border-2 border-blue-400 outline-none transition duration-200 ease-in-out transform hover:scale-105 focus:border-blue-600 "
            onFocus={()=>setShowSuggestions(true)}
            onBlur={()=>setTimeout(()=>{
              setShowSuggestions(false)
            },300)
            }
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
          {
           showSuggestions && suggestions.length>0 &&(
              <ul className="absolute top-full left-0 right-0 bg-white border rounded shadow-md mt-1 z-50 max-h-64 overflow-y-auto">
                {suggestions.map((name,idx)=>(
                  <li
                    key={idx}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={(e)=>{
                      e.preventDefault();
                      e.stopPropagation();
                      setKeyword(name);
                      setFinalKeyword(name);
                      navigate('/products');
                      setSuggestions([]);
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )
          }
        </form>

        {/* Desktop Links */}
        <div className={` hidden md:flex items-center space-x-6 text-lg h-[100%] ${isAuthenticated ? "mr-2" : "mr-0"}`} >
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="nav-link">Cart</Link>
              <Link to="/orders" className="nav-link">Orders</Link>
              {user?.role==="Admin" && <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>}
              <Link to="/" onClick={()=>logoutUser()} className="nav-link">Logout</Link>
              <LanguageSwitcher/>
              <UserOptions user={user} top={7} right={16}/>
              
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white md:hidden">
          <Menu />
        </button>

        {/* Mobile Menu Background Overlay */}
        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)} // Close sidebar on overlay click
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
          />
        )}

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`fixed inset-y-0 right-0 w-64 bg-blue-700 shadow-lg z-50 md:hidden transform transition-all duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col h-full p-4">
            <button onClick={() => setMenuOpen(false)} className="self-end text-white mb-8 text-2xl">
              <Close />
            </button>
            <Link to="/" className="text-white py-2"  onClick={() => { setMenuOpen(false); }}>Home</Link>
            <Link to="/products" className="text-white py-2"  onClick={() => { setMenuOpen(false); }}>Products</Link>
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="text-white py-2"  onClick={() => { setMenuOpen(false); }}>Cart</Link>
                <Link to="/orders" className="text-white py-2"  >Orders</Link>
              {user?.role==="Admin" && <Link to="/admin/dashboard" className="text-white py-2"  >Dashboard</Link>}
              <Link to="/" onClick={() => logoutUser()} className="text-white py-2">Logout</Link>
                <UserOptions user={user} onMobile={true}/>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white py-2"  onClick={() => { setMenuOpen(false); }}>Login</Link>
                <Link to="/register" className="text-white py-2" onClick={() => { setMenuOpen(false); }}>Signup</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
