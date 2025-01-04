import { Notification } from '../models/notifications.models.js';
import {User} from '../models/user.models.js';

// Create a new notification and dynamically calculate targetUsers
export const createNotification = async (req, res) => {
  try {
    const { title, message, targetType } = req.body; // targetType determines who the target users are

    console.log(req.body);

    const user = await User.findById(req.user.id);
    
    const sentBy = user.fullName; // Assuming that the authenticated user's ID is available via req.user

    let targetUsers = [];

    // Dynamically calculate targetUsers based on targetType
    if (targetType === 'all') {
      // If targetType is 'all', send the notification to all users
      targetUsers = await User.find().select('_id'); // Select only user IDs
    } else if (targetType === 'teachers') {
      // If targetType is 'teachers', send the notification to all teachers
      targetUsers = await User.find({ role: 'teacher' }).select('_id'); // Assuming you have a 'role' field in User model
    } else if (targetType === 'students') {
      // If targetType is 'students', send the notification to all students
      targetUsers = await User.find({ role: 'student' }).select('_id'); // Assuming 'role' field in User model
    } else if (targetType === 'specific') {
      // If targetType is 'specific', users are provided manually as an array in the request body
      targetUsers = req.body.targetUsers;
    } else {
      // If targetType is not valid, throw an error
      return res.status(400).json({ msg: 'Invalid target type' });
    }

    console.log(targetUsers);
    

    // Create the new notification
    const newNotification = new Notification({
      title,
      message,
      sentBy,
      targetType,
      targetUsers: targetUsers.map(user => user._id), // Ensure we store only user IDs in targetUsers
    });

    // Save the notification to the database
    await newNotification.save();

    // Update the users with the new notification
    for (let userId of targetUsers) {
      await User.findByIdAndUpdate(userId, {
        $push: { notifications: newNotification._id },
      });
    }

    // Respond with the created notification
    return res.status(201).json(newNotification);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error while creating notification' });
  }
};

// Get all notifications for the authenticated user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch notifications where the user is a target user
    const notifications = await Notification.find({
      targetUsers: userId
    }).populate('sentBy', 'fullName') // Populate the sentBy field to show who sent the notification
      .sort({ createdAt: -1 }); // Sort by most recent notification

    return res.json(notifications);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Error fetching notifications' });
  }
};


//Get all User Notifications
export const getAllUsersNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch notifications where the user is a target user
    const notifications = await Notification.find().populate('sentBy', 'fullName') // Populate the sentBy field to show who sent the notification
      .sort({ createdAt: -1 }); // Sort by most recent notification

    return res.json(notifications);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Error fetching notifications' });
  }
};

// Delete a notification (for example, by admin or sender)
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Find and delete the notification by ID
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    return res.json({ msg: 'Notification deleted successfully' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Error deleting notification' });
  }
};