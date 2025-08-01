import React, { useEffect, useState } from 'react';
import {MaterialReactTable} from 'material-react-table';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import MetaData from '../layouts/MetaData';
import SideBar from './SideBar';
import axios from 'axios';
import { server } from '../..';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const allUsers = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${server}/users/admin/users`, {
                withCredentials: true,
            });
            setUsers(data.users);
        } catch (error) {
            console.log('User Error are :- ', error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteUserHandler = async (userId) => {
        await axios.delete(`${server}/users/admin/user/${userId}`, { withCredentials: true });
        allUsers();
    };

    useEffect(() => {
        allUsers();
    }, []);

    const columns = [
        { accessorKey: 'id', header: 'USER ID',size:300 },
        { accessorKey: 'email', header: 'Email',size:400 },
        { accessorKey: 'name', header: 'Name',size:250  },
        {
            accessorKey: 'role',
            header: 'Role',
            size: 250,
            Cell: ({ cell }) => (
                <span className={cell.getValue().toLowerCase() === 'admin' ? 'text-green-500' : 'text-red-500'}>
                    {cell.getValue()}
                </span>
            ),
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            size: 200,
            Cell: ({ row }) => (
                <IconButton onClick={() => deleteUserHandler(row.original.id)}>
                    <DeleteIcon className="text-red-500 hover:text-red-700" />
                </IconButton>
            ),
        },
    ];
    

    const data = users.map((item) => ({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
    }));

    return (
        <div>
            <MetaData title={'ALL Users - ADMIN'} />
            <div className="flex sm:mt-20 mt-16 bg-[#f3f4f6] ">
                <SideBar />
                <div className="p-6 border-l border-gray-300 overflow-auto">
                <h1 className="text-3xl font-semibold mb-6 text-center text-gray-600 transition-all duration-500">ALL USERS</h1>
                <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
                    <MaterialReactTable
                        columns={columns}
                        data={data}
                        enableColumnResizing
                        enableColumnFilters
                        enablePagination
                        enableSorting
                        initialState={{ density: 'comfortable' }}
                        muiPaginationProps= {{
                            rowsPerPageOptions: [5, 10, 20,50],
                          }}
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
                          muiTableProps={{
                            sx: {
                              '& .MuiTableRow-hover:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' },
                            },
                          }}
                    />
                </div>    
                </div>
            </div>
        </div>
    );
};

export default AllUsers;
