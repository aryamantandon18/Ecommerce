import React, { Fragment, useEffect, useRef, useState } from "react";
import MetaData from "../layouts/MetaData";
import CheckOutSteps from "./CheckOutSteps";
import { useDispatch, useSelector } from "react-redux";

// import { Typography } from "@mui/material";
// import CreditCardIcon from "@mui/icons-material/CreditCard";
// import EventIcon from "@mui/icons-material/Event";
// import VpnKeyIcon from "@mui/icons-material/VpnKey";
import toast from "react-hot-toast";
import { clearErrors, createOrder } from "../../actions/orderAction.js";
import "./payment.css";
// import Shipping from "./Shipping";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

 
  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100), //bcoz stripe will take amount only in paise
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subTotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.sippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;

    try {

      const { data:{razorpayApiKey} } = await axios.get("/razorpayapikey");
      console.log(razorpayApiKey);  

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      
      const { data } = await axios.post(
        "/payment/process",
        paymentData,
        config,
      );
      const id = data.myPayment.id;
      console.log(data);

      const options = {
        key: razorpayApiKey, // Enter the Key ID generated from the Dashboard
        amount: data.myPayment.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Aryaman",
       description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1

        handler:  function (response){
          //   axios.post('/payment/verification',{
          //   paymentId: response.razorpay_payment_id,
          //   orderId: response.razorpay_order_id,
          //  })
          //  .then((verificationResponse) => {
          //   console.log('Verification Response:', verificationResponse);
          //   // Handle the verification response
          //   if (verificationResponse.data.status === 'success') {
    
                order.paymentInfo={
                  id: id,
                  status: "Succeeded",
                };
              
              console.log("hello1")
              console.log(order);
              toast.success('Payment successful!');
              dispatch(createOrder(order)); //dispatching Action 
              console.log("hello2")
              navigate("/success");
            // } else {
            //   console.log( "verification DATA -> ", verificationResponse.data);
              // payBtn.current.disabled = false; 
            //   toast.error("Payment Unsuccessful");
            // }
          // })
          // .catch((error) => {
          //   console.error('Error verifying payment:', error);
          //   toast.error('Error verifying payment. Please try again later.');
          // });
        
          navigate("/success");
      },
        prefill: {
            name: user.name,
            email:  user.email,
            contact: shippingInfo.phoneNo,
        },
      notes: {
            "address": "Razorpay Corporate Office"
        },
        theme: {
            "color": "#3399cc"
        }
    };
    const razor = new window.Razorpay(options);
    razor.open();

 
    } catch (error) {
      payBtn.current.disabled = false;
      toast.error(error.message);        //The error object here is likely an Axios error object, which contains  properties like message, name, etc. The toast.error function might not be able to handle rendering this object directly.
    }
   };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckOutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={submitHandler}>
          {/* <Typography>Card Info</Typography> */}
          {/* <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div> */}
          <input
            type="submit"
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;


 //     const result = await stripe.confirmCardPayment(client_secret, {
  //       payment_method: {
  //         card: elements.getElement(CardNumberElement),
  //         billing_details: {
  //           name: user.name,
  //           email: user.email,
  //           address: {
  //             line1: shippingInfo.address,
  //             city: shippingInfo.city,
  //             state: shippingInfo.state,
  //             postal_code: shippingInfo.pinCode,
  //             country: shippingInfo.country,
  //           },
  //         },
  //       },
  //     });

  //     if (result.error) {
  //       payBtn.current.disabled = false;
  //       toast.error(error.message);
  //     } else {
  //       if (result.paymentIntent.status === "succeeded") {
  //         order.paymentInfo = {    //adding this new property in order object
  //           id: result.paymentIntent.id,
  //           status: result.paymentIntent.status,
  //         };

  //         dispatch(createOrder(order)); //dispatching Action
  //         navigate("/success");
  //       } else {
  //         toast.error("There's some issue while processing payment");
  //       }
  //     }
