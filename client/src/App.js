import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/App.scss";
import Header from "./components/layouts/header/Header.jsx";
import { useEffect} from "react";
import webFont from "webfontloader";
import Footer from "./components/layouts/footer/Footer.jsx";
import Home from "./components/Home/Home";
import { Toaster } from "react-hot-toast";
import ProductDetails from "./components/product/productDetails.js";
import Products from "./components/product/Products.jsx";
import Login from "./components/User/Login.jsx";
import Register from "./components/User/Register.jsx";
import store from "./store.js";
import { loadUser } from "./actions/userActions.js";
import Profile from "./components/User/Profile.jsx";
import ProtectedRoute from "./components/Routes/ProtectedRoute.jsx";
import UpdateProfile from "./components/User/UpdateProfile.jsx";
import UpdatePassword from "./components/User/UpdatePassword.jsx";
import ForgotPassword from "./components/User/ForgotPassword.jsx";
import ResetPassword from "./components/User/ResetPassword.jsx";
import Cart from "./components/cart/Cart.jsx";
import Shipping from "./components/cart/Shipping.jsx";
import ConfirmOrder from "./components/cart/ConfirmOrder.jsx";
import Payment from "./components/cart/Payment.jsx";
import { useSelector } from "react-redux";
// import axios from "axios";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./components/cart/OrderSuccess.jsx";
import ElementLayout from "./ElementLayout.js";
import MyOrders from "./components/Order/MyOrders.js";
import OrderDetails from "./components/Order/OrderDetails.js";
import Dashboard from './components/Admin/Dashboard.jsx'
import NewProduct from "./components/Admin/NewProduct.jsx";
import ProductList from "./components/Admin/ProductList.jsx";
import UserOptions from "./components/layouts/header/UserOptions.jsx";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    webFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
  }, []);

  

  return (
    <Router>
      <Header />
     { console.log("Is use Loggeding checking authentication",isAuthenticated)}
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        {/* <Route path="/sad" element={<Loader/>} /> */}
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/account" element={<Profile/>}/> */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/me/update" element={<UpdateProfile />} />
        <Route path="/password/update" element={<UpdatePassword />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        
        <Route path="/shipping" element={<Shipping />} />

        <Route path="/process/payment" element={<Payment />} />
        
        <Route path="/success" element={<OrderSuccess />} />
        <Route path="/orders" element={<MyOrders />} />

        <Route path="/order/confirm" element={<ConfirmOrder />} />
        <Route path="/order/:id"  element={<OrderDetails/>}/>

        <Route path="/admin/dashboard" element={<Dashboard/>}/>

        <Route path="/admin/products" element={<ProductList/>}/>
        <Route path="/admin/product" element={<NewProduct/>}/>

         </Routes>

      <Footer />
      <Toaster />
    </Router>
  );
}

export default App;

{
  /* <Route path="/products/:keyword" element={<Products/>} /> */
}
{
  /* <Route path="/search" element={<Search/>} />     */
}
// <ProtectedRoute exact path="/account" component={Profile} />
// <Route path="/account" element={<ProtectedRoute element={<Profile />} />}/>
{
  /* <Route path="/me/update"   element={<ProtectedRoute element={<UpdateProfile/>}/>}   /> */
}

{
  /* {stripeApiKey && (
      <Route element={<ElementLayout stripe={loadStripe(stripeApiKey)} />} >
      <Route path="/process/payment" element={<Payment />} />
      </Route>
    )} 
    rzp_test_vHbrgp2hw5L3bw  
    soCTLJsoOBir0aWxLAOFwA4v
    */
}
  {/* <Route path="/order/:id" element={<OrderDetails/>} /> */}