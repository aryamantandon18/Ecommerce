import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import React, { useEffect, lazy, Suspense } from "react";
import webFont from "webfontloader";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import store from "./store.js";
import { loadUser } from "./actions/userActions.js";
import Loader from "./components/layouts/loader/Loader.jsx";

// Dynamically import components using lazy
const Header = lazy(() => import("./components/layouts/header/Header.jsx"));
const Footer = lazy(() => import("./components/layouts/footer/Footer.jsx"));
const ProductDetails = lazy(() => import("./components/product/productDetails.js"));
const Products = lazy(() => import("./components/product/Products.jsx"));
const Login = lazy(() => import("./components/User/Login.jsx"));
const Register = lazy(() => import("./components/User/Register.jsx"));
const Profile = lazy(() => import("./components/User/Profile.jsx"));
const ProtectedRoute = lazy(() => import("./components/Routes/ProtectedRoute.jsx"));
const UpdateProfile = lazy(() => import("./components/User/UpdateProfile.jsx"));
const UpdatePassword = lazy(() => import("./components/User/UpdatePassword.jsx"));
const ForgotPassword = lazy(() => import("./components/User/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./components/User/ResetPassword.jsx"));
const Cart = lazy(() => import("./components/cart/Cart.jsx"));
const Shipping = lazy(() => import("./components/cart/Shipping.jsx"));
const ConfirmOrder = lazy(() => import("./components/cart/ConfirmOrder.jsx"));
const Payment = lazy(() => import("./components/cart/Payment.jsx"));
const OrderSuccess = lazy(() => import("./components/cart/OrderSuccess.jsx"));
const MyOrders = lazy(() => import("./components/Order/MyOrders.js"));
const OrderDetails = lazy(() => import("./components/Order/OrderDetails.js"));
const Dashboard = lazy(() => import('./components/Admin/Dashboard.jsx'));
const NewProduct = lazy(() => import("./components/Admin/NewProduct.jsx"));
const ProductList = lazy(() => import("./components/Admin/ProductList.jsx"));
const UserOptions = lazy(() => import("./components/layouts/header/UserOptions.jsx"));
const OrderList = lazy(() => import("./components/Admin/OrderList.jsx"));
const UpdateProduct = lazy(() => import("./components/Admin/UpdateProduct.jsx"));
const AllUsers = lazy(() => import("./components/Admin/AllUsers.jsx"));
const Home = lazy(() => import("./components/Home/Home.jsx"));

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
      <Suspense fallback={<Loader/>}>
        <Header />
        {isAuthenticated && <UserOptions user={user} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/product" element={<NewProduct />} />
          <Route path="/admin/product/:id" element={<UpdateProduct />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/users" element={<AllUsers />} />
        </Routes>
        <Footer />
        <Toaster />
      </Suspense>
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
