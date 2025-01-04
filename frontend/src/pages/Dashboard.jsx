import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import DashboardHeader from '../components/DashboardHeader/dashboardHeader';

const Dashboard = ({role }) => {
  return (
    <div className="dashboard-container d-flex">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="main-content flex-grow-1 p-3">
        <DashboardHeader role={role} />
        <Outlet /> {/* This renders the component for the selected route */}
      </div>
    </div>
  );
};

export default Dashboard;
