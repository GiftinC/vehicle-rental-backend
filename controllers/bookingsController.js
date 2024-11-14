import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import User from '../models/User.js';

// Create Booking:
export const createBooking = async (req, res) => {
   // console.log("Received request to create booking:", req.body);

    try {
        const { vehicleId, startDate, endDate } = req.body;
        const userId = req.userId;

        if (!startDate || !endDate) {
          //  console.log("Error: Start date and end date are required");
            return res.status(400).json({ message: "Start date and end date are required" });
        }

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
          //  console.log("Error: Vehicle not found with ID:", vehicleId);
            return res.status(404).json({ message: "Vehicle not found" });
        }

        const rentalPrice = vehicle.rentalPrice;
        const totalDays = (new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24);

        if (totalDays <= 0) {
         // console.log("Error: End date must be later than start date");
            return res.status(400).json({ message: "End date must be later than start date" });
        }

        const totalAmount = totalDays * rentalPrice;
      // console.log("Total Days:", totalDays);
       // console.log("Total Amount:", totalAmount);

        const newBooking = new Booking({
            user: userId,
            vehicle: vehicleId,
            startDate,
            endDate,
            totalAmount
        });
        await newBooking.save();
       // console.log("New booking created:", newBooking);

        const user = await User.findById(userId);
        if (!user) {
          //  console.log("Error: User not found with ID:", userId);
            return res.status(404).json({ message: "User not found" });
        }

        // Update user's bookings array and totalSpent
        user.bookings.push(newBooking._id);
        user.totalSpent += totalAmount;
        await user.save();
      // console.log("User updated with new booking and total spent:", user);

        res.status(201).json({ message: "Booking Created Successfully", bookingId: newBooking._id, booking: newBooking });
    } catch (error) {
        console.error("Error in createBooking function:", error.message);
        res.status(500).json({ message: "Error Creating Booking", error: error.message });
    }
};

//Get all Bookings per User:
export const getUserBookings = async (req, res) => {
    try {
        const userBookings = await Booking.find({ user: req.userId }).populate("vehicle");

        // If no bookings are found, return an empty array with a 200 status
        if (userBookings.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(userBookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: "Error Fetching Bookings", error: error.message });
    }
};


//cancel a Booking:
export const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.status === "Confirmed") {
            return res.status(400).json({ message: "Cannot cancel confirmed booking" });
        }

        booking.status = "Cancelled";  // Update the status to "Cancelled"
        await booking.save();

        res.status(200).json({ message: "Booking Cancelled Successfully" });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: "Error Cancelling Booking", error: error.message });
    }
};

// Fetch booking details by booking ID:
export const getBookingDetails = async( req , res) => {
    const { bookingId } = req.params;
    try {
        const booking = await Booking.findById(bookingId).populate("vehicle");
        if (!booking) {
            return res.status(404).json({ message: "Booking not Found" });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Booking Details", error: error.message });
    }
}

export const bookingConfirm = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: "Confirmed" },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json({ message: "Booking status updated to Confirmed", booking: updatedBooking });
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ message: "Failed to update booking status" });
    }
};

