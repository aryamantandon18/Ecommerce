import React, { Fragment, useEffect } from 'react'
import './Cart.css'
import CartItemCard from './CartItemCard.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { addItemsToCart , removeItemsFromCart} from '../../actions/cartActions.js'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { clearErrors } from '../../actions/productActions.js'

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {cartItems,error,isAuthenticated} = useSelector((state)=>state.cart);

  const increaseQuantity=(id,quantity,stock)=>{
      const newQnt = quantity + 1;
      if(quantity >= stock) {return;}
      dispatch(addItemsToCart(id,newQnt));
  }

  const decreaseQuantity=(id,quantity)=>{
    if(quantity <= 1) {return;}
  const newQnt = quantity - 1;
  dispatch(addItemsToCart(id,newQnt));
}
  const deleteCartProduct=(id)=>{
    dispatch(removeItemsFromCart(id));
  }

  // const redirect = location.search ? location.search.split("=")[1] : "/account"
  useEffect(()=>{
    if(error){
      toast.error(error);
      dispatch(clearErrors());
    }
    if(isAuthenticated){
      navigate("/account");
    }
  })
  const checkOut=()=>{
    navigate("/shipping");
  }

return (
   <Fragment>
    {cartItems.length === 0 ?(
      <div className="emptyCart">
        <RemoveShoppingCartIcon/>
        <Typography>No Product in your Cart</Typography>
        <Link to="/products">Continue Shopping</Link>
      </div>
    ):(
       <Fragment>
       <div className="cartPage bg-gray-50">
         <div className="cHeading">Your Cart</div>
       <div className="cHeader">
         <p>Product</p>
         <p>Quantity</p>
         <p>Total</p>
       </div>
       {cartItems && cartItems.map((item)=>(
          <div className="cartContainer" key={item.product}>
          <CartItemCard item={item} deleteCartItem={deleteCartProduct}/>
          <div className="cInput">
           <button onClick={()=>decreaseQuantity(item.product,item.quantity)}>-</button>
           <input type='number' value={item.quantity} readOnly/>
           <button onClick={()=>increaseQuantity(item.product,item.quantity,item.stock)}>+</button>
          </div>
          <p className='cartTotal'>
           {`₹${item.price * item.quantity}`}
          </p>
          <div className='separateLine'></div>
         </div>
       ))}
       <div className="grossTotal">
         <div></div>
         <div className="grossTotalBox">
           <p>Gross Total</p>
           <p>{`₹${cartItems.reduce((acc,item)=> acc + item.quantity*item.price,0)}`}</p>
         </div>
         <div></div>
         <div className="checkOutBtn">
           <button onClick={checkOut} className='bg-blue-500 hover:bg-blue-600 text-white'>Check Out</button>
         </div>
       </div>
       </div>
     </Fragment>
    )}
   </Fragment>
  )
}

export default Cart