import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderDetails,
  updateOrder,
  clearErrors,
} from "../../actions/orderAction";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstant";
import SideBar from "./SideBar";
import MetaData from "../layouts/MetaData";
import toast from "react-hot-toast";
import { Button } from "@mui/material";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import StorageIcon from "@mui/icons-material/Storage";

const orderStatusOptions = ["Processing", "Shipped", "Delivered"];

const ProcessOrderForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector(
    (state) => state.orderReducer
  );

  const [status, setStatus] = useState("");
  const [address,setAddress] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Order Updated Successfully");
      navigate("/admin/orders");
      dispatch({ type: UPDATE_ORDER_RESET });
    }
    dispatch(getOrderDetails(id));
  }, [dispatch, error, updateError, isUpdated, id]);

  const updateOrderHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("status", status);
    formData.set("address",address);
    dispatch(updateOrder(id, formData));
  };

  useEffect(() => {
    if (order) {
      setAddress(order?.shippingInfo?.address);
      setStatus(order.orderStatus); // Initialize status when order data is available
    }
  }, [order]);
  return (
    <Fragment>
      <MetaData title="Process Order" />
      <div className="w-full max-w-lg bg-white shadow-[0_0_10px_rgba(0,0,0,0.267)] p-6 rounded-lg text-lg">
        <h1 className="text-center  lg:text-3xl font-semibold text-gray-800 mb-4">
          Update Order
        </h1>
        <form className="flex flex-col gap-4" onSubmit={updateOrderHandler}>
  {/* id Field */}
  <div className="flex items-center gap-2 border-b border-gray-300 py-2">
    <SpellcheckIcon className="text-black" sx={{fontSize:"30px"}} />
    <input
      type="text"
      value={order?._id || ""}
      readOnly
      className="w-full outline-none bg-transparent text-gray-700"
    />
  </div>

  {/* Price Field */}
  <div className="flex items-center gap-2 border-b border-gray-300 py-2">
    <AttachMoneyIcon className="text-black" sx={{fontSize:"30px"}} />
    <input
      type="text"
      value={`$${order?.totalPrice}`}
      readOnly
      className="w-full outline-none bg-transparent text-gray-700"
    />
  </div>

  {/* Address Field */}
  <div className="flex items-start gap-2 border-b border-gray-300 py-2 focus-within:border-blue-600">
    <DescriptionIcon className="text-black mt-1" sx={{fontSize:"30px"}} />
    <textarea
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      rows={2}
      className="w-full resize-none outline-none bg-transparent text-gray-700 focus:border-none"
    ></textarea>
  </div>

  {/* Editable Current Status Field */}
  <div className="flex items-center gap-2 border-b border-gray-300 py-2">
    <StorageIcon className="text-black" sx={{fontSize:"30px"}}/>
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:ring focus:ring-blue-300"
    >
      {/* Keep the current status as the first option */}
      {status && <option value={status}>{status}</option>}

      {/* Show other statuses except the current one */}
      {orderStatusOptions
        .filter((option) => option !== status)
        .map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
    </select>
  </div>

  {/* Submit Button */}
  <Button
    type="submit"
    disabled={loading || !status}
    sx={{
      width: "100%",
      bgcolor:  "#3b82f6",
      color: "white",
      padding: "8px 16px",
      borderRadius: "6px",
      "&:hover": { bgcolor: "#0968b7" },
    }}
  >
    Process
  </Button>
</form>
      </div>
    </Fragment>
  );
};

export default ProcessOrderForm;
