import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminNotifications = () => {

// User Authorization
  const [userRole, setUserRole]=useState("");

  useEffect(() => {
    setUserRole(localStorage.getItem('role') || '');
  }, []);

  console.log("user role", userRole);

  // Notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: '',
      description: '',
      timestamp: '',
      audience: '',
    },
  ]);

  const accessToken = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');

  // State to manage the view: true for viewing, false for creating
  const [isViewing, setIsViewing] = useState(true);

  // State for creating a new notification
  const [newNotification, setNewNotification] = useState({
    title: '',
    description: '',
    audience: 'Students',
    sentBy: '',
  });

  // Handle input changes for new notification
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotification((prev) => ({ ...prev, [name]: value }));
  };

  // Post a new notification
  const handlePostNotification = () => {
    if (!newNotification.title || !newNotification.description) {
      alert('Please fill in all fields before posting.');
    }

    const notificationData = {
      title:newNotification.title,
      message:newNotification.description,
      targetType:newNotification.audience.toLowerCase()
    }

    console.log(notificationData);
    

    
  
    const data = async () => {
      try {
        const {data} = await axios.post(`http://localhost:3000/api/v1/notification/create`, notificationData, { headers:{ "Authorization": `Bearer ${accessToken}`}})
  
        console.log(data);

        setNewNotification({
          title: '',
          description: '',
          audience: 'Students',
          sentBy: '',
        });

        alert('New Notification added');

        
      } catch (error) {
        console.log(error);
        
      }
    }

    data();

    setNewNotification({ title: '', description: '', audience: 'All' }); // Reset fields
    setIsViewing(true); // Switch to viewing mode
  };

  function sortNotificationsByDate(notifications) {
    return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function formatDate(dateString) {
  const date = new Date(dateString);

  // Get day, month, year, hours, and minutes
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Determine AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12; // Convert to 12-hour format
  hours = hours ? String(hours).padStart(2, '0') : '12'; // 0 hour is 12 in 12-hour format

  // Format the date
  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
}

  useEffect(()=>{
    const data = async () => {

      try {
        if(role == 'admin'){
        const {data} = await axios.get(`http://localhost:3000/api/v1/notification/all-notifications`, { headers:{ "Authorization": `Bearer ${accessToken}`}})
        // setNotifications(data)
        setNotifications(sortNotificationsByDate(data))

      }

      if(role == 'teacher'){
        const {data} = await axios.get(`http://localhost:3000/api/v1/user/my-details`, { headers:{ "Authorization": `Bearer ${accessToken}`}})
        // setNotifications(data.notifications)
        setNotifications(sortNotificationsByDate(data.notifications))

        console.log(data)
      }

      if(role == 'student'){
        const {data} = await axios.get(`http://localhost:3000/api/v1/user/my-details`, { headers:{ "Authorization": `Bearer ${accessToken}`}})
        setNotifications(sortNotificationsByDate(data.notifications))
        console.log(data);
        
      }
        
      } catch (error) {
        console.log(error);
        
      }
    }

    data();
  }, [newNotification])

  return (
    <div className="notifications-container p-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">Notifications</h2>
        {userRole==="student"?"":<button
          className="btn btn-primary"
          onClick={() => setIsViewing(!isViewing)}
        >
          {isViewing ? 'Create Notification' : 'Back to Notifications'}
        </button>}
      </div>

      {/* Conditional Rendering */}
      {isViewing ? (
        // Notifications List View
        <div className="notifications-list">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="notification-card p-3 mb-3 border rounded"
              >
                <h5 className="mb-2">{notification.title}</h5>
                <p className="mb-1">{notification.message}</p>
                <p className="mb-1"> <strong>Sent By: </strong>{notification.sentBy}</p>
                {userRole==="student" || userRole=="teacher"?"":<p className="mb-1">
                  <strong>Target Audience:</strong> {notification.targetType}
                </p>}
                
                <small className="text-muted">{formatDate(notification.createdAt)}</small>
              </div>
            ))
          ) : (
            <p>No notifications available.</p>
          )}
        </div>
      ) : (
        // Create Notification View
        <div className="create-notification-form p-3 border rounded">
          <h4>Create New Notification</h4>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Notification Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="Enter title"
              value={newNotification.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="3"
              placeholder="Enter description"
              value={newNotification.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
         {role == 'admin' ? ( <div className="mb-3">
            <label htmlFor="audience" className="form-label">
              Target Audience
            </label>
            <select
              id="audience"
              name="audience"
              className="form-select"
              value={newNotification.audience}
              onChange={handleInputChange}
            >
              <option value="All">All</option>
              <option value="Teachers">Teachers</option>
              <option value="Students">Students</option>
            </select>
          </div>) : ''}
          <button
            className="btn btn-success"
            onClick={()=>handlePostNotification()}
          >
            Post Notification
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
