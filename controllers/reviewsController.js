import Review from "../models/review.js";

// Add a new review:
export const addReview = async (req, res) => {
    const { vehicleId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId;

    try {
        const review = new Review({ user: userId, vehicle: vehicleId, rating, comment });
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        console.error("Error saving review:", error);
        res.status(500).json({ error: "Error saving review" });
    }
};

// Get reviews for a specific vehicle:
export const getReviewDetails = async (req, res) => {
    const { vehicleId } = req.params;

    try {
        const reviews = await Review.find({ vehicle: vehicleId }).populate("user", "name");
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Error fetching reviews" });
    }
};

// Delete a specific review:
export const deleteReview = async (req, res) => {
    const { id } = req.params;  // Assuming 'id' is the review ID in the route

    try {
        const review = await Review.findByIdAndDelete(id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ error: "Error deleting review" });
    }
};

// Update a specific review:
export const updateReview = async (req, res) => {
    const { id } = req.params;  // Assuming 'id' is the review ID in the route
    const { rating, comment } = req.body;

    try {
        const review = await Review.findByIdAndUpdate(
            id,
            { rating, comment },
            { new: true }
        );
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.json({ message: "Review updated successfully", review });
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ error: "Error updating review" });
    }
};
