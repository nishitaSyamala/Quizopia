import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
	try {
		const { fullName, email, password, role } = req.body;

		console.log("Request body:", req.body); // Log incoming data for debugging

		// Validation for required fields
		if (!fullName || !email || !password || !role) {
			return res.status(400).json({ message: "All fields are required." });
		}

		// Check if user with this email already exists
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User with this email already exists." });
		}

		// Create new user object
		const newUser = new User({
			fullName,
			email,
			password, // No need to hash the password manually since the middleware takes care of it
			role,
			isActive: true, // Set active by default
		});

		// Save the user to the database
		await newUser.save();

		const user = await User.findOne({ email: newUser.email });

		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Compare the password
		const isMatch = await bcrypt.compare(password, user.password);

		// const isMatch = await user.comparePassword(password);
		console.log(isMatch);

		if (!isMatch) {
			return res.status(400).json({ message: "Password Not Matched" });
		}

		// Check if the user is active
		if (!user.isActive) {
			return res
				.status(403)
				.json({ message: "Account is deactivated. Please contact admin." });
		}

		// Generate access and refresh tokens
		const accessToken = user.generateAuthToken();
		const refreshToken = user.generateRefreshToken();

		const userDetails = user._doc;

		return res.status(200).json({ accessToken, refreshToken, role:user.role, user: {...userDetails, password:''}  });
	} catch (error) {
		// Log error for debugging
		console.error("Error during user registration:", error);

		// Return error response
		return res.status(500).json({
			message: "Error registering user",
			error: error.message || error,
		});
	}
};

// User Login
export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find user by email
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Compare the password
		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ message: "Password Not Matched" });
		}

		// Check if the user is active
		if (!user.isActive) {
			return res
				.status(403)
				.json({ message: "Account is deactivated. Please contact admin." });
		}

		// Generate access and refresh tokens
		const accessToken = user.generateAuthToken();
		const refreshToken = user.generateRefreshToken();

		const userDetails = user._doc;

		res.status(200).json({ accessToken, refreshToken, role:user.role, user: {...userDetails, password:''} });
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

// Logout (Invalidate refresh token)
export const logoutUser = async (req, res) => {
	try {
		// Revoke the refresh token
		await req.user.revokeRefreshToken();

		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error during logout" });
	}
};

// Change User Status (Activate/Deactivate)
export const changeUserStatus = async (req, res) => {
	try {
		const { userId } = req.params;
		const { isActive } = req.body;

		if (typeof isActive !== "boolean") {
			return res
				.status(400)
				.json({ message: "isActive must be a boolean value." });
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		// Update the user's active status
		user.isActive = isActive;
		await user.save();

		res.status(200).json({
			message: `User ${isActive ? "activated" : "deactivated"} successfully.`,
		});
	} catch (error) {
		res.status(500).json({ message: "Error updating user status" });
	}
};

// Get logged-in User Profile
export const getUserProfile = async (req, res) => {

	const userId = req.user.id;
	const user = await User.findById(userId).select('-password').populate('notifications');


	res.status(200).json(user);
};

// Update User Profile (Self-Update)
export const updateUserProfile = async (req, res) => {
	try {
		const updates = req.body;

		// Validate the updates
		if (updates.password) {
			return res
				.status(402)
				.json({ message: "Password change is not accepted in this route" });
		}

		// Update user details
		const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
			new: true,
		});
		if (!updatedUser) {
			return res.status(404).json({ message: "User not found." });
		}

		res
			.status(200)
			.json({ message: "Profile updated successfully.", user: updatedUser });
	} catch (error) {
		res.status(500).json({ message: "Error updating profile." });
	}
};

// Get All Users (Admin Only)
export const getAllUsers = async (req, res) => {
	try {
		if (req.user.role !== "admin") {
			return res
				.status(403)
				.json({ message: "Only admin can view all users." });
		}

		const users = await User.find({isActive:true}).select("-password"); // Don't send password in the response
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: "Error fetching users" });
	}
};

export const getUsersByRole = async (req, res) => {
	try {
		const { role } = req.body;

		const users = await User.find({ role}).select("-password").populate('courses', 'name'); // Don't send password in the response
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: "Error fetching users" });
	}
};

export const changePassword = async (req, res) => {
	try {
		const { oldPassword, newPassword } = req.body;

		// Validate the input
		if (!oldPassword || !newPassword) {
			return res
				.status(400)
				.json({ message: "Old password and new password are required." });
		}

		// Find the user from the token (from req.user)
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		// Check if the old password is correct
		const isMatch = await user.comparePassword(oldPassword);
		if (!isMatch) {
			return res.status(400).json({ message: "Old password is incorrect." });
		}

		user.password = newPassword;
		await user.save();

		res.status(200).json({ message: "Password successfully updated." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error changing password." });
	}
};

//Admin Password Change

export const adminChangePassword = async (req, res) => {
	try {
		// Ensure the user is an admin
		if (!req.user.role === "admin") {
			return res.status(403).json({ message: "Access denied. Admins only." });
		}

		const { userId, newPassword } = req.body;

		// Validate the input
		if (!userId || !newPassword) {
			return res
				.status(400)
				.json({ message: "User ID and new password are required." });
		}

		// if (newPassword.length < 6) {
		//   return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
		// }

		// Find the user by ID
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		// Update the user's password (will be hashed automatically due to the pre-save hook)
		user.password = newPassword; // Setting the password directly will trigger the pre-save hook for hashing
		await user.save();

		// Send the response
		res
			.status(200)
			.json({ message: "Password successfully changed for the user." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error changing user password." });
	}
};
