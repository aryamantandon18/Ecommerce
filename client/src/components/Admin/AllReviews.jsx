import React, { Fragment, useEffect, useState } from "react";
import { clearErrors } from "../../actions/productActions";
import toast from "react-hot-toast";
import { MaterialReactTable } from "material-react-table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MetaData from "../layouts/MetaData";
import SideBar from "./SideBar";
import { Link } from "react-router-dom";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Rating, TextField } from "@mui/material";
import axios from "axios";
import { server } from "../..";
import { useSelector } from "react-redux";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalReviews, setTotalReviews] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for edit review dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { user } = useSelector((state) => state.user);

  // Function to fetch all reviews from the API
  const getReviews = async (currentPage = 1, currentPageSize = 10) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${server}/admin/reviews?page=${currentPage}&limit=${currentPageSize}`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        setReviews(data.reviews);
        setTotalReviews(data.totalReviews);
        setPage(data.currentPage);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error fetching reviews:", error);
      toast.error("Failed to fetch reviews.");
    }
  };

  useEffect(() => {
    if (!isNaN(page) && !isNaN(pageSize) && page > 0 && pageSize > 0) {
      getReviews(page, pageSize);
    } else {
      console.error("Invalid initial pagination values:", page, pageSize);
      toast.error("Invalid initial pagination values.");
    }
  }, [page, pageSize]);

  // Function to handle review deletion
  const deleteReviewHandler = async (reviewId) => {
    try {
      await axios.delete(`${server}/admin/review/${reviewId}`, {
        withCredentials: true,
      });
      getReviews(page);
      toast.success("Review deleted successfully");
    } catch (error) {
      console.log("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  // Function to open the edit review dialog
  const openEditReviewDialog = (review) => {
    setCurrentReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setOpenEditDialog(true);
  };

  // Function to close the edit review dialog
  const closeEditReviewDialog = () => {
    setOpenEditDialog(false);
    setCurrentReview(null);
    setRating(0);
    setComment("");
  };

  // Function to submit the edited review
  const submitEditReview = async () => {
    try {
      const { data } = await axios.put(
        `${server}/admin/review/${currentReview.reviewId}`,
        { rating, comment },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Review updated successfully");
        getReviews(page); // Refresh the reviews
        closeEditReviewDialog(); // Close the dialog
      }
    } catch (error) {
      console.log("Error updating review:", error);
      toast.error("Failed to update review");
    }
  };

  // Define columns for MaterialReactTable
  const columns = [
    {
      accessorKey: "reviewId",
      header: "Review ID",
      size: 200,
    },
    {
      accessorKey: "productId",
      header: "Product ID",
      size: 200,
      Cell: ({ cell }) => <span>{cell.getValue().slice(0, 15)}...</span>,
    },
    {
      accessorKey: "userName",
      header: "User Name",
      size: 200,
    },
    {
      accessorKey: "userEmail",
      header: "User Email",
      size: 200,
    },
    {
      accessorKey: "rating",
      header: "Rating",
      size: 100,
    },
    {
      accessorKey: "comment",
      header: "Comment",
      size: 250,
    },
    {
      accessorKey: "date",
      header: "Date",
      size: 200,
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      size: 150,
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <Button onClick={() => openEditReviewDialog(row.original)}>
            <EditIcon className="text-blue-500 hover:text-blue-700" />
          </Button>
          <Button onClick={() => deleteReviewHandler(row.original.reviewId)}>
            <DeleteIcon className="text-red-500 hover:text-red-700" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <MetaData title={"All Reviews - Admin"} />
      <div className="flex mt-16 sm:mt-20 bg-[#f3f4f6]">
        <SideBar />
        <div className="flex-1 p-6  border-l border-gray-300 overflow-auto">
          <h1 className="text-3xl font-semibold mb-6 text-center text-gray-600 transition-all duration-500">
            ALL REVIEWS
          </h1>

          <div className="bg-white shadow-md rounded-lg p-4">
            <MaterialReactTable
              columns={columns}
              data={reviews}
              enablePagination
              manualPagination
              rowCount={totalReviews}
              state={{
                isLoading: loading,
                pagination: { pageIndex: page - 1, pageSize },
              }}
              muiPaginationProps={{
                rowsPerPageOptions: [5, 10, 20, 50],
              }}
              onPaginationChange={(updater) => {
                const newPagination = typeof updater === "function" ? updater({ pageIndex: page - 1, pageSize }) : updater;
                const newPage = newPagination.pageIndex + 1; // Convert zero-based to one-based
                const newPageSize = newPagination.pageSize;

                // Ensure newPage and newPageSize are valid numbers
                if (!isNaN(newPage) && !isNaN(newPageSize) && newPage > 0 && newPageSize > 0) {
                  setPage(newPage);
                  setPageSize(newPageSize);
                } else {
                  console.error("Invalid pagination values:", newPage, newPageSize);
                  toast.error("Invalid pagination values.");
                }
              }}
              muiTableBodyCellProps={{
                sx: {
                  fontSize: "16px",
                },
              }}
              muiTableContainerProps={{
                sx: { width: '100%', minHeight: '500px' },
              }}
              muiTableHeadCellProps={{
                sx: {
                  backgroundColor: "#1f2937",
                  color: "#ffffff",
                  fontSize: '18px',
                  textAlign: 'center',
                  '& .MuiTableSortLabel-root': { color: 'white' },
                  '& .MuiTableSortLabel-icon': { color: 'white' },
                  '& .MuiIconButton-root': { color: 'white' },
                },
              }}
              muiTablePaperProps={{
                sx: {
                  boxShadow: "none",
                  border: "1px solid #ddd",
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Edit Review Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={closeEditReviewDialog}
        aria-labelledby="edit-review-dialog-title"
      >
        <DialogTitle id="edit-review-dialog-title">Edit Review</DialogTitle>
        <DialogContent>
          <Rating
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            size="large"
          />
          <TextField
            fullWidth
            multiline
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Edit your review comment..."
            sx={{ marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditReviewDialog}>Cancel</Button>
          <Button onClick={submitEditReview} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default AllReviews;