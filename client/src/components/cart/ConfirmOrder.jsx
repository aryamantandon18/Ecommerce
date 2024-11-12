import React, { Fragment } from "react";
import MetaData from "../layouts/MetaData";
import { Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckOutSteps from "./CheckOutSteps.jsx";
import Loader from "../layouts/loader/Loader.jsx";

const ConfirmOrder = () => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price, 0
  );

  const shippingCharges = subtotal < 1000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const totalPrice = Math.round(subtotal + shippingCharges + tax);
  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,  
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/process/payment");
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Confirm Order" />
          {/* <CheckOutSteps activeStep={1} /> */}
          <div className="min-h-screen bg-white grid grid-cols-1 md:grid-cols-[2fr_1fr] mt-[55px] sm:mt-20">
            <div className="p-5">
              <div className="border-b pb-5">
                <Typography variant="h5" className="text-2xl font-semibold">Shipping Info</Typography>
                <div className="mt-4 space-y-4">
                  <div className="flex">
                    <p className="w-1/3 text-gray-700 font-medium">Name:</p>
                    <span className="text-gray-500">{user.name}</span>
                  </div>
                  <div className="flex">
                    <p className="w-1/3 text-gray-700 font-medium">Phone:</p>
                    <span className="text-gray-500">{shippingInfo.phoneNo}</span>
                  </div>
                  <div className="flex">
                    <p className="w-1/3 text-gray-700 font-medium">Address:</p>
                    <span className="text-gray-500">{address}</span>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Typography variant="h5" className="text-2xl font-semibold">Your Cart Items:</Typography>
                <div className="mt-4 max-h-60 overflow-y-auto space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product} className="flex items-center space-x-4">
                      <img src={item.image} alt="Product" className="w-12" />
                      <Link to={`/product/${item.product}`} className="text-gray-600 hover:underline flex-grow">
                        {item.name}
                      </Link>
                      <span className="text-gray-700 font-medium">
                        {item.quantity} X ₹{item.price} = <b>₹{item.price * item.quantity}</b>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 bg-gray-50 border-t md:border-l md:border-t-0">
              <div className="space-y-4">
                <Typography variant="h5" className="text-2xl font-semibold text-center border-b pb-2">Order Summary</Typography>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-600">SubTotal:</p>
                    <span className="text-gray-700">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Shipping Charges:</p>
                    <span className="text-gray-700">₹{shippingCharges}</span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">GST:</p>
                    <span className="text-gray-700">₹{tax}</span>
                  </div>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <p>Total:</p>
                  <span>₹{totalPrice}</span>
                </div>
                <button
                  onClick={proceedToPayment}
                  className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Proceed To Payment
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ConfirmOrder;
