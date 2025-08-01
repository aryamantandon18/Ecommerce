import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AddIcon from '@mui/icons-material/Add'
import ListAltIcon from '@mui/icons-material/ListAlt'
import PeopleIcon from '@mui/icons-material/People'
import RateReviewIcon from '@mui/icons-material/RateReview'
import { FaBars, FaTimes } from 'react-icons/fa'
import EmailIcon from '@mui/icons-material/Email'; 

const SideBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className={`flex flex-col bg-gray-800 text-white ${sidebarOpen ? 'w-64' : 'w-[55px]'} lg:w-64 transition-all`}>
      {/* Hamburger icon for mobile view */}
      <div className="lg:hidden p-4 cursor-pointer pt-5" onClick={toggleSidebar}>
        {sidebarOpen ? <FaTimes className="text-white" size={24} /> : <FaBars className="text-white" size={24} />}
      </div>

      <div className="flex flex-col items-start py-4 px-2 space-y-4 z-30 relative">
        <Link to="/admin/dashboard" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg mb-4 group w-full">
          <DashboardIcon />
          <span className={`ml-2 text-sm ${sidebarOpen ? 'inline-block' : 'hidden group-hover:inline-block lg:inline-block'}`}>Dashboard</span>
        </Link>

        <Link to="/admin/product" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg mb-4 group w-full">
          <AddIcon />
          <span className={`ml-2 text-sm ${sidebarOpen ? 'inline-block' : 'hidden group-hover:inline-block lg:inline-block'}`}>Create Product</span>
        </Link>

        <Link to="/admin/orders" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg mb-4 group w-full">
          <ListAltIcon />
          <span className={`ml-2 text-sm ${sidebarOpen ? 'inline-block' : 'hidden group-hover:inline-block lg:inline-block'}`}>Orders</span>
        </Link>

        <Link to="/admin/products" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg mb-4 group w-full">
          <ListAltIcon />
          <span className={`ml-2 text-sm ${sidebarOpen ? 'inline-block' : 'hidden group-hover:inline-block lg:inline-block'}`}>Products</span>
        </Link>


        <Link to="/admin/users" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg mb-4 group w-full">
          <PeopleIcon />
          <span className={`ml-2 text-sm ${sidebarOpen ? 'inline-block' : 'hidden group-hover:inline-block lg:inline-block'}`}>Users</span>
        </Link>

        <Link to="/admin/reviews" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg mb-4 group w-full">
          <RateReviewIcon />
          <span className={`ml-2 text-sm ${sidebarOpen ? 'inline-block' : 'hidden group-hover:inline-block lg:inline-block'}`}>Reviews</span>
        </Link>
        <Link to="/admin/send-email" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg mb-4 group w-full">
        <EmailIcon/>
        <span className={`ml-2 text-sm ${sidebarOpen ? 'inline-block' : 'hidden group-hover:inline-block lg:inline-block'}`}>Send Emails</span>
        </Link>
      </div>
    </div>
  )
}

export default SideBar

