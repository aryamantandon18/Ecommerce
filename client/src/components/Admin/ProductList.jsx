import React,{Fragment, useEffect} from 'react'
import {useDispatch,useSelector} from "react-redux";
import { clearErrors, getAdminProducts,deleteProduct } from '../../actions/productActions'
import toast from 'react-hot-toast';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MetaData from '../layouts/MetaData';
import SideBar from './SideBar';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import './productList.css'
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';


const ProductList = () => {

const navigate = useNavigate();
const dispatch = useDispatch();
const {error,products} = useSelector((state)=> state.products);
const {error:deleteError,isDeleted} = useSelector((state)=> state.deleteProduct);

useEffect(()=>{
    if(error){
        toast.error(error.message);
        dispatch(clearErrors());
    }
    if(deleteError){
        toast.error(deleteError);
        dispatch(clearErrors());
    }
    if(isDeleted){
        toast.success("Product Deleted Successfully");
        navigate("/admin/dashboard");
        dispatch({type:DELETE_PRODUCT_RESET});
    }
    dispatch(getAdminProducts());
},[dispatch,error,isDeleted,deleteError])

const deleteProductHandler=(id)=>{
    console.log("Inside delete func Deleting this ->",id);
    dispatch(deleteProduct(id));
}

const columns=[
    {field:"id", headerName:"Product ID", minWidth:200,flex:0.5},
    {
        field: "name",
        headerName: "Name",
        minWidth: 350,
        flex: 1,
      },
      {
        field: "stock",
        headerName: "Stock",
        type: "number",
        minWidth: 150,
        flex: 0.3,
      },
  
      {
        field: "price",
        headerName: "Price",
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
                 <Link to={`/admin/product/${params.row.id}`}>
                 <EditIcon />
              </Link>
        <Button onClick={()=>{deleteProductHandler(params.row.id)}}>
            <DeleteIcon />
             </Button>
             </Fragment>
            );
          },
      }
]
const rows = [];
console.log("This is the product array -> ")
console.log(products)
if(Array.isArray(products)){
   products.forEach((item)=>{
    rows.push({
        id:item._id,
        stock:item.stock,
        price:item.price,
        name:item.name,
    })
   }) }
return (
    <Fragment>
     {console.log(products)}
        <MetaData title={'ALL Products - ADMIN'}/>
        <div className='dashboard'>
            <SideBar/>
            <div className='productListContainer'>
                <h1 id='productListHeading'>ALL PRODUCTS</h1>
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

export default ProductList