import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const [items, setItems] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Role-based menu items
  const menuItems = {
    admin: [
      { name: 'Courses', link: '/dashboard/all-courses' },
      { name: 'Quiz Requests', link: '/dashboard/quiz-requests' },
      { name: 'Quizzes (Creating)', link: '/dashboard/previous-quizzes' },
      { name: 'Notifications', link: '/dashboard/notifications' },
      { name: 'Teachers', link: '/dashboard/teachers-list' },
      { name: 'Students', link: '/dashboard/students-list' },
      { name: 'Logout', link: '/' },
    ],
    teacher: [
      { name: 'Courses', link: '/dashboard/teacher-courses' },
      { name: 'Quizzes (Creating)', link: '/dashboard/previous-quizzes' },
      { name: 'Notifications', link: '/dashboard/notifications' },
      { name: 'My Students', link: '/dashboard/students-list' },
      { name: 'Logout', link: '/' },
    ],
    student: [
      { name: 'Quizzes (Attempting)', link: '/dashboard/student-quiz' },
      { name: 'Enrolled Courses', link: '/dashboard/student-enrolled-courses' },
      { name: 'Notifications', link: '/dashboard/notifications' },
      { name: 'Results', link: '/dashboard/student-results' },
      { name: 'Logout', link: '/' },
    ],
  };

  useEffect(() => {
    setItems(menuItems[role] || []);
  }, [role]);

  // Navigate to the first tab's link by default if no matching route exists
  useEffect(() => {
    if (items.length > 0 && !items.some((item) => item.link === location.pathname)) {
      navigate(items[0].link);
    }
  }, []);

  return (
    <div className="sidebar">
      <div className="flex-column">
        {items.map((item, index) => (
          <NavLink
            key={index}
            to={item.link}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link' // Apply 'active' class if the link is active
            }
            onClick={() => {
              if (item.name === 'Logout') {
                // Clear tokens from localStorage or sessionStorage
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user'); // Clear user data
              }
            }}
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
