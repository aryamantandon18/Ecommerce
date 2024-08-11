import React,{Fragment, useEffect} from 'react'
import {useDispatch,useSelector} from "react-redux";
import { clearErrors} from '../../actions/orderAction'
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
const {error:orderError,orders} = useSelector((state)=> state.allOrders);
const {error,isDeleted,isUpdated} = useSelector((state)=> state.orderReducer);

useEffect(()=>{
    if(orderError){
        toast.error(orderError);
        dispatch(clearErrors());
    }
    if(error){
        toast.error(error);
        dispatch(clearErrors());
    }
    if(isDeleted){
        toast.success("Order Deleted Successfully");
        navigate("/admin/orders");
        dispatch({type:DELETE_ORDER_RESET});
    }
    dispatch(getAllOrders());
},[dispatch,error,isDeleted,orderError])

const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };

const columns=[
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
        field: "actions",
        flex: 0.3,
        headerName: "Actions",
        minWidth: 150,
        type: "number",
        sortable:false,
        renderCell: (params) => {
            return (
             <Fragment>
                 <Link to={`/admin/order/${params.row.id}`}>
                 <EditIcon />
              </Link>
        <Button onClick={()=>{deleteOrderHandler(params.row.id)}}>
            <DeleteIcon />
             </Button>
             </Fragment>
            );
          },
      }
]
const rows = [];
if(Array.isArray(orders)){
   orders.forEach((item)=>{
    rows.push({
        id:item._id,
        itemsQty:item.orderItems.length,
        amount:item.totalPrice,
        status: item.orderStatus,
    })
   }) }
return (
    <Fragment>
        {/* {console.log("These are all the orders",orders)} */}
        <MetaData title={'ALL Orders - ADMIN'}/>
        <div className='dashboard'>
            <SideBar/>
            <div className='productListContainer'>
                <h1 id='productListHeading'>ALL ORDERS</h1>
            <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10]}
            disableSelectionOnCLick
            autoHeight
            className='productListTable'
            />
            </div>
        </div>
    </Fragment>
  )
}

export default OrderList;