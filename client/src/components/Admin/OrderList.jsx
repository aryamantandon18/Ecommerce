import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from '../../actions/orderAction'
import toast from 'react-hot-toast';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MetaData from '../layouts/MetaData';
import SideBar from './SideBar';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import './productList.css'
import { DELETE_ORDER_RESET } from '../../constants/orderConstant';
import { deleteOrder, getAllOrders } from '../../actions/orderAction';

const OrderList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error: orderError, orders } = useSelector((state) => state.allOrders);
  const { error, isDeleted } = useSelector((state) => state.orderReducer);

  useEffect(() => {
    if (orderError) {
      toast.error(orderError);
      dispatch(clearErrors());
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      toast.success("Order Deleted Successfully");
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }
    dispatch(getAllOrders());
  }, [dispatch, error, isDeleted, orderError, navigate]);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };

  const columns = [
    { field: "id", headerName: "OrderId", minWidth: 200, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.5,
      cellClassName: (params) => {
        const statusValue = params.row.status;
        return statusValue === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 120,
      flex: 0.3,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/order/${params.row.id}`}>
              <EditIcon />
            </Link>
            <Button onClick={() => { deleteOrderHandler(params.row.id) }}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    }
  ];

  const rows = [];
  if (Array.isArray(orders)) {
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
      });
    });
  }

  return (
    <Fragment>
      <MetaData title={'ALL Orders - ADMIN'} />
      <div className="flex mt-16 sm:mt-20 h-full">
        <SideBar />
        <div className="flex-1 p-6 bg-gray-100 overflow-x-scroll">
          <h1 className="text-3xl font-semibold mb-6">ALL ORDERS</h1>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="overflow-x-auto">
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[10]}
                disableSelectionOnClick
                autoHeight
                className="productListTable"
                // Hide columns on small screens
                columnVisibilityModel={{
                  actions: window.innerWidth < 768, // Hide 'Actions' on mobile
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default OrderList;
