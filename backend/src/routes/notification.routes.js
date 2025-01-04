import express from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import {authMiddleware} from '../middlewares/auth.midddleware.js'; // For user authentication

const notificationRouter = express.Router();

// Route to create a new notification (only for admins or teachers)
notificationRouter.post('/create', authMiddleware, notificationController.createNotification);

// Route to get all notifications for the authenticated user
notificationRouter.get('/all-user-notifications', authMiddleware, notificationController.getUserNotifications);

notificationRouter.get('/all-notifications', authMiddleware, notificationController.getAllUsersNotifications);

// // Route to delete a notification (only for the sender or admin)
notificationRouter.delete('/:notificationId', authMiddleware, notificationController.deleteNotification);

export default notificationRouter;