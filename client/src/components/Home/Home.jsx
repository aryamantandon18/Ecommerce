import React, { Fragment, useEffect } from 'react'
import MetaData from '../layouts/MetaData.js'
import {CgMouse} from 'react-icons/cg';
import { ProductCard } from './ProductCard';
import './Home.scss'
import{ getProduct} from '../../actions/productActions.js'
import {useSelector,useDispatch} from 'react-redux'
import Loader from '../layouts/loader/Loader.jsx';
import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// const products =[
//   {
//    name: "Paper Bag",
//    images:[{url:"https://cdn.pixabay.com/photo/2018/11/24/22/34/bag-3836460_640.jpg"}],
//    price:"₹200",
//    id:"Aryaman",
//  },
//  {
//    name: "Smartcraft Bamboo Coffee Cup",
//    images:[{url:"https://m.media-amazon.com/images/I/31xtKpIk1BL.jpg"}],
//    price:"₹149",
//    id:"Aryaman",
//  },
//  {
//    name: "Bamboo Brush",
//    images:[{url:"https://images.pexels.com/photos/7262938/pexels-photo-7262938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}],
//    price:"₹200",
//    id:"Aryaman",
//  },
//  {
//    name: "Paper straws",
//    images:[{url:"https://images.pexels.com/photos/3018819/pexels-photo-3018819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}],
//    price:"₹200",
//    id:"Aryaman",
//  },
//  {
//    name: "Wooden Comb",
//    images:[{url:"https://images.unsplash.com/photo-1590159763121-7c9fd312190d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHdvZGRlbiUyMGNvbWJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"}],
//    price:"₹200",
//    id:"Aryaman",
//  },
//  {
//    name: "GUNEE Ecofriendly Handicraft Cane Bar Stool Mudda Chair",
//    images:[{url:"https://m.media-amazon.com/images/I/916XUiUB65L._SX522_.jpg"}],
//    price:"₹200",
//    id:"Aryaman",
//  },
//  {
//    name: "Hero Lectro Clix 26T SS Single Speed Electric Cycle",
//    images:[{url:"https://m.media-amazon.com/images/I/814S6OTdWTL._SX679_.jpg"}],
//    price:"₹200",
//    id:"Aryaman",
//  },
//  {
//    name: "PRAKRUTIK Garbage Bags Biodegradable",
//    images:[{url:"https://m.media-amazon.com/images/I/81GKnoixdNL._SX522_.jpg"}],
//    price:"₹200",
//    id:"Aryaman",
//  },{
//    name: "LED Bulb",
//    images:[{url:"https://b-cap.eu/wp-content/uploads/b-cap-046135796036-768x768.jpg"}],
//    price:"₹200",
//    id:"Aryaman",
//  },
//  {
//    name: "Bamboo Cutlery Travel kit",
//    images:[{url:"https://cdn.shopify.com/s/files/1/0512/4823/4660/products/happy_4_1024x10242x0.png?v=1607803142"}],
//    price:"₹200",
//    id:"Aryaman",
//  }
//  ]
 
 const Home = () => {
  const {loading,error,products} = useSelector((state)=>state.products);
  //  const{isAuthenticated} = useContext(Context);
  
   const dispatch = useDispatch();
   useEffect(()=>{
    if(error){
      return toast.error(error.message);
    }
    dispatch(getProduct());
   },[dispatch,error]);

   return (
     <Fragment>
     { loading ? (
     <Loader/>
     ):(
      <Fragment>
      <MetaData title="ECOMMERCE" />
 
 <div className="banner">
   <p>Welcome to Ecohub Ecommerce</p>
   <h1>FIND AMAZING PRODUCTS BELOW</h1>

   <a href='#container'>
     <button className='btn' onClick={()=>{}}>
       Scroll <CgMouse />
     </button>
     </a>
 
 </div>

 <h2 className="homeHeading">Featured Products</h2>

 <div className="container" id="container">
   {products &&
     products.map((product) => (
       <ProductCard key={product._id} product={product} />
     ))}
 </div>
 </Fragment>
     )}
 
        </Fragment>
    )}

export default Home
