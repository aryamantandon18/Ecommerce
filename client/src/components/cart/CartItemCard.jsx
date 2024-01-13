import React from 'react'
import { Link } from 'react-router-dom'
import './CartItemCard.css'

const CartItemCard = ({item,deleteCartItem}) => {
  return (
   <div className="CartItemCard">
    <img src={item.image} alt="Product Image"/>
    <div>
        <Link to={`/products/${item.product}`}>{item.name}</Link>
        <span>{`Price: ₹${item.price}`}</span>
        <p onClick={()=>deleteCartItem(item.product)}>Remove</p>
    </div>
   
   </div>
  )
}

export default CartItemCard