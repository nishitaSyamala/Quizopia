import express from "express";
import { authMiddleware } from "../middlewares/auth.midddleware.js";
import * as userController from "../controllers/user.controller.js";

const userRouter = express.Router();

// User Routes

// Register a new user (Admin or Teacher)
userRouter.post("/register", userController.registerUser);

// User Login
userRouter.post("/login", userController.loginUser);

// User Logout
userRouter.post("/logout", authMiddleware, userController.logoutUser);

// Admin route to change user status (Activate/Deactivate)
userRouter.patch(
	"/users/:userId/status",
	authMiddleware,
	userController.changeUserStatus
);

// Get logged-in user profile
userRouter.get("/my-details", authMiddleware, userController.getUserProfile);

// Update logged-in user profile
userRouter.patch(
	"/update-profile",
	authMiddleware,
	userController.updateUserProfile
);

// Admin route to get all users
userRouter.get("/users", authMiddleware, userController.getAllUsers);

userRouter.post("/users-role", authMiddleware, userController.getUsersByRole);

// Change password route
userRouter.post(
	"/change-password",
	authMiddleware,
	userController.changePassword
);

// Admin route to manually change a user's password
userRouter.post(
	"/admin/change-password",
	authMiddleware,
	userController.adminChangePassword
);

export default userRouter;
