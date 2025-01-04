import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const DashboardHeader = ({ role }) => {
  const location = useLocation();
  const [userName, setUserName] = useState(''); // State to store the username

  // Role-specific dashboard titles
  const roleTitles = {
    admin: 'Admin Dashboard',
    teacher: 'Teacher Dashboard',
    student: 'Student Dashboard',
  };

  // Default home page links based on the role
  const roleHomePages = {
    admin: '/dashboard/all-courses',
    teacher: '/dashboard/previous-quizzes',
    student: '/dashboard/student-quiz',
  };

  // Check if the current route matches the default home page for the role
  const isHomePage = location.pathname === roleHomePages[role];

  // Fetch username from the backend on component mount
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/user/my-details', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Include token if needed
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserName(data.fullName); // Assuming the username is under the `name` field
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUserName();
  }, []); // Runs only once on component mount

  return (
    <header className="dashboard-header">
      <div className="header-content" style={{ borderBottom : '1px solid rgba(0,0,0,0.1)'}}>
        {isHomePage ? (
          <h4 className='mb-3'>Welcome, {userName || 'User'}!</h4>
        ) : (
          <h4>{roleTitles[role]}</h4>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
