import React, { Fragment, useEffect, useState } from 'react';
import { clearErrors } from '../../actions/productActions';
import toast from 'react-hot-toast';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MetaData from '../layouts/MetaData';
import SideBar from './SideBar';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import './productList.css';
import axios from 'axios';
import { server } from '../..';
import { useSelector } from 'react-redux';

const AllReviews = () => {
    const [reviews, setReviews] = useState([]);  // Store reviews data
    const [loading, setLoading] = useState(false); // Loading state
    const [totalReviews,settotalReviews] = useState(1);
    const [page,setPage] = useState(1);
    const { user } = useSelector((state) => state.user);

    // Function to fetch all reviews from the API
    const getReviews = async (currentPage = 1) => {
        try {
            setLoading(true); // Set loading to true while fetching
            const { data } = await axios.post(`${server}/admin/products/reviews?page=${currentPage}&limit=10`,{},{
                withCredentials:true,   
            });
            
            // Update state with the reviews data
            setReviews(data.reviews);
            settotalReviews(data.totalReviews);
            setPage(data.currentPage);
            setLoading(false); 
        } catch (error) {
            setLoading(false);  
            console.log('Error fetching reviews:', error);
            toast.error('Failed to fetch reviews.');
        }
    };

    // UseEffect to call the function on component mount
    useEffect(() => {
        getReviews();
    }, []);

    // Define columns for DataGrid
    const columns = [
        { field: 'reviewId', headerName: 'Review ID', minWidth: 200, flex: 1 },
        { field: 'productId', headerName: 'Product ID', minWidth: 200, flex: 1 },
        { field: 'username', headerName: 'User', minWidth: 200, flex: 1 },
        { field: 'rating', headerName: 'Rating', minWidth: 150, flex: 0.5 },
        { field: 'comment', headerName: 'Comment', minWidth: 200, flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 150,
            flex: 0.3,
            renderCell: (params) => (
                <Fragment>
                    <Link to={`/admin/review/${params.row.reviewId}`}>
                        <EditIcon />
                    </Link>
                    <Button onClick={() => deleteReviewHandler(params.row.reviewId)}>
                        <DeleteIcon />
                    </Button>
                </Fragment>
            ),
        },
    ];

    // Map the reviews data to rows for DataGrid
    const rows = reviews.map((review) => ({
        reviewId: review.reviewId.slice(0,15) +"...",  // Use the review ID as the row ID
        productId: review.productId.slice(0,15)+"...",
        username: review.userName,  // Assuming the review contains the user's name
        rating: review.rating,
        comment: review.comment,
    }));

    // Function to handle review deletion (if needed)
    const deleteReviewHandler = async (reviewId) => {
        try {
            // Call API to delete review
            await axios.delete(`${server}/reviews/${reviewId}`);
            getReviews(page);  // Refresh the reviews list
            toast.success('Review deleted successfully');
        } catch (error) {
            console.log('Error deleting review:', error);
            toast.error('Failed to delete review');
        }
    };

    return (
        <Fragment>
        <MetaData title={'All Reviews - Admin'} />
        <div className="flex mt-16 sm:mt-20 h-[125vh]">
            <SideBar />
            <div className="flex-1 p-6 bg-gray-100 overflow-x-scroll">
                <h1 className="text-3xl font-semibold mb-6">ALL REVIEWS</h1>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <DataGrid
                    sx={{
                        fontSize:{xs:"15px",sx:"17px",md:"20px"},
                        overflowY:"scroll",
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#1f2937",
                            // fontSize: "16px",
                            color: "#040404",
                        },
                        "& .MuiDataGrid-actionsCell": {
                            color: "#ffffff", // Set the color of the actions (three dots) to white
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                            color: "#ffffff", // Ensuring the column header titles are white
                        },
                        '& .MuiDataGrid-cell:hover': {
                            color: 'primary.main',
                          },
                    }}
                        rows={rows}
                        columns={columns}
                        pageSize={10}           
                        rowsPerPageOptions={[10, 20, 50]}
                        disableSelectionOnClick
                        autoHeight
                        className="h-[80vh]"
                        loading={loading}
                        paginationMode="server"
                        page = {page-1}   // DataGrid uses 0-based page index
                        rowCount={totalReviews}
                        onPageChange={(newPage)=>{
                            setPage(newPage+1);
                            getReviews(newPage+1);
                        }}
                        onPageSizeChange={(newPageSize) => {
                            setPage(1);  // Reset to first page if page size changes
                            getReviews(1); // Fetch data for the first page
                        }}
                        getRowId={(row)=> row.reviewId}
                    />
                </div>
            </div>
        </div>
    </Fragment>

    );
};

export default AllReviews;
