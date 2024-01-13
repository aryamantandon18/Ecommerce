import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Typography } from '@mui/material';
import './orderSuccess.css'
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="orderSuccess">
        <CheckCircleIcon/>
        <Typography>Your Order has been Placed SuccessFully</Typography>
        <Link to="/orders">View Order</Link>
    </div>
  )
}

export default OrderSuccess