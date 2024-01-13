import React from 'react'
import Sidebar from './SideBar.js'
import {Doughnut,Line} from "react-chartjs-2";
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import './Dashboard.css'

const Dashboard = () => {

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0,2000],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [2,7],
      },
    ],
  };
  return (
    <div className='dashboard'>
      <Sidebar/>
      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>
        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br/> ₹2000
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/product">
            <p>Product</p>
            <p>50</p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              <p>4</p>
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              <p>2</p>
            </Link>
          </div>
        </div>
        {/* <div className="lineChart">
          <Line data={lineState} />
        </div>

        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div> */}
      </div>
      </div>
  )
}

export default Dashboard