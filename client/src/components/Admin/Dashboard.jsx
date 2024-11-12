import React, { useEffect } from 'react'
import Sidebar from './SideBar.js'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminProducts } from '../../actions/productActions.js'
import { getAllOrders } from '../../actions/orderAction.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut, Line } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);


const Dashboard = () => {
  const dispatch = useDispatch()
  const { products } = useSelector((state) => state.products)
  const { orders } = useSelector((state) => state.allOrders)

  let outOfStock = 0
  products &&
    products.forEach((item) => {
      if (item.stock === 0) outOfStock += 1
    })

  useEffect(() => {
    dispatch(getAdminProducts())
    dispatch(getAllOrders())
  }, [dispatch])

  let totalOrderPrice = 0
  orders && orders.forEach((order) => {
    totalOrderPrice += order.totalPrice
  })

  // Line chart for total amount
  const lineState = {
    labels: ["Initial", "Current"],
    datasets: [
      {
        label: "Total Revenue",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        data: [0, totalOrderPrice],
        fill: true,
        tension: 0.4,
      },
    ],
  }

  // Doughnut chart for stock distribution
  const doughnutState = {
    labels: ["Out of Stock", "In Stock"],
    datasets: [
      {
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
        data: [outOfStock, products?.length - outOfStock],
      },
    ],
  }

  return (
    <div className="flex min-h-screen bg-gray-100 sm:mt-20 mt-16">
      <Sidebar />
      <div className="flex-1 p-6">
        <Typography component="h1" className="text-4xl font-bold mb-6">Dashboard</Typography>

        <div className="bg-white p-4 shadow rounded-lg mb-6">
          <p className="text-lg font-semibold">
            Total Revenue: <span className="text-green-500">₹{totalOrderPrice}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Link to="/admin/products" className="bg-blue-50 p-4 rounded-lg text-center shadow hover:shadow-lg transition">
            <p className="text-lg font-medium">Products</p>
            <p className="text-2xl font-bold">{products ? products.length : 0}</p>
          </Link>
          <Link to="/admin/orders" className="bg-yellow-50 p-4 rounded-lg text-center shadow hover:shadow-lg transition">
            <p className="text-lg font-medium">Orders</p>
            <p className="text-2xl font-bold">{orders ? orders.length : 0}</p>
          </Link>
          <Link to="/admin/users" className="bg-green-50 p-4 rounded-lg text-center shadow hover:shadow-lg transition">
            <p className="text-lg font-medium">Users</p>
            <p className="text-2xl font-bold">5</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Revenue Over Time</h2>
            <Line data={lineState} />
          </div>

          <div className="bg-white p-4 rounded-lg shadow ">
            <h2 className="text-xl font-semibold mb-4">Stock Overview</h2>
            <Doughnut data={doughnutState} />
          </div>
        </div>  
      </div>
    </div>
  )
}

export default Dashboard
