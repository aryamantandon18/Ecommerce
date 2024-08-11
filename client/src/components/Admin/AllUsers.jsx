import React,{Fragment, useEffect, useState} from 'react'
import { clearErrors,} from '../../actions/productActions'
import toast from 'react-hot-toast';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MetaData from '../layouts/MetaData';
import SideBar from './SideBar';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import './productList.css'
import axios from 'axios';
import { server } from '../..';

const AllUsers = () => {
    // const navigate = useNavigate();
    const [users,setUsers] = useState([]);
    const [loading,setLoading] = useState(false);

    const allUsers=async()=>{
        try {
           setLoading(true);
           const {data} = await axios.get(`${server}/users/admin/users`,{
               withCredentials:true,   
           });
           setLoading(false);
           console.log("users after allUsers request",data.users)
           setUsers(data.users);
        } catch (error) {
           setLoading(false);
           console.log("User Error are :- ",error.message);
        }finally{
           setLoading(false);
        }
        } 

    const deleteUserHandler=async(userId)=>{
        await axios.delete(`${server}/users/admin/user/${userId}`,{withCredentials:true});
        setUsers([]);
        allUsers();
    }
     
    useEffect(()=>{
        allUsers();
    },[])
    
    
    const columns=[
        {field:"id", headerName:"USER ID", minWidth:200,flex:0.5},
        {
            field: "email",
            headerName: "Email",
            minWidth: 200,
            flex: 1,
          },
          {
            field: "name",
            headerName: "Name",
            minWidth: 150,
            flex: 0.3,
          },
      
          {
            field: "role",
            headerName: "Role",
            minWidth: 150,
            flex: 0.5,
            cellClassName: (params) => {
                // console.log(params);
                const statusValue = params.row.role;
                return statusValue === ("admin"||"Admin")
                  ? "greenColor"
                  : "redColor";
              },
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
                     <Link to={`/admin/user/${params.row.id}`}>
                     <EditIcon />
                  </Link>
            <Button onClick={()=>{deleteUserHandler(params.row.id)}}>   
                <DeleteIcon />
                 </Button>
                 </Fragment>
                );
              },
          }
    ]
    const rows = [];
    if(Array.isArray(users)){
       users.forEach((item)=>{
        rows.push({
            id: item._id,
            role: item.role,
            email: item.email,
            name: item.name,
        })
       }) }
       return (
        <Fragment>
            {console.log(users)}           
             <MetaData title={'ALL Users - ADMIN'}/>
            <div className='dashboard'>
                <SideBar/>
                <div className='productListContainer'>
                    <h1 id='productListHeading'>ALL USERS</h1>
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

export default AllUsers