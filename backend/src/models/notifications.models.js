import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    targetType: { type: String, required: true },
    // sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin or teacher
    sentBy: { type: String, required: true }, // Admin or teacher
    targetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users receiving the notification
    createdAt: { type: Date, default: Date.now }
  });
  
export const Notification = mongoose.model('Notification', notificationSchema);