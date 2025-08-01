import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getAdminProducts, deleteProduct } from '../../actions/productActions';
import toast from 'react-hot-toast';
import { MaterialReactTable } from 'material-react-table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MetaData from '../layouts/MetaData';
import SideBar from './SideBar';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, products } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector((state) => state.deleteProduct);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      toast.success('Product Deleted Successfully');
      navigate('/admin/dashboard');
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
    dispatch(getAdminProducts());
  }, [dispatch, error, isDeleted, deleteError, navigate]);

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  const columns = [
    { accessorKey: 'id', header: 'Product ID', size: 200 },
    { accessorKey: 'name', header: 'Name', size: 350 },
    { accessorKey: 'stock', header: 'Stock', size: 150 },
    { accessorKey: 'price', header: 'Price', size: 270 },
    {
      accessorKey: 'actions',
      header: 'Actions',
      size: 150,
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Link to={`/admin/product/${row.original.id}`}>
            <EditIcon className="text-blue-500 hover:text-blue-700" />
          </Link>
          <Button onClick={() => deleteProductHandler(row.original.id)}>
            <DeleteIcon className="text-red-500 hover:text-red-700" />
          </Button>
        </div>
      ),
    },
  ];

  const rows = products?.map((item) => ({
    id: item._id,
    stock: item.stock,
    price: item.price,
    name: item.name,
  })) || [];

  return (
    <Fragment>
      <MetaData title={'ALL Products - ADMIN'} />
      <div className="flex sm:mt-20 mt-16 ">
        <SideBar />
        <div className="flex-1 p-6 bg-[#f3f4f6] border-l border-gray-300 overflow-auto">
          <h1 className="text-3xl font-semibold mb-6 text-center text-gray-600 transition-all duration-500">ALL PRODUCTS</h1>
          <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
            <MaterialReactTable
              columns={columns}
              data={rows}
              enablePagination
              enableSorting
              enableColumnResizing
              layoutMode="grid"
              initialState={{ pagination: { pageSize: 10 } }}
              muiTablePaperProps={{
                elevation: 2,
                sx: {
                  overflowX: "auto",
                  '&::-webkit-scrollbar': { width: '10px' },
                  '&::-webkit-scrollbar-thumb': { backgroundColor: '#888' },
                  '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
                  '& .MuiTypography-root': { color: 'black' },
                },
              }}
              muiTableContainerProps={{
                sx: { width: '100%', minHeight: '500px',
                  '& .MuiInputBase-input': { color: 'white' },
                 }, // Ensure full width
              }}
              muiTableHeadCellProps={{
                sx: {
                  backgroundColor: '#1f2937',
                  color: '#fff',  
                  fontSize: '18px',
                  textAlign: 'center',
                  '& .MuiTableSortLabel-root': { color: 'white' }, // Sort Icon color
                  '& .MuiTableSortLabel-icon': { color: 'white' }, // Sort Asc/Desc icon color
                  '& .MuiIconButton-root': { color: 'white' }, // 3-dot column options menu color
                  '& .MuiTableSortLabel-icon': { color: 'white !important' },
                },
              }}
              muiTableBodyCellProps={{
                sx: { textAlign: 'center', fontSize: '15px' }, // Center align content
              }}
              // muiTablePaginationProps={{
              //   sx: {
              //     backgroundColor: '#fff',
              //     color: '#000',
              //     '& .MuiTypography-root': { color: '#000' },
              //     '& .MuiSelect-select': { color: '#000' },
              //     '& .MuiSvgIcon-root': { color: '#000' },
              //   },
              // }}
              muiTableProps={{
                sx: {
                  '& .MuiTableRow-hover:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' },
                },
              }}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductList;
