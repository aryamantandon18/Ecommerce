import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../layouts/loader/Loader";
import { Typography } from "@mui/material";
import MetaData from "../layouts/MetaData";
import toast from "react-hot-toast";
import { clearErrors, myOrders } from "../../actions/orderAction";
import LaunchIcon from "@mui/icons-material/Launch";
import './myOrders.css';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { CLEAR_ERRORS } from "../../constants/orderConstant";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  console.log(user);
  const { loading, error, orders } = useSelector((state) => state.myOrders);

  const columns = [
    { field: "id", headerName: "OrderId", minWidth: 300, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        // console.log(params);
        const statusValue = params.row.status;
        return statusValue === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },
    {
      field: "action",
      headerName: "Actions",
      minWidth: "150",
      sortable: false,
      type: "number",
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.row.id}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];

  const rows = [];
  orders &&
    orders.forEach((item, index) => {
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id,
        status: item.orderStatus,
        amount: item.totalPrice,
      });
    });

  useEffect(() => {
    // if(error){
    //   toast.error(error);
    //   dispatch(clearErrors())
    // }
    
    dispatch(myOrders());
  },[dispatch,error]);

  return (  
    <Fragment>
      {console.log(loading)}
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {user && <MetaData title={`${user.name} - Orders`} />}
          <div className="myOrdersPage">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={10}
              disableSelectionOnClick
              className="myOrdersTable"
              autoHeight
            />
            
            <Typography id="myOrdersHeading">
              { user && user.name}'s Orders
            </Typography>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default MyOrders;
