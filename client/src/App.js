import{BrowserRouter as Router,Route,Routes} from'react-router-dom'
import './styles/App.scss';
import Header from'./components/layouts/header/Header.jsx'
import { useEffect } from 'react';
import webFont from 'webfontloader'
import Footer from './components/layouts/footer/Footer.jsx'
import Home from './components/Home/Home'
import { Toaster } from 'react-hot-toast' 
import ProductDetails from './components/product/productDetails.js'
import Products from './components/product/Products.jsx'
import Login from './components/User/Login.jsx'
import Register from './components/User/Register.jsx';
import store from './store.js'
import { loadUser } from './actions/userActions.js';
import Profile from './components/User/Profile.jsx';
import ProtectedRoute from './components/Routes/ProtectedRoute.jsx';
import UpdateProfile from './components/User/UpdateProfile.jsx'
import UpdatePassword from './components/User/UpdatePassword.jsx'
function App() {
  
  useEffect(()=>{
    webFont.load({
      google:{
        families:['Roboto',"Droid Sans","Chilanka"],
      }
    })
    store.dispatch(loadUser());
    },[])

  return (
   <Router>
    <Header/>
   <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/products/:id" element={<ProductDetails/>} />
      {/* <Route path="/sad" element={<Loader/>} /> */}
      <Route path="/products" element={<Products/>} />
      <Route path ="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>} />
      <Route path="/account" element={<Profile/>}/>
      <Route path="/me/update" element={<UpdateProfile/>}/>
      <Route path="/password/update" element={<UpdatePassword/>}/>

      {/* <Route path="/products/:keyword" element={<Products/>} /> */}
      {/* <Route path="/search" element={<Search/>} />     */}
      {/* <Route path="/account" element={<ProtectedRoute element={<Profile />} />}/> */}
     {/* <Route path="/me/update"   element={<ProtectedRoute element={<UpdateProfile/>}/>}   /> */}
    
    </Routes>
    <Footer/>
    <Toaster/>
   </Router>
  );
}

export default App;
