import React, { Fragment, useEffect, useState } from 'react'
import { clearErrors } from '../../actions/productActions'
import toast from 'react-hot-toast'
import { DataGrid } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MetaData from '../layouts/MetaData'
import SideBar from './SideBar'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'
import axios from 'axios'
import { server } from '../..'

const AllUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const allUsers = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${server}/users/admin/users`, {
                withCredentials: true,
            })
            setLoading(false)
            console.log('users after allUsers request', data.users)
            setUsers(data.users)
        } catch (error) {
            setLoading(false)
            console.log('User Error are :- ', error.message)
        } finally {
            setLoading(false)
        }
    }

    const deleteUserHandler = async (userId) => {
        await axios.delete(`${server}/users/admin/user/${userId}`, { withCredentials: true })
        setUsers([])
        allUsers()
    }

    useEffect(() => {
        allUsers()
    }, [])

    const columns = [
        { field: 'id', headerName: 'USER ID', minWidth: 200, flex: 0.5 },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 200,
            flex: 1,
        },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 150,
            flex: 0.3,
        },
        {
            field: 'role',
            headerName: 'Role',
            minWidth: 150,
            flex: 0.5,
            cellClassName: (params) => {
                const statusValue = params.row.role
                return statusValue === 'admin' || statusValue === 'Admin'
                    ? 'text-green-500'
                    : 'text-red-500'
            },
        },
        {
            field: 'actions',
            flex: 0.3,
            headerName: 'Actions',
            minWidth: 150,
            type: 'number',
            sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Link to={`/admin/user/${params.row.id}`}>
                            <EditIcon className="text-blue-500 hover:text-blue-700 mr-2" />
                        </Link>
                        <Button onClick={() => deleteUserHandler(params.row.id)} className="text-red-500 hover:text-red-700">
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                )
            },
        },
    ]

    const rows = []
    if (Array.isArray(users)) {
        users.forEach((item) => {
            rows.push({
                id: item._id,
                role: item.role,
                email: item.email,
                name: item.name,
            })
        })
    }

    return (
        <Fragment>
            {console.log(users)}
            <MetaData title={'ALL Users - ADMIN'} />
            <div className="flex sm:mt-20 mt-16 h-[125vh]">
                <SideBar />
                <div className="flex-1 p-6 bg-gray-100 overflow-scroll">
                    <h1 className="text-3xl font-semibold mb-6">ALL USERS</h1>
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSizeOptions={[10]}
                            disableSelectionOnClick
                            autoHeight
                            className="productListTable"
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default AllUsers
