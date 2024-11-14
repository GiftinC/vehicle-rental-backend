import e from "cors";
import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.avatar = avatar || user.avatar;

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDashboardData = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({
            path: "bookings",
            populate: { path: "vehicle" }  // Populate vehicle details in each booking
        });

        if (!user) {
            return res.status(404).json({ message: "User not Found" });
        }

        const totalBookings = user.bookings.length;
        const totalSpent = user.bookings.reduce((acc, booking) => acc + booking.totalAmount, 0);

        res.json({
            totalBookings,
            totalSpent,
            bookings: user.bookings
        });
    } catch (error) {
        console.error("Error in getDashboardData:", error.message);
        res.status(500).json({ error: error.message });
    }
};





