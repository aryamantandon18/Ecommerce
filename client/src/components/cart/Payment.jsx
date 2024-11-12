import React, { Fragment, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import MetaData from "../layouts/MetaData";
// import CheckOutSteps from "./CheckOutSteps";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { clearErrors, createOrder } from "../../actions/orderAction.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../index.js";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payBtn = useRef(null);
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const paymentData = { amount: Math.round(orderInfo.totalPrice * 100) };
  const order = { 
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subTotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice
    };

  // const containerVariants = {
  //   hidden: { opacity: 0, y: 50 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: { type: "spring", stiffness: 50, delay: 0.3 },
  //   },
  // };
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };
  
  
  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3 } },
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;

    try {
      const { data:{razorpayApiKey} } = await axios.get(`${server}/razorpayapikey`,{withCredentials:true});
      const config = {
        headers: {"Content-Type": "application/json"},
        withCredentials:true, // Ensures cookies are sent with request
      };

      const { data } = await axios.post(
        `${server}/payment/process`,
          paymentData,     // like amount 
          config,
      );
      const orderId = data.myPayment.id; // Retrieve razorpay order_id 
      // console.log(data);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const options =  {
          key: razorpayApiKey, // Enter the Key ID generated from the Dashboard
          amount: data.myPayment.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "Aryaman",
          description: "Test Transaction",
          image: "https://example.com/your_logo",
          order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
  
                 // Step 6: Handler function called when payment is successful
        handler: async function (response) {
          try {
            // Step 7: Send verification data to backend for server-side validation
            const verificationResponse = await axios.post(`${server}/payment/verification`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature, // Razorpay provides a signature to verify
                amount: data.myPayment.amount,
                totalPrice: orderInfo.totalPrice,
              },{
                withCredentials:true,
              }
            );
            
            console.log("Verification Response:", verificationResponse.data);

            // Step 8: Check if verification response from backend was successful
            if (verificationResponse.data.success) {
              order.paymentInfo = {
                id: orderId, // Store the order ID in the database
                status: "Succeeded",
              };

              console.log("Order after payment:", order);
              toast.success("Payment successful!");
              
              // Dispatch action to save order in Redux store and database
              dispatch(createOrder(order));
              navigate("/success");
            } else {
              // Payment verification failed - handle accordingly
              payBtn.current.disabled = false;
              toast.error("Payment verification failed. Please try again.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            payBtn.current.disabled = false;
            toast.error("Error verifying payment. Please try again later.");
          }
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
    };
  
    document.body.appendChild(script);

 
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
    {/* <CheckOutSteps activeStep={2} /> */}

    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2
        className="text-2xl font-semibold text-gray-800 mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Thank you for choosing us!
      </motion.h2>
      <motion.p
        className="text-center text-gray-600 mb-1"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        You’re just one step away from securing your order. Pay securely using Razorpay.
      </motion.p>
      <motion.p
        className="text-center text-gray-600 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Please have your payment details ready. Once the payment is successful, you’ll be redirected to a confirmation page.
      </motion.p>

      <motion.form
        className="w-full max-w-sm"
        onSubmit={submitHandler}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type="submit"
          value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
          ref={payBtn}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-200 mt-4 cursor-pointer"
        />
      </motion.form>
    </motion.div>
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


