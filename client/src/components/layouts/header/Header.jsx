import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Menu, Close } from '@mui/icons-material';
import { AppContext } from '../../..';
import UserOptions from './UserOptions';
import { getProduct } from '../../../actions/productActions';
import toast from 'react-hot-toast';
import logo from './flipkart.png';
import { logout } from '../../../actions/userActions';

const Header = () => {
  const { currentPage, setCurrentPage, price, rating, category, setCategory, finalKeyword, setFinalKeyword } = useContext(AppContext);
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();  // Use the location object to detect route changes
  const [keyword, setKeyword] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setCategory('');
      setFinalKeyword(keyword);
      setCurrentPage(1);
      navigate(`/products`);
    } else {
      navigate(`/`);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
    }
    dispatch(getProduct(finalKeyword, currentPage, price, rating, category));
    setKeyword('');
  }, [dispatch, finalKeyword, currentPage, error, price, rating, category]);

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
    <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-md">
      <nav className="flex items-center justify-between py-4 px-4 md:px-6 max-w-screen-xl mx-auto">
        {/* Logo and Site Name */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <h2 className="text-lg md:text-2xl font-bold text-yellow-300">
            <span className="font-bold">Shop</span>kart
          </h2>
        </Link>

        {/* Search Bar */}
        <form onSubmit={searchHandler} className="relative flex-grow max-w-xs md:max-w-md mx-4 hidden md:block">
          <input
            type="text"
            placeholder="Search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full py-2 px-4 rounded-full border-2 border-blue-400 outline-none transition duration-200 ease-in-out transform hover:scale-105 focus:border-blue-600"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
        </form>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-yellow-300 transition-colors">Home</Link>
          <Link to="/products" className="text-white hover:text-yellow-300 transition-colors">Products</Link>
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="text-white hover:text-yellow-300 transition-colors">Cart</Link>
              <Link to="/orders" className="text-white hover:text-yellow-300 transition-colors">Orders</Link>
              <Link to="/admin/dashboard" className="text-white hover:text-yellow-300 transition-colors">Dashboard</Link>
              <Link to="/" onClick={()=>logoutUser()} className="text-white hover:text-yellow-300 transition-colors">Logout</Link>
              <UserOptions user={user} top={7} left={16}/>
              
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-yellow-300 transition-colors">Login</Link>
              <Link to="/register" className="text-white hover:text-yellow-300 transition-colors">Sign Up</Link>
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
              <Link to="/admin/dashboard" className="text-white py-2"  >Dashboard</Link>
              <Link to="/" onClick={() => logoutUser()} className="text-white py-2">Logout</Link>
                <UserOptions user={user} top={10} left={16} noOptions={true}/>
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
